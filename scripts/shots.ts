/**
 * README screenshots, taken off the running app rather than mocked up.
 *
 * Every shot is a real 390px browser at the seeded memories, so none of it
 * touches the model — same content a judge sees with the network off.
 *
 *   npm run dev       # in another terminal
 *   npm run shots
 */
import { chromium, type Page } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "docs/screenshots";

const IDLE = `(() => !document.body.innerText.includes("Making this from what she said")
  && !document.body.innerText.includes("Writing this in")
  && !Array.from(document.querySelectorAll("button")).some(
       (b) => b.disabled && /English|中文|Bahasa|தமிழ்/.test(b.textContent || "")))()`;

/** Wait for idle, and require it to stay idle — React flips into building a tick late. */
async function settle(page: Page) {
  for (;;) {
    await page.waitForFunction(IDLE, null, { timeout: 180_000 });
    await page.waitForTimeout(1000);
    if (await page.evaluate(IDLE)) break;
  }
}

async function shot(page: Page, name: string, url: string, prepare?: (p: Page) => Promise<void>) {
  await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.waitForLoadState("networkidle").catch(() => {});
  if (prepare) await prepare(page);
  // Freeze anything still animating so two runs produce the same picture, and
  // drop next dev's own floating badge — it is not part of the app.
  await page.addStyleTag({
    content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;
      transition-duration:0s!important;transition-delay:0s!important;caret-color:transparent!important}
      nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none!important}`,
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  const overflow = await page.evaluate(
    `document.documentElement.scrollWidth - document.documentElement.clientWidth`
  );
  console.log(`  ${name}.png${Number(overflow) > 0 ? `  ⚠ overflows by ${overflow}px` : ""}`);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  console.log(`Shooting ${BASE} at 390px…`);

  await shot(page, "home", "/");
  await shot(page, "record", "/record");
  await shot(page, "transcript", "/memory/mem_seed");
  await shot(page, "stories", "/stories");
  await shot(page, "cookalong", "/lesson/mem_seed_en?format=cookalong");
  await shot(page, "phrasecoach", "/lesson/mem_seed?format=phrasecoach");
  await shot(page, "branching", "/lesson/mem_seed_en?format=branching");
  await shot(page, "storybook", "/lesson/mem_seed_en?format=storybook", async (p) => {
    // The panel is a webp fetched at runtime; don't shoot a grey box.
    await p.waitForFunction(
      `Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0)`,
      null,
      { timeout: 30_000 }
    );
  });

  await browser.close();
  if (errors.length) {
    console.log(`\n${errors.length} page error(s):`);
    errors.forEach((e) => console.log(`  ${e}`));
  }
  console.log(`\nWrote ${OUT}/`);
}

main();
