/**
 * Phase 6 gate — the freeze.
 *
 * The one HEIRLOOM.md says never to skip: network off, reload, does the seeded
 * memory render and play? Run against a PRODUCTION build, in a fresh profile with
 * no localStorage, because that is what a judge's phone is.
 *
 *   npm run gate:freeze
 */
import { chromium, type Page } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const results: [boolean, string][] = [];
const check = (pass: boolean, label: string) => results.push([pass, label]);

async function swReady(page: Page) {
  await page.waitForFunction(
    () => navigator.serviceWorker?.controller !== null || !!navigator.serviceWorker?.controller,
    null,
    { timeout: 20_000 }
  );
}

async function main() {
  const browser = await chromium.launch();
  // Fresh profile: no localStorage, no cache — exactly an incognito window.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  // ---- warm the worker, the way a demo would: open the app once, online ----
  await page.goto(BASE, { waitUntil: "networkidle" });
  const registered = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker?.ready;
    return !!reg?.active;
  });
  check(registered, "Service worker installs and activates");

  await page.goto(`${BASE}/memory/mem_seed`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.goto(`${BASE}/lesson/mem_seed?format=cookalong`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const generatedOnline = await page.evaluate(() =>
    performance.getEntriesByType("resource").some((r) => r.name.includes("/api/generate"))
  );
  check(!generatedOnline, "Opening a lesson makes no call to the model — it ships pre-written");

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500); // let the precache settle
  await swReady(page);

  // ---- pull the plug ----
  await ctx.setOffline(true);
  const requestsWhileOffline: string[] = [];
  page.on("requestfailed", (r) => requestsWhileOffline.push(r.url()));

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  check(
    (await page.locator('a[href="/memory/mem_seed"]').count()) > 0,
    "OFFLINE: the landing page reloads and lists her memory"
  );

  await page.goto(`${BASE}/memory/mem_seed`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const lines = await page.getByRole("button", { name: /Hear her say line/i }).count();
  check(lines >= 5, `OFFLINE: the transcript renders (${lines} lines)`);

  // Her audio, from cache.
  await page.waitForFunction(
    () => {
      const el = document.querySelector("audio") as HTMLAudioElement | null;
      return !!el && el.readyState >= 2;
    },
    null,
    { timeout: 25_000 }
  );
  await page.getByRole("button", { name: /Hear her say line/i }).nth(2).click();
  await page.waitForTimeout(1200);
  const audio = await page.evaluate(() => {
    const el = document.querySelector("audio") as HTMLAudioElement | null;
    return el ? { t: el.currentTime, paused: el.paused, err: el.error?.code ?? null } : null;
  });
  check(
    !!audio && !audio.paused && audio.t > 0 && audio.err === null,
    `OFFLINE: her voice plays from cache (at ${audio?.t.toFixed(1)}s)`
  );

  // All four languages, on BOTH seeded memories, with no network to translate with.
  for (const id of ["mem_seed", "mem_seed_en"]) {
    await page.goto(`${BASE}/memory/${id}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    const rendered = new Set<string>();
    for (const label of ["English", "中文", "Bahasa Melayu", "தமிழ்"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await page.waitForTimeout(400);
      rendered.add(await page.locator("ol li").first().innerText());
    }
    check(
      rendered.size === 4,
      `OFFLINE: ${id} renders all four languages from the bundle (${rendered.size}/4)`
    );
  }
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.waitForTimeout(300);

  // Every lesson, with no network to write one.
  for (const format of ["cookalong", "phrasecoach", "branching", "storybook"]) {
    await page.goto(`${BASE}/lesson/mem_seed?format=${format}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    // Format-agnostic and meaningful: every player renders at least one
    // "hear her say this" button, and none of them should show the error state.
    const built = await page.getByRole("button", { name: /Hear Ah Ma say this/i }).count();
    const errored = await page.getByText(/didn't come through|Making this from what she said/i).count();
    check(
      built > 0 && errored === 0,
      `OFFLINE: the ${format} lesson plays without asking the model for anything`
    );
  }

  await page.goto(`${BASE}/lesson/mem_seed?format=cookalong`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  check(
    (await page.getByText(/Go ask her|போய் கேளுங்க|去问她|Pergi tanya dia/).count()) > 0,
    "OFFLINE: the gap prompt is still on screen"
  );

  await ctx.setOffline(false);
  await page.screenshot({ path: "gate-offline.png", fullPage: true });
  check(errors.length === 0, `No page errors offline${errors.length ? `: ${errors[0].slice(0, 80)}` : ""}`);

  // Both seeded memories, not just the first — a demo that only half works offline
  // is a demo that fails on the half you happen to open.
  for (const id of ["mem_seed", "mem_seed_en"]) {
    await page.goto(`${BASE}/lesson/${id}?format=storybook`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1800);
    const drawn = await page.locator("ol li img").count();
    check(drawn === 6, `OFFLINE: ${id}'s picture book shows all six drawings (${drawn})`);
  }

  // ---- what a second device sees ----
  const fresh = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const p2 = await fresh.newPage();
  await p2.goto(BASE, { waitUntil: "networkidle" });
  await p2.waitForTimeout(600);
  check(
    (await p2.locator('a[href="/memory/mem_seed"]').count()) > 0,
    "A device that has never seen this app still gets the demo"
  );
  await fresh.close();

  await browser.close();

  console.log("\n─── Phase 6 gate · freeze ─────────────────────────────\n");
  for (const [pass, label] of results)
    console.log(`  ${pass ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${label}`);
  const failed = results.filter(([p]) => !p).length;
  console.log(`\n  ${results.length - failed}/${results.length} passed.\n`);
  console.log("  Still yours to do:");
  console.log("    · Open the deployed URL on a teammate's phone.");
  console.log("    · Check the deploy matches local, side by side.\n");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
