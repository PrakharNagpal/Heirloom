/**
 * Phase 1 gate tool. Sends a real recording through the UNDERSTAND pass and
 * prints the JSON plus the checks from HEIRLOOM.md, so dialect quality can be
 * judged from the terminal before any UI exists.
 *
 *   npm run understand                 # uses public/demo.webm
 *   npm run understand -- path/to.m4a
 *   npm run models                     # what this key can actually call
 *
 * It also writes public/spot-check.html — open it and tap each line to hear the
 * exact slice the model claims those words are in. That is the timestamp check;
 * do not skip it.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { config } from "dotenv";
import { callWithFallback, credentialMode, gemini, UNDERSTAND_MODELS } from "../lib/gemini";
import { MEMORY_SCHEMA, UNDERSTAND_PROMPT } from "../lib/prompts";
import { validateMemory } from "../lib/validate";
import { alignSegments, detectSilences, type Silence } from "../lib/align";
import { decodeAiffOrWav } from "./decode-pcm";
import { LANGUAGES, type Memory } from "../lib/types";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const C = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  ok: (s: string) => `\x1b[32m${s}\x1b[0m`,
  warn: (s: string) => `\x1b[33m${s}\x1b[0m`,
  bad: (s: string) => `\x1b[31m${s}\x1b[0m`,
  rose: (s: string) => `\x1b[35m${s}\x1b[0m`,
};

const MIME_BY_EXT: Record<string, string> = {
  ".webm": "audio/ogg", // MediaRecorder opus — the audio API takes it as ogg
  ".ogg": "audio/ogg",
  ".opus": "audio/ogg",
  ".wav": "audio/wav",
  ".mp3": "audio/mp3",
  ".m4a": "audio/aac",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".aiff": "audio/aiff",
};

async function listModels() {
  const ai = gemini();
  console.log(C.bold(`\nModels available via ${credentialMode()}:\n`));
  const seen: string[] = [];
  for await (const m of await ai.models.list()) {
    const name = (m.name ?? "").replace(/^models\//, "");
    if (!name) continue;
    seen.push(name);
    if (/gemini/.test(name)) console.log(`  ${name}`);
  }
  console.log(C.dim(`\n${seen.length} total.`));
  console.log(C.dim(`Configured understand chain: ${UNDERSTAND_MODELS.join(" → ")}`));
}

function timecode(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${(s - m * 60).toFixed(1).padStart(4, "0")}`;
}

function report(
  memory: Memory,
  issues: string[],
  model: string,
  elapsedMs: number,
  alignment: { method: string; maxShiftSec: number }
) {
  const line = (label: string, value: string) =>
    console.log(`  ${label.padEnd(18)} ${value}`);

  console.log(C.bold("\n─── Memory ────────────────────────────────────────────\n"));
  line("speaker", memory.speakerName);
  line("language", memory.sourceLanguage);
  line("title", memory.title);
  line("title (en)", memory.titleTranslated);
  line("era", memory.era ?? C.dim("null — she named no time"));
  line("places", memory.places.join(", ") || C.dim("none"));
  line("people", memory.people.join(", ") || C.dim("none"));
  line("skills", memory.skills.join(", ") || C.dim("none"));
  console.log(`\n  ${C.dim("summary")}        ${memory.summary}`);
  console.log(`  ${C.dim("emotional core")} ${C.rose(memory.emotionalCore)}`);

  console.log(C.bold("\n─── Suggested formats ─────────────────────────────────\n"));
  if (memory.suggestedFormats.length === 0) console.log(C.warn("  none returned"));
  memory.suggestedFormats.forEach((f, i) =>
    console.log(`  ${i + 1}. ${C.bold(f.format.padEnd(12))} ${f.reason}`)
  );

  console.log(C.bold("\n─── The spine ─────────────────────────────────────────\n"));
  memory.segments.forEach((s, i) => {
    const mark = s.uncertain ? C.warn(" ~unsure") : "";
    console.log(
      `  ${C.dim(String(i).padStart(2))} ${C.dim(`${timecode(s.startSec)}–${timecode(s.endSec)}`)}${mark}`
    );
    console.log(`     ${s.originalText}`);
    for (const l of LANGUAGES) console.log(`     ${C.dim(l)}  ${s.translations[l]}`);
    console.log("");
  });

  // ---- gate checks -------------------------------------------------------
  console.log(C.bold("─── Gate ──────────────────────────────────────────────\n"));
  const checks: [boolean, string][] = [];
  checks.push([true, `Valid Memory, parsed and validated (${model})`]);
  checks.push([
    alignment.method !== "model",
    `Timeline rebuilt by ${alignment.method} — the model's own timestamps were off by up to ${alignment.maxShiftSec}s`,
  ]);
  checks.push([
    memory.segments.length >= 5,
    `${memory.segments.length} segments — a 90s recording should give 10–25`,
  ]);
  const emptyLang = LANGUAGES.filter((l) =>
    memory.segments.some((s) => !s.translations[l]?.trim())
  );
  checks.push([emptyLang.length === 0, `All four languages populated${emptyLang.length ? ` (missing: ${emptyLang.join(", ")})` : ""}`]);
  const echoed = LANGUAGES.filter(
    (l) => l !== "en" && memory.segments.every((s) => s.translations[l] === s.translations.en)
  );
  checks.push([echoed.length === 0, `No language is silently English${echoed.length ? ` (${echoed.join(", ")} is)` : ""}`]);
  const monotonic = memory.segments.every(
    (s, i) => i === 0 || s.startSec >= memory.segments[i - 1].startSec
  );
  checks.push([monotonic, "Timestamps run forward without reordering"]);
  const covered = memory.segments.reduce((a, s) => a + (s.endSec - s.startSec), 0);
  checks.push([
    memory.durationSec === 0 || covered > memory.durationSec * 0.5,
    `Segments cover ${covered.toFixed(0)}s of ${memory.durationSec ? `${memory.durationSec.toFixed(0)}s` : "the"} audio`,
  ]);
  const uncertain = memory.segments.filter((s) => s.uncertain).length;
  checks.push([true, `${uncertain} segment(s) flagged uncertain`]);
  checks.push([
    memory.suggestedFormats.length > 0,
    `${memory.suggestedFormats.length} format(s) suggested`,
  ]);
  checks.push([elapsedMs < 60_000, `Took ${(elapsedMs / 1000).toFixed(1)}s — over ~20s means the video uses pre-generated lessons`]);

  for (const [pass, label] of checks)
    console.log(`  ${pass ? C.ok("✓") : C.bad("✗")} ${label}`);

  if (issues.length) {
    console.log(C.warn("\n  Notes from validation:"));
    issues.forEach((i) => console.log(`    · ${i}`));
  }

  console.log(C.bold("\n  You still have to do these yourself:"));
  console.log("    · Open public/spot-check.html and tap two lines. Right audio, or drifting?");
  console.log("    · Read one non-English translation aloud. Grandmother, or documentary narrator?");
  console.log("    · Fact-check three details in summary/places/people against what she said.");
  console.log("");
}

function writeSpotCheck(memory: Memory, audioFile: string) {
  const rows = memory.segments
    .map(
      (s, i) => `<button data-s="${s.startSec}" data-e="${s.endSec}">
      <span class="t">${timecode(s.startSec)}–${timecode(s.endSec)}</span>
      <span class="o${s.uncertain ? " unsure" : ""}">${escapeHtml(s.originalText)}</span>
      <span class="tr">${escapeHtml(s.translations.en)}</span>
    </button>`
    )
    .join("\n");

  const html = `<!doctype html><meta charset="utf-8"><title>Spot-check the spine</title>
<style>
 body{background:#0E3B3E;color:#FBF7EE;font:16px/1.5 system-ui;margin:0;padding:24px;max-width:640px}
 h1{font-size:20px;margin:0 0 4px} p{opacity:.7;margin:0 0 20px}
 button{display:block;width:100%;text-align:left;background:#12494c;color:inherit;border:0;
   border-left:3px solid #3E8E7E;border-radius:8px;padding:12px 14px;margin:0 0 10px;cursor:pointer;font:inherit}
 button:hover{border-left-color:#D96A8A}
 .t{display:block;font:12px ui-monospace,monospace;opacity:.55;margin-bottom:4px}
 .o{display:block;margin-bottom:4px} .o.unsure{text-decoration:underline dotted #C9A227 2px;text-underline-offset:4px}
 .tr{display:block;font-size:14px;opacity:.6}
</style>
<h1>${escapeHtml(memory.speakerName)} — ${escapeHtml(memory.titleTranslated)}</h1>
<p>Tap a line. You should hear exactly those words. If it drifts, the spine is decorative.</p>
<audio id="a" src="${escapeHtml(basename(audioFile))}" preload="auto"></audio>
${rows}
<script>
 const a=document.getElementById('a');let stop=null;
 document.querySelectorAll('button').forEach(b=>b.onclick=()=>{
   clearTimeout(stop);a.currentTime=+b.dataset.s;a.play();
   stop=setTimeout(()=>a.pause(),(+b.dataset.e - +b.dataset.s)*1000+150);
 });
</script>`;
  writeFileSync("public/spot-check.html", html);
  console.log(C.dim(`  Spot-check page → public/spot-check.html (npm run dev, then /spot-check.html)`));
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function main() {
  if (process.argv.includes("--models")) return listModels();

  const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const path = resolve(arg ?? "public/demo.webm");
  if (!existsSync(path)) {
    console.error(C.bad(`\nNo audio at ${path}.`));
    console.error(
      "Record 60–120 seconds of a grandparent and save it as public/demo.webm, or pass a path:\n" +
        "  npm run understand -- ~/Desktop/ahma.m4a\n"
    );
    process.exit(1);
  }

  const buf = readFileSync(path);
  const mimeType = MIME_BY_EXT[extname(path).toLowerCase()] ?? "audio/ogg";

  // AIFF and WAV are raw PCM, so the script can measure the real duration and the
  // real pauses itself. Compressed formats can't be decoded here without a codec —
  // pass DEMO_DURATION_SEC and the browser supplies pauses in Phase 2.
  const pcm = decodeAiffOrWav(buf);
  let durationSec = Number(process.env.DEMO_DURATION_SEC ?? 0);
  let silences: Silence[] | undefined;
  if (pcm) {
    durationSec = pcm.durationSec;
    silences = detectSilences(pcm.channel, pcm.sampleRate);
    console.log(C.dim(`Decoded locally: ${durationSec.toFixed(1)}s, ${silences.length} pauses found`));
  } else if (!durationSec) {
    console.log(
      C.warn("No DEMO_DURATION_SEC set and this format can't be decoded here — timestamps will not be aligned.")
    );
  }

  console.log(
    C.dim(
      `\n${basename(path)} · ${(buf.length / 1024 / 1024).toFixed(2)} MB · sent as ${mimeType}` +
        (durationSec ? ` · ${durationSec}s` : "")
    )
  );
  if (buf.length > 18 * 1024 * 1024) {
    console.error(C.bad("Over the 20MB inline request limit. Trim to about 90 seconds."));
    process.exit(1);
  }
  console.log(C.dim(`Trying ${UNDERSTAND_MODELS.join(" → ")}…`));

  const ai = gemini();
  const startedAt = Date.now();
  const { text, model } = await callWithFallback(UNDERSTAND_MODELS, (m) =>
    ai.models
      .generateContent({
        model: m,
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType, data: buf.toString("base64") } },
              { text: UNDERSTAND_PROMPT },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: MEMORY_SCHEMA,
          temperature: 0.2,
        },
      })
      .then((r) => r.text ?? "")
  );
  const elapsedMs = Date.now() - startedAt;

  const { memory, issues } = validateMemory(JSON.parse(text), {
    id: "mem_demo",
    audioUrl: `/${basename(path)}`,
    durationSec,
  });

  const alignment = alignSegments(memory.segments, { durationSec, silences });
  memory.segments = alignment.segments;

  writeFileSync("understand-output.json", JSON.stringify(memory, null, 2));
  report(memory, issues, model, elapsedMs, alignment);
  console.log(C.dim(`  Full JSON → understand-output.json`));
  writeSpotCheck(memory, path);
  console.log("");
}

main().catch((e) => {
  console.error(C.bad(`\n${e instanceof Error ? e.message : String(e)}\n`));
  process.exit(1);
});
