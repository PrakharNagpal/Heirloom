/**
 * Players gate, against the card-list design in design.md.
 *
 * Checks what HEIRLOOM.md asks for — her audio on the right segment, playable start
 * to finish, 390px, back navigation, surviving a language switch mid-lesson — plus
 * the design spec's own rules for each screen.
 *
 *   npm run gate:players
 */
import { chromium, type Page } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const MEM = "mem_seed";
const results: [boolean, string][] = [];
const check = (pass: boolean, label: string) => results.push([pass, label]);

const AUDIO_STATE = `(() => { const el = document.querySelector("audio"); return el ? { t: el.currentTime, paused: el.paused } : null; })()`;
const AUDIO_READY = `(() => { const el = document.querySelector("audio"); return !!el && el.readyState >= 1; })()`;
const IDLE = `(() => !document.body.innerText.includes("Making this from what she said")
  && !document.body.innerText.includes("Writing this in")
  && !Array.from(document.querySelectorAll("button")).some(
       (b) => b.disabled && /English|中文|Bahasa|தமிழ்/.test(b.textContent || "")))()`;

async function openLesson(page: Page, format: string) {
  await page.goto(`${BASE}/lesson/${MEM}?format=${format}`, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.waitForFunction(AUDIO_READY, null, { timeout: 30_000 });
}

/** Wait for idle, and require it to stay idle — React flips into building a tick late. */
async function settle(page: Page) {
  for (;;) {
    await page.waitForFunction(IDLE, null, { timeout: 180_000 });
    await page.waitForTimeout(1200);
    if (await page.evaluate(IDLE)) break;
  }
}

/** Tap a "hear her" button and confirm the audio lands inside a real segment. */
async function verifyVoice(page: Page, nth: number, label: string, segs: { s: number }[]) {
  const btn = page.getByRole("button", { name: /Hear Ah Ma say this/i }).nth(nth);
  if ((await btn.count()) === 0) return check(false, `${label}: no "hear her" button`);
  await page.evaluate(`(() => { const el = document.querySelector("audio"); if (el) el.pause(); })()`);
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.waitForTimeout(900);
  const st = (await page.evaluate(AUDIO_STATE)) as { t: number; paused: boolean } | null;
  const inside = segs.some((x) => st && st.t >= x.s - 0.5 && st.t <= x.s + 14);
  check(!!st && !st.paused && inside, `${label}: her audio plays, inside a real segment (${st?.t.toFixed(1)}s)`);
}

async function noOverflow(page: Page) {
  return page.evaluate(
    `document.documentElement.scrollWidth - document.documentElement.clientWidth`
  ) as Promise<number>;
}

async function switchLanguage(page: Page, label: string) {
  await page.getByRole("button", { name: label, exact: true }).first().click();
  await settle(page);
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

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  // Real segment start times, read off the transcript.
  await page.goto(`${BASE}/memory/${MEM}`, { waitUntil: "networkidle" });
  const segs: { s: number }[] = await page.evaluate(`Array.from(
    document.querySelectorAll("button[aria-label^='Hear her say line']")
  ).map((b) => {
    const tc = (b.querySelector("span.font-mono") || {}).textContent || "0:00";
    const parts = tc.split(":");
    return { s: Number(parts[0]) * 60 + Number(parts[1]) };
  })`);
  check(segs.length > 0, `Read ${segs.length} segment start times from the transcript`);

  // ---------------- cook-along ----------------
  await openLesson(page, "cookalong");
  const steps = await page.locator("ol li").count();
  check(steps >= 3, `cookalong: ${steps} steps, all on one scrollable page`);
  check(
    (await page.locator("ol li span.bg-pandan").count()) === steps,
    "cookalong: every step has its green numbered badge"
  );
  check(
    (await page.getByRole("button", { name: /Hear Ah Ma say this/i }).count()) === steps,
    "cookalong: every step has its own play button for her audio"
  );
  await verifyVoice(page, 0, "cookalong first step", segs);
  await verifyVoice(page, steps - 1, "cookalong last step", segs);
  check((await noOverflow(page)) <= 1, "cookalong: no horizontal scroll at 390px");
  await page.screenshot({ path: "gate-cookalong.png", fullPage: true });

  // Tip and gap-prompt callouts must not look like the same thing.
  const callouts = await page.evaluate(`(() => {
    const all = Array.from(document.querySelectorAll("p"));
    const tip = all.find((p) => (p.textContent || "").indexOf("\\u{1F4A1}") >= 0);
    const gap = all.find((p) => /go ask her/i.test(p.textContent || ""));
    const st = (el) => el ? { border: getComputedStyle(el).borderTopStyle, bg: getComputedStyle(el).backgroundColor } : null;
    return { tip: st(tip), gap: st(gap) };
  })()`) as { tip: { border: string; bg: string } | null; gap: { border: string; bg: string } | null };
  check(!!callouts.gap, "cookalong: a gap prompt is on screen");
  check(
    !!callouts.gap && callouts.gap.border === "dashed",
    `cookalong: the gap prompt has the dashed gold border (${callouts.gap?.border})`
  );
  check(
    !callouts.tip || callouts.tip.border !== callouts.gap?.border,
    "cookalong: a tip and a gap prompt are visibly different kinds of thing"
  );

  // language mid-lesson
  await switchLanguage(page, "中文");
  check(/[一-鿿]/.test(await page.locator("main").innerText()), "cookalong: rewritten in 中文, chrome and all");
  const backAt = Date.now();
  await switchLanguage(page, "English");
  check(Date.now() - backAt < 9000, `cookalong: switching back is instant from cache (${((Date.now() - backAt) / 1000).toFixed(1)}s)`);

  // ---------------- phrase coach ----------------
  await openLesson(page, "phrasecoach");
  const phrases = await page.locator("ol li").count();
  check(phrases >= 3, `phrasecoach: ${phrases} phrases`);
  check(
    (await page.getByRole("button", { name: /Hear Ah Ma say this/i }).count()) === phrases,
    "phrasecoach: her voice is the pronunciation reference on every phrase"
  );
  await verifyVoice(page, 0, "phrasecoach first phrase", segs);
  await verifyVoice(page, phrases - 1, "phrasecoach last phrase", segs);
  check((await noOverflow(page)) <= 1, "phrasecoach: no horizontal scroll at 390px");
  await page.screenshot({ path: "gate-phrasecoach.png", fullPage: true });

  // ---------------- branching ----------------
  await openLesson(page, "branching");
  await verifyVoice(page, 0, "branching opening", segs);
  let hops = 0;
  while (hops < 8) {
    if (await page.getByText(/actually did|chose differently/).isVisible()) break;
    const choice = page.getByRole("group", { name: /Your choices|你的选择|Pilihan anda|உங்க தேர்வுகள்/ }).getByRole("button").first();
    if ((await choice.count()) === 0) break;
    await choice.click();
    await page.waitForTimeout(250);
    hops++;
  }
  check(
    await page.getByText(/actually did|chose differently/).isVisible(),
    `branching: reaches an ending in ${hops} choices, and says whether it is what she really did`
  );
  check((await noOverflow(page)) <= 1, "branching: no horizontal scroll at 390px");

  // ---------------- storybook ----------------
  await openLesson(page, "storybook");
  const panels = await page.locator("ol li").count();
  check(panels === 6, `storybook: six panels on one page (${panels})`);
  await verifyVoice(page, 0, "storybook first panel", segs);
  check((await noOverflow(page)) <= 1, "storybook: no horizontal scroll at 390px");

  // ---------------- shell and navigation ----------------
  await page.getByRole("link", { name: /Back to her words/i }).click();
  await page.waitForURL(`**/memory/${MEM}`);
  check(true, "Back: lesson → memory");
  await page.getByRole("link", { name: /All memories/i }).click();
  await page.waitForURL(`${BASE}/`);
  check(true, "Back: memory → home");

  check(
    await page.getByRole("navigation", { name: "Main" }).isVisible(),
    "The tab bar is present on every screen that is not Record"
  );
  await page.goto(`${BASE}/record`, { waitUntil: "networkidle" });
  check(
    (await page.getByRole("navigation", { name: "Main" }).count()) === 0,
    "The tab bar is hidden on Record, which is full-screen and hers"
  );

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const small = await page.evaluate(`(() => {
    const bad = [];
    document.querySelectorAll("button, a").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < 44) bad.push((el.textContent || "").slice(0, 18));
    });
    return bad;
  })()`) as string[];
  check(small.length === 0, `Tap targets at least 44px${small.length ? ` (${small.slice(0, 3)})` : ""}`);
  check(errors.length === 0, `Console clean of red${errors.length ? `: ${errors[0].slice(0, 90)}` : ""}`);

  await browser.close();

  console.log("\n─── Players gate ──────────────────────────────────────\n");
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
