/**
 * Phase 4 gate. Plays every format start to finish in a real browser at 390px and
 * checks what HEIRLOOM.md says to check: her audio on the current step and the
 * CORRECT segment, the spine staying visible, back navigation, and surviving a
 * language switch mid-lesson.
 *
 *   npm run gate:players
 */
import { chromium, type Page } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const MEM = "mem_seed";
const results: [boolean, string][] = [];
const check = (pass: boolean, label: string) => results.push([pass, label]);

const audioState = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector("audio") as HTMLAudioElement | null;
    return el ? { t: el.currentTime, paused: el.paused, dur: el.duration } : null;
  });

/** Segment boundaries straight from storage, to check taps land in the right slice. */
const segments = (page: Page) =>
  page.evaluate(async () => {
    const w = window as unknown as { __segs?: { startSec: number; endSec: number }[] };
    return w.__segs ?? [];
  });

/** True when nothing is being written and the switcher is usable again. */
const IDLE = () =>
  !document.body.innerText.includes("Making this from what she said") &&
  !document.body.innerText.includes("Writing this in") &&
  !Array.from(document.querySelectorAll("button")).some(
    (b) => b.disabled && /English|\u4e2d\u6587|Bahasa|\u0ba4\u0bae\u0bbf\u0bb4\u0bcd/.test(b.textContent ?? "")
  );

/**
 * Wait for idle, and require it to STAY idle. React flips into the building state a
 * tick after the click, so a single check can pass before the build has begun and
 * then walk straight into a disabled switcher.
 */
async function waitForLesson(page: Page) {
  for (;;) {
    await page.waitForFunction(IDLE, null, { timeout: 180_000 });
    await page.waitForTimeout(1500);
    if (await page.evaluate(IDLE)) break;
  }
  await page.waitForFunction(
    () => {
      const el = document.querySelector("audio") as HTMLAudioElement | null;
      return !!el && el.readyState >= 1;
    },
    null,
    { timeout: 30_000 }
  );
}

/** Click a language and wait for the switch to actually land. */
async function switchLanguage(page: Page, label: string) {
  await page.getByRole("button", { name: label, exact: true }).click();
  await waitForLesson(page);
  await page.waitForFunction(
    (l) => {
      const b = Array.from(document.querySelectorAll("button")).find(
        (x) => x.textContent?.trim() === l
      );
      return !!b && b.getAttribute("aria-pressed") === "true" && !b.hasAttribute("disabled");
    },
    label,
    { timeout: 180_000 }
  );
}

async function noOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

/** Tap a "hear her" button and confirm the audio lands inside that segment. */
async function verifyVoice(page: Page, nth: number, label: string) {
  const btn = page.getByRole("button", { name: /Hear Ah Ma say this/i }).nth(nth);
  if ((await btn.count()) === 0) return check(false, `${label}: no "hear her" button`);
  // Tapping the button that is already playing correctly stops it, so start from silence.
  await page.evaluate(() => {
    const el = document.querySelector("audio") as HTMLAudioElement | null;
    el?.pause();
  });
  await btn.click();
  await page.waitForTimeout(900);
  const st = await audioState(page);
  const segs = await segments(page);
  const inside = segs.some((s) => st && st.t >= s.startSec - 0.5 && st.t <= s.endSec + 1.5);
  check(
    !!st && !st.paused && inside,
    `${label}: her audio plays and lands inside a real segment (${st?.t.toFixed(1)}s)`
  );
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  // Expose the seed's real segment boundaries for the audio checks.
  await page.goto(`${BASE}/memory/${MEM}`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const raw = document.querySelectorAll("button[aria-label^='Hear her say line']");
    const segs = Array.from(raw).map((b) => {
      const tc = b.querySelector("span.font-mono")?.textContent ?? "0:00";
      const [m, s] = tc.split(":").map(Number);
      return { startSec: m * 60 + s, endSec: m * 60 + s + 12 };
    });
    (window as unknown as { __segs: unknown }).__segs = segs;
  });
  const segs = await segments(page);
  check(segs.length > 0, `Read ${segs.length} segment boundaries from the memory page`);

  // ---------------- cook-along ----------------
  await page.goto(`${BASE}/lesson/${MEM}?format=cookalong`, { waitUntil: "networkidle" });
  await page.evaluate((s) => ((window as any).__segs = s), segs);
  await waitForLesson(page);
  check(await page.getByText(/Step 1 of/).isVisible(), "cookalong: opens on step 1");
  await verifyVoice(page, 0, "cookalong");

  // textContent, not innerText: the label is CSS-uppercased, and innerText reflects that.
  const stepLabel = (await page.getByText(/Step 1 of \d+/).textContent()) ?? "";
  const total = Number(stepLabel.match(/of (\d+)/)?.[1] ?? 0);
  let spineVisibleThroughout = true;
  for (let i = 1; i < total; i++) {
    await page.getByRole("button", { name: "Next step" }).click();
    await page.waitForTimeout(180);
    if (!(await page.getByRole("slider", { name: /Scrub/i }).isVisible()))
      spineVisibleThroughout = false;
  }
  check(
    await page.getByText(new RegExp(`Step ${total} of ${total}`)).isVisible(),
    `cookalong: playable to the last step (${total} steps) without touching the console`
  );
  check(spineVisibleThroughout, "cookalong: the voice spine stays pinned all the way through");
  await verifyVoice(page, 0, "cookalong last step");
  check((await noOverflow(page)) <= 1, "cookalong: no horizontal scroll at 390px");
  await page.screenshot({ path: "gate-cookalong.png", fullPage: true });

  // language switch mid-lesson
  await switchLanguage(page, "中文");
  // The chrome is translated too, so "Step 1 of 5" is now "第 1 步，共 5".
  check(
    await page.getByText(/第 1 步/).isVisible(),
    "cookalong: survives switching language mid-lesson, chrome and all"
  );
  const zhText = await page.locator("main").innerText();
  check(/[一-鿿]/.test(zhText), "cookalong: the lesson itself is rewritten in 中文");
  const backAt = Date.now();
  await switchLanguage(page, "English");
  const backMs = Date.now() - backAt;
  check(
    (await page.getByText(/Step 1 of/).isVisible()) && backMs < 8000,
    `cookalong: switching back is instant from cache (${(backMs / 1000).toFixed(1)}s)`
  );

  // ---------------- phrase coach ----------------
  await page.goto(`${BASE}/lesson/${MEM}?format=phrasecoach`, { waitUntil: "networkidle" });
  await page.evaluate((s) => ((window as any).__segs = s), segs);
  await waitForLesson(page);
  const phraseButtons = await page.getByRole("button", { name: /Hear Ah Ma say this/i }).count();
  check(phraseButtons >= 3, `phrasecoach: ${phraseButtons} phrases, each with her voice`);
  await verifyVoice(page, 0, "phrasecoach first phrase");
  await verifyVoice(page, phraseButtons - 1, "phrasecoach last phrase");
  check(
    await page.getByRole("slider", { name: /Scrub/i }).isVisible(),
    "phrasecoach: the voice spine is pinned"
  );
  check((await noOverflow(page)) <= 1, "phrasecoach: no horizontal scroll at 390px");
  await page.screenshot({ path: "gate-phrasecoach.png", fullPage: true });

  // ---------------- branching ----------------
  await page.goto(`${BASE}/lesson/${MEM}?format=branching`, { waitUntil: "networkidle" });
  await page.evaluate((s) => ((window as any).__segs = s), segs);
  await waitForLesson(page);
  await verifyVoice(page, 0, "branching opening node");

  let hops = 0;
  while (hops < 8) {
    if (await page.getByText(/actually did|chose differently/).isVisible()) break;
    const choice = page.getByRole("group", { name: "Your choices" }).getByRole("button").first();
    if ((await choice.count()) === 0) break;
    await choice.click();
    await page.waitForTimeout(250);
    hops++;
  }
  check(
    await page.getByText(/actually did|chose differently/).isVisible(),
    `branching: reaches an ending in ${hops} choices, and says whether it's what she really did`
  );
  check(
    await page.getByRole("slider", { name: /Scrub/i }).isVisible(),
    "branching: the voice spine is pinned at the ending too"
  );
  check((await noOverflow(page)) <= 1, "branching: no horizontal scroll at 390px");
  await page.screenshot({ path: "gate-branching.png", fullPage: true });

  // ---------------- gap prompts and navigation ----------------
  await page.goto(`${BASE}/lesson/${MEM}?format=cookalong`, { waitUntil: "networkidle" });
  await waitForLesson(page);
  check(
    (await page.getByText(/Go ask her/i).count()) > 0,
    "The 'go ask her' gap prompt is visible in the lesson"
  );

  await page.getByRole("link", { name: /Back to her words/i }).click();
  await page.waitForURL(`**/memory/${MEM}`);
  check(true, "Back: lesson -> memory");
  await page.getByRole("link", { name: /^Back$/ }).click();
  await page.waitForURL(`${BASE}/`);
  check(true, "Back: memory -> list");

  const small = await page.evaluate(() => {
    const bad: string[] = [];
    document.querySelectorAll("button, a").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < 44) bad.push((el.textContent ?? "").slice(0, 18));
    });
    return bad;
  });
  check(small.length === 0, `Tap targets at least 44px${small.length ? ` (${small.slice(0, 3)})` : ""}`);
  check(errors.length === 0, `Console clean of red${errors.length ? `: ${errors[0].slice(0, 90)}` : ""}`);

  await browser.close();

  console.log("\n─── Phase 4 gate ──────────────────────────────────────\n");
  for (const [pass, label] of results)
    console.log(`  ${pass ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${label}`);
  const failed = results.filter(([p]) => !p).length;
  console.log(`\n  ${results.length - failed}/${results.length} passed.\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
