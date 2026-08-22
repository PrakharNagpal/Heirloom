import { NextResponse } from "next/server";
import { callWithFallback, gemini, GENERATE_MODELS } from "@/lib/gemini";
import { LESSON_SCHEMAS, lessonPrompt } from "@/lib/lesson-prompts";
import { buildFallback, validateLesson } from "@/lib/validate-lesson";
import { LANGUAGES, SHIPPED_FORMATS, type Lang, type Lesson, type LessonFormat, type Memory } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 180;

export type GenerateRequest = {
  memory: Memory;
  format: LessonFormat;
  language?: Lang;
};

export async function POST(req: Request) {
  const startedAt = Date.now();
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const { memory, format } = body;
  if (!memory?.segments?.length)
    return NextResponse.json({ error: "That memory has no words in it." }, { status: 400 });
  if (!SHIPPED_FORMATS.includes(format) || !LESSON_SCHEMAS[format])
    return NextResponse.json({ error: `We don't make "${format}" yet.` }, { status: 400 });

  const language: Lang = LANGUAGES.includes(body.language as Lang) ? (body.language as Lang) : "en";
  const ai = gemini();
  const prompt = lessonPrompt(memory, format, language);
  const schema = LESSON_SCHEMAS[format];

  const run = (correction: string) => (model: string) =>
    ai.models
      .generateContent({
        model,
        contents: [
          { role: "user", parts: [{ text: correction ? `${prompt}\n\n${correction}` : prompt }] },
        ],
        config: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.7 },
      })
      .then((r) => r.text ?? "");

  // One pass, then one corrective retry that is told exactly what was wrong.
  let lastError = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const correction =
      attempt === 0
        ? ""
        : `Your previous answer was rejected: ${lastError}\nReturn the whole object again, corrected. Every element needs a segmentIndex between 0 and ${memory.segments.length - 1}.`;
    try {
      const { text, model } = await callWithFallback(GENERATE_MODELS, run(correction));
      const { payload, issues } = validateLesson(JSON.parse(text), format, memory);
      const lesson: Lesson = {
        id: `les_${memory.id}_${format}_${language}`,
        memoryId: memory.id,
        format,
        language,
        payload,
      };
      const elapsedMs = Date.now() - startedAt;
      console.log(
        `[generate] ${format}/${language} · ${model} · ${(elapsedMs / 1000).toFixed(1)}s · ${issues.length} issues`
      );
      issues.forEach((i) => console.warn(`[generate] ${i}`));
      return NextResponse.json({ lesson, issues, model, elapsedMs, fallback: false });
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[generate] ${format} attempt ${attempt + 1} failed: ${lastError}`);
    }
  }

  // Never a white screen. Plainer, but every word is hers and every index is right.
  const lesson: Lesson = {
    id: `les_${memory.id}_${format}_${language}_fallback`,
    memoryId: memory.id,
    format,
    language,
    payload: buildFallback(format, memory, language),
    };
  console.warn(`[generate] ${format} fell back after two attempts: ${lastError}`);
  return NextResponse.json({
    lesson,
    issues: ["Built straight from her words — the written version didn't come through."],
    fallback: true,
    detail: lastError,
    elapsedMs: Date.now() - startedAt,
  });
}
