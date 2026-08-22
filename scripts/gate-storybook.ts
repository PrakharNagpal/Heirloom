/**
 * Storybook gate — the checklist from HEIRLOOM.md Part 6.
 *
 *   npm run gate:storybook
 */
import { chromium, type Page } from "playwright";
import { SEED_LESSONS } from "../lib/seed";
import type { StorybookPayload } from "../lib/types";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const results: [boolean, string][] = [];
const check = (pass: boolean, label: string) => results.push([pass, label]);

async function openBook(page: Page, lang?: string) {
  await page.goto(`${BASE}/lesson/mem_seed?format=storybook`, { waitUntil: "domcontentloaded" });
  if (lang) {
    await page.getByRole("button", { name: lang, exact: true }).click();
    await page.waitForTimeout(500);
  }
  await page.locator("figure img").first().waitFor({ state: "visible", timeout: 60_000 });
}

async function main() {
  // ---- payload checks, before any browser ----
  const books = SEED_LESSONS.filter((l) => l.format === "storybook");
  check(books.length === 4, `Storybook ships in all four languages (${books.length})`);
  for (const b of books) {
    const p = b.payload as StorybookPayload;
    check(p.panels.length === 6, `${b.language}: six panels (${p.panels.length})`);
    const bad = p.panels.filter((x) => !Number.isInteger(x.segmentIndex) || x.segmentIndex < 0);
    check(bad.length === 0, `${b.language}: every panel points at a segment of her speech`);
    const withText = p.panels.filter((x) => /\b(text|letters?|writing|sign)\b/i.test(x.imagePrompt));
    check(withText.length === 0, `${b.language}: no panel asks for writing inside the picture`);
  }
  // Captions differ per language; the drawings are shared, so the scenes must match.
  const scenes = books.map((b) => (b.payload as StorybookPayload).panels.map((p) => p.imagePrompt).join("|"));
  check(new Set(scenes).size === 1, "All four languages share one set of drawings");

  const en = books.find((b) => b.language === "en")!.payload as StorybookPayload;
  const longest = Math.max(...en.panels.map((p) => p.caption.split(/\s+/).length));
  check(longest <= 35, `Captions stay short enough for a 7-year-old (longest ${longest} words)`);

  // ---- in the browser ----
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${BASE}/memory/mem_seed`, { waitUntil: "networkidle" });
  check(
    (await page.getByText(/not yet/).count()) === 2,
    "The storybook card is no longer greyed out (2 unbuilt formats remain)"
  );

  const t0 = Date.now();
  await openBook(page);
  const firstLoad = Date.now() - t0;
  check(true, `Book opens in ${(firstLoad / 1000).toFixed(1)}s`);

  const drewLive: boolean = await page.evaluate(
    `performance.getEntriesByType("resource").some((r) => r.name.indexOf("/api/illustrate") >= 0)`
  );
  check(!drewLive, "Panels come from the repo — nothing is drawn live");

  // Consistent shape: a book of different-shaped pages reads as broken.
  // Passed as a string: tsx compiles page.evaluate callbacks with an esbuild
  // __name helper that does not exist in the browser.
  const shapes: string[] = await page.evaluate(`(async () => {
    const out = [];
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = "/storybook/panel-" + i + ".webp";
      try { await img.decode(); } catch (e) {}
      out.push(img.naturalWidth + "x" + img.naturalHeight);
    }
    return out;
  })()`);
  check(new Set(shapes).size === 1, `All six pages are the same shape (${shapes[0]})`);

  // Her audio, on the page you are actually looking at.
  await page.waitForFunction(`(() => { const el = document.querySelector("audio"); return !!el && el.readyState >= 1; })()`, null, { timeout: 20_000 });
  const wanted = en.panels[0].segmentIndex;
  await page.getByRole("button", { name: /Hear Ah Ma say this/i }).click();
  await page.waitForTimeout(900);
  const state: { t: number; paused: boolean } | null = await page.evaluate(
    `(() => { const el = document.querySelector("audio"); return el ? { t: el.currentTime, paused: el.paused } : null; })()`
  );
  check(!!state && !state.paused && state.t > 0, `Her voice plays on page 1 (segment ${wanted}, at ${state?.t.toFixed(1)}s)`);

  // Swipe, because a six-year-old will try to. TouchEvent needs real Touch objects,
  // which only document.createTouch-style construction gives us in Chromium.
  await page.evaluate(`(() => {
    const fig = document.querySelector("figure");
    const mk = (x) => new Touch({ identifier: 1, target: fig, clientX: x, clientY: 200 });
    fig.dispatchEvent(new TouchEvent("touchstart", { touches: [mk(320)], bubbles: true }));
    fig.dispatchEvent(new TouchEvent("touchend", { changedTouches: [mk(80)], bubbles: true }));
  })()`);
  await page.waitForTimeout(400);
  const swiped = await page.locator("nav span").innerText();
  check(swiped.startsWith("2"), `Swiping turns the page (now on ${swiped})`);

  // Buttons, for anyone who does not swipe.
  await page.getByRole("button", { name: /Turn the page/i }).click();
  await page.waitForTimeout(300);
  check((await page.locator("nav span").innerText()).startsWith("3"), "Turn-the-page button works");

  for (let i = 0; i < 4; i++) {
    const next = page.getByRole("button", { name: /Turn the page/i });
    if ((await next.count()) === 0 || (await next.isDisabled())) break;
    await next.click();
    await page.waitForTimeout(250);
  }
  check(await page.getByText("The end").isVisible(), "Reaches the end of the book");

  const overflow: number = await page.evaluate(
    `document.documentElement.scrollWidth - document.documentElement.clientWidth`
  );
  check(overflow <= 1, `No horizontal scroll at 390px (${overflow}px)`);
  check(
    await page.getByText(/Drawn, not photographed/i).isVisible(),
    "Says plainly that these are drawings, not photographs of her"
  );

  // Second view is instant, from cache.
  const t1 = Date.now();
  await openBook(page);
  check(Date.now() - t1 < 4000, `Second view loads instantly (${((Date.now() - t1) / 1000).toFixed(1)}s)`);

  // Captions in all four scripts.
  for (const [label, probe] of [["中文", /[一-鿿]/], ["தமிழ்", /[஀-௿]/]] as const) {
    await openBook(page, label);
    const caption = await page.locator("figcaption").innerText();
    check(probe.test(caption), `Captions render in ${label} ("${caption.slice(0, 26)}…")`);
  }

  await page.screenshot({ path: "gate-storybook.png", fullPage: true });
  check(errors.length === 0, `No page errors${errors.length ? `: ${errors[0].slice(0, 80)}` : ""}`);
  await browser.close();

  console.log("\n─── Storybook gate ────────────────────────────────────\n");
  for (const [pass, label] of results)
    console.log(`  ${pass ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${label}`);
  const failed = results.filter(([p]) => !p).length;
  console.log(`\n  ${results.length - failed}/${results.length} passed.\n`);
  console.log("  Still yours to do:");
  console.log("    · Swipe it on a real phone, and look at all six pages as a set.\n");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
