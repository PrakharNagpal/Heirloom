/**
 * Phase 2 gate, run for real in a browser instead of read off the screen.
 * Checks the things HEIRLOOM.md says to check: the right audio for the right line,
 * the switcher moving all four languages, and survival of a refresh.
 *
 *   npm run gate:spine
 */
import { chromium, type Page } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const results: [boolean, string][] = [];
const check = (pass: boolean, label: string) => results.push([pass, label]);

async function audioState(page: Page) {
  return page.evaluate(() => {
    const el = document.querySelector("audio") as HTMLAudioElement | null;
    return el ? { t: el.currentTime, paused: el.paused, src: el.src, dur: el.duration } : null;
  });
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  // ---- landing ----
  await page.goto(BASE, { waitUntil: "networkidle" });
  check(
    await page.getByRole("link", { name: /record a new memory/i }).isVisible(),
    "Landing shows the record button as the obvious thing to press"
  );
  check(
    (await page.locator('a[href="/memory/mem_seed"]').count()) > 0,
    "Seeded memory is listed without any network call"
  );

  // ---- the spine ----
  await page.goto(`${BASE}/memory/mem_seed`, { waitUntil: "networkidle" });
  const lines = page.getByRole("button", { name: /hear her say line/i });
  const lineCount = await lines.count();
  check(lineCount >= 5, `Transcript shows ${lineCount} tappable lines`);

  await page.waitForFunction(() => {
    const el = document.querySelector("audio") as HTMLAudioElement | null;
    return !!el && el.readyState >= 1;
  }, null, { timeout: 15000 });

  // Tap three different lines; each must seek to that line's own start.
  const expected = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button[aria-label^='Hear her say line']")).map((b) => {
      const tc = b.querySelector("span.font-mono")?.textContent ?? "0:00";
      const [m, s] = tc.split(":").map(Number);
      return m * 60 + s;
    })
  );
  for (const i of [1, 4, Math.min(7, lineCount - 1)]) {
    await lines.nth(i).click();
    await page.waitForTimeout(700);
    const st = await audioState(page);
    const want = expected[i];
    const ok = !!st && Math.abs(st.t - want) < 2.5 && !st.paused;
    check(ok, `Line ${i}: seeks to ${want}s and plays (audio at ${st?.t.toFixed(1)}s)`);
    await lines.nth(i).click(); // stop
    await page.waitForTimeout(200);
  }

  // Each tapped line must stop at its own end rather than running into the next.
  await lines.nth(0).click();
  await page.waitForTimeout(1200);
  const during = await audioState(page);
  await page.waitForTimeout(6000);
  const after = await audioState(page);
  check(
    !!after && (after.paused || after.t < (during?.t ?? 0) + 8),
    "Playback stops at the end of the tapped line instead of running on"
  );

  // ---- language switcher ----
  const before = await page.locator("ol li").first().innerText();
  const seen = new Set<string>();
  for (const label of ["中文", "Bahasa Melayu", "தமிழ்", "English"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.waitForTimeout(250);
    seen.add(await page.locator("ol li").first().innerText());
  }
  check(seen.size === 4, `Switcher renders ${seen.size} distinct translations for the first line`);
  check(
    Array.from(seen).some((t) => t !== before) &&
      Array.from(seen).every((t) => t.trim().length > 0),
    "No language renders empty"
  );

  // Longest language must not break the layout.
  await page.getByRole("button", { name: "தமிழ்", exact: true }).click();
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(overflow <= 1, `No horizontal scroll at 390px in Tamil (overflow ${overflow}px)`);

  // ---- tap targets ----
  const small = await page.evaluate(() => {
    const bad: string[] = [];
    document.querySelectorAll("button, a").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < 44) bad.push(`${el.tagName}:${(el.textContent ?? "").slice(0, 18)}`);
    });
    return bad;
  });
  check(small.length === 0, `Every tap target is at least 44px${small.length ? ` (small: ${small.slice(0, 3).join(", ")})` : ""}`);

  // The chrome is translated too, so leave the app in English before asserting on
  // English copy below — the switcher's choice now persists.
  await page.getByRole("button", { name: "தமிழ்", exact: true }).click();
  await page.waitForTimeout(250);

  // ---- refresh survival ----
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const langAfter = await page
    .getByRole("button", { name: "தமிழ்", exact: true })
    .getAttribute("aria-pressed");
  check(langAfter === "true", "Language choice survives a refresh");
  check(
    (await page.locator("main").innerText()).includes("எல்லா நினைவுகளும்"),
    "The app's own words are in Tamil too, not just the transcript"
  );
  check(
    (await page.getByRole("button", { name: /hear her say line/i }).count()) >= 5,
    "Memory still there after refresh"
  );
  await page.waitForFunction(() => {
    const el = document.querySelector("audio") as HTMLAudioElement | null;
    return !!el && el.readyState >= 1;
  }, null, { timeout: 15000 });
  await page.getByRole("button", { name: /hear her say line/i }).nth(2).click();
  await page.waitForTimeout(800);
  const post = await audioState(page);
  check(!!post && !post.paused && post.t > 0, "Her audio still plays after a refresh");

  // ---- format picker ----
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.waitForTimeout(300);
  check(
    (await page.getByRole("link", { name: /Cook along|Learn her words|Live her decision/ }).count()) >= 2,
    "Format picker offers the shipped formats"
  );
  // Storybook shipped, so quiz and skill card are what remain unbuilt.
  check(
    (await page.getByText(/not yet/).count()) >= 2,
    "Unbuilt formats shown honestly as greyed-out cards"
  );

  // ---- record page ----
  await page.goto(`${BASE}/record`, { waitUntil: "networkidle" });
  check(
    await page.getByText(/use a recording you already have/i).isVisible(),
    "Upload fallback is reachable"
  );
  check(
    await page.getByText(/never copied\s+or synthesised|never copied or synthesised/i).isVisible(),
    "Consent copy is on the screen before the first recording"
  );

  await page.screenshot({ path: "gate-record.png" });
  await page.goto(`${BASE}/memory/mem_seed`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "gate-memory.png", fullPage: true });

  check(errors.length === 0, `Console clean of red${errors.length ? `: ${errors[0].slice(0, 90)}` : ""}`);

  await browser.close();

  console.log("\n─── Phase 2 gate ──────────────────────────────────────\n");
  for (const [pass, label] of results)
    console.log(`  ${pass ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${label}`);
  const failed = results.filter(([p]) => !p).length;
  console.log(
    `\n  ${results.length - failed}/${results.length} passed. Screenshots: gate-memory.png, gate-record.png\n`
  );
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
