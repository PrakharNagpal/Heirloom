/**
 * Phase 5 gate: design tokens, the safety UI, and copy.
 *
 * The checks HEIRLOOM.md asks for — tokens actually applied, gold-leaf spent ONCE,
 * 18px body minimum, gap prompts visibly distinct, uncertain segments underlined and
 * tappable, a human empty state, and no jargon anywhere.
 *
 *   npm run gate:design
 */
import { chromium, type Page } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const results: [boolean, string][] = [];
const check = (pass: boolean, label: string) => results.push([pass, label]);

const TOKENS = {
  lacquer: "rgb(14, 59, 62)",
  kueh: "rgb(217, 106, 138)",
  gold: "rgb(201, 162, 39)",
  rice: "rgb(251, 247, 238)",
};

/** Every colour actually painted on the page, with what painted it. */
async function paintedColours(page: Page) {
  return page.evaluate(() => {
    const seen: { colour: string; where: string; prop: string }[] = [];
    document.querySelectorAll("*").forEach((el) => {
      const s = getComputedStyle(el);
      const tag = `${el.tagName.toLowerCase()}:${(el.textContent ?? "").trim().slice(0, 24)}`;
      for (const prop of ["color", "backgroundColor", "borderTopColor", "borderLeftColor", "textDecorationColor"]) {
        const v = s[prop as "color"];
        if (v && v !== "rgba(0, 0, 0, 0)" && v !== "rgb(0, 0, 0)") seen.push({ colour: v, where: tag, prop });
      }
    });
    return seen;
  });
}

/** Which distinct elements use gold in any form. */
async function goldUsers(page: Page) {
  const painted = await paintedColours(page);
  return painted
    .filter((p) => p.colour.includes("201, 162, 39"))
    .map((p) => `${p.where} (${p.prop})`);
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  // ---- tokens applied ----
  await page.goto(BASE, { waitUntil: "networkidle" });
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check(bodyBg === TOKENS.lacquer, `Ground is lacquer, not default white (${bodyBg})`);

  const bodySize = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  check(bodySize >= 18, `Body type is ${bodySize}px — 18px minimum`);

  const tooSmall = await page.evaluate(() =>
    Array.from(document.querySelectorAll("p, li, button, a, span"))
      .filter((el) => {
        const s = getComputedStyle(el);
        const size = parseFloat(s.fontSize);
        const text = (el.textContent ?? "").trim();
        // Labels and timecodes are allowed to be small; running prose is not.
        return text.length > 40 && size < 15 && el.children.length === 0;
      })
      .map((el) => `${parseFloat(getComputedStyle(el).fontSize)}px: ${(el.textContent ?? "").slice(0, 30)}`)
  );
  check(tooSmall.length === 0, `No prose under 15px${tooSmall.length ? ` (${tooSmall[0]})` : ""}`);

  const usesDisplayFace = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).fontFamily.toLowerCase().includes("fraunces") : false;
  });
  check(usesDisplayFace, "Display face (Fraunces) is on the headline, not system sans");

  const kuehSomewhere = (await paintedColours(page)).some((p) => p.colour.includes("217, 106, 138"));
  check(kuehSomewhere, "Kueh-rose accent is present");

  // ---- gold-leaf: exactly one place, and it is the memory-saved moment ----
  const landingGold = await goldUsers(page);
  await page.goto(`${BASE}/memory/mem_seed`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const memoryGold = await goldUsers(page);
  await page.goto(`${BASE}/record`, { waitUntil: "networkidle" });
  const recordGold = await goldUsers(page);

  check(
    landingGold.length === 0 && memoryGold.length === 0 && recordGold.length === 0,
    `Gold-leaf is unspent on the everyday screens${
      [...landingGold, ...memoryGold, ...recordGold].length
        ? ` — found on ${[...landingGold, ...memoryGold, ...recordGold].slice(0, 2).join(", ")}`
        : ""
    }`
  );

  // The one place it is allowed: the moment her memory is kept.
  await page.goto(`${BASE}/kept-preview`, { waitUntil: "networkidle" }).catch(() => {});
  const keptGold = await goldUsers(page);
  check(keptGold.length > 0, `Gold-leaf IS spent on the memory-kept moment (${keptGold.length} elements)`);

  // ---- gap prompts visibly distinct ----
  // Not networkidle: writing the lesson is a ~20s request, so the network never
  // goes quiet before the timeout.
  await page.goto(`${BASE}/lesson/mem_seed?format=cookalong`, { waitUntil: "domcontentloaded" });
  // Wait for real content, not for the absence of the loading line — at
  // domcontentloaded the loading line has not been painted yet either.
  await page.getByText(/Step 1 of/).waitFor({ state: "visible", timeout: 180_000 });
  await page.waitForTimeout(400);
  const gap = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("p")).find((p) =>
      /go ask her/i.test(p.textContent ?? "")
    );
    if (!el) return null;
    const s = getComputedStyle(el);
    const body = Array.from(document.querySelectorAll("p")).find(
      (p) => !/go ask her/i.test(p.textContent ?? "") && (p.textContent ?? "").length > 40
    );
    const bs = body ? getComputedStyle(body) : null;
    return {
      borderStyle: s.borderTopStyle,
      borderColor: s.borderTopColor,
      bg: s.backgroundColor,
      differsFromBody: !bs || s.backgroundColor !== bs.backgroundColor || s.borderTopStyle !== bs.borderTopStyle,
    };
  });
  check(!!gap, "A gap prompt is on screen");
  check(
    !!gap && gap.borderStyle === "dashed" && gap.differsFromBody,
    `Gap prompt is visibly a different kind of thing (${gap?.borderStyle} border, own background)`
  );

  // ---- uncertain segments: underlined and tappable ----
  // The seed's synthetic audio produced no uncertain words, so the rendering is
  // exercised against a memory that has one. Real dialect audio is still untested.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const raw = window.localStorage.getItem("heirloom.memories.v1");
    const list = raw ? JSON.parse(raw) : [];
    const seedRes = document.createElement("div");
    seedRes.remove();
    list.unshift({
      peaks: Array.from({ length: 40 }, () => 0.5),
      memory: {
        id: "mem_uncertain",
        createdAt: new Date().toISOString(),
        audioUrl: "/synthetic-test.wav",
        durationSec: 53,
        sourceLanguage: "Teochew",
        speakerName: "Ah Ma",
        title: "试",
        titleTranslated: "Test",
        titleTranslations: { en: "Test" },
        summary: "",
        era: null,
        places: [],
        people: [],
        skills: [],
        emotionalCore: "",
        suggestedFormats: [],
        segments: [
          { startSec: 0, endSec: 5, originalText: "伊讲个话我听无", uncertain: true, translations: { en: "A word here we could not place" } },
          { startSec: 5, endSec: 10, originalText: "然后就好了", translations: { en: "And then it was done" } },
        ],
      },
    });
    window.localStorage.setItem("heirloom.memories.v1", JSON.stringify(list));
  });
  await page.goto(`${BASE}/memory/mem_uncertain`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const unc = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("span")).find((s) =>
      (s.textContent ?? "").includes("伊讲个话我听无")
    );
    if (!el) return null;
    const s = getComputedStyle(el);
    const btn = el.closest("button");
    return {
      line: s.textDecorationLine,
      style: s.textDecorationStyle,
      colour: s.textDecorationColor,
      tappable: !!btn,
      hint: document.body.innerText.includes("not certain"),
    };
  });
  check(!!unc && unc.line.includes("underline") && unc.style === "dotted", `Uncertain word is dotted-underlined (${unc?.style})`);
  check(!!unc && unc.tappable, "Uncertain segment is tappable to hear her say it");
  check(!!unc && unc.hint, "It says plainly that we are not certain, rather than hiding it");

  // ---- empty state ----
  await page.evaluate(() => window.localStorage.clear());
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const seeded = await page.locator('a[href="/memory/mem_seed"]').count();
  check(seeded > 0, "With storage cleared, the seeded memory still carries the demo");

  // ---- no jargon anywhere ----
  const JARGON = /\b(generate|generating|generated|process(ing)?|AI|LLM|prompt|token|API|submit|upload your data|transcription engine)\b/;
  const pages = ["/", "/record", "/memory/mem_seed"];
  const offenders: string[] = [];
  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const text = await page.locator("main").innerText();
    for (const line of text.split("\n")) if (JARGON.test(line)) offenders.push(`${path}: ${line.trim().slice(0, 60)}`);
  }
  check(offenders.length === 0, `No jargon in the UI copy${offenders.length ? ` — ${offenders[0]}` : ""}`);

  check(errors.length === 0, `No page errors${errors.length ? `: ${errors[0].slice(0, 80)}` : ""}`);

  await browser.close();

  console.log("\n─── Phase 5 gate ──────────────────────────────────────\n");
  for (const [pass, label] of results)
    console.log(`  ${pass ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${label}`);
  const failed = results.filter(([p]) => !p).length;
  console.log(`\n  ${results.length - failed}/${results.length} passed.\n`);
  console.log("  Still yours to do:");
  console.log("    · Hand the phone to a stranger over 60 and watch them try to record.\n");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
