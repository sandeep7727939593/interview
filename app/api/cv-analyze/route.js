import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { aiChat, aiConfigured } from "./../../lib/ai";

const MAX_CHARS = 14000;

const SYSTEM_PROMPT = `You are a senior technical career coach and interviewer.
You receive the raw text of a candidate's CV / resume. Analyse it and produce a concrete, personalised interview-preparation plan.

Return ONLY a valid JSON object (no markdown, no commentary) with EXACTLY this shape:
{
  "name": "candidate's name if found, else empty string",
  "summary": "2-3 sentence summary of the candidate's profile",
  "experienceLevel": "Fresher | Junior | Mid-level | Senior",
  "targetRoles": ["role 1", "role 2"],
  "detectedSkills": ["skill", "..."],
  "strengths": ["clear strength based on the CV", "..."],
  "gaps": ["likely gap or weak area to improve before interviews", "..."],
  "focusAreas": [
    { "area": "topic to focus on", "priority": "High | Medium | Low", "why": "1 sentence reason tailored to this CV" }
  ],
  "roadmap": [
    { "phase": "Phase 1: short title", "duration": "e.g. 2 weeks", "topics": ["topic", "..."], "goal": "what they achieve in this phase" }
  ],
  "estimatedTime": "overall prep time range, e.g. 6-8 weeks",
  "weeklyHours": "suggested weekly effort, e.g. 10-12 hours/week",
  "tips": ["actionable, specific interview tip", "..."],
  "resources": [ { "title": "resource name", "type": "Course | Book | Practice | Docs" } ]
}

Rules:
- Base everything on the actual CV content; be specific (mention real technologies the person knows).
- 4-7 focusAreas, 3-5 roadmap phases, 4-6 tips, 3-6 resources.
- Plain text inside fields (no HTML). Keep it concise and practical.`;

export async function POST(req) {
  if (!aiConfigured()) {
    return NextResponse.json(
      { error: "AI is not configured. Set GROK_API_KEY in .env.local." },
      { status: 503 }
    );
  }

  // ── Read the uploaded file ──
  let file;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
  }
  if (file.type && file.type !== "application/pdf") {
    return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });
  }

  // ── Extract text from the PDF ──
  let cvText = "";
  try {
    const buf = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(buf);
    const { text } = await extractText(pdf, { mergePages: true });
    cvText = (text || "").replace(/\s+\n/g, "\n").trim();
  } catch (err) {
    console.error("PDF parse error:", err);
    return NextResponse.json(
      { error: "Could not read this PDF. Try a text-based (not scanned) resume." },
      { status: 422 }
    );
  }

  if (cvText.length < 80) {
    return NextResponse.json(
      { error: "Couldn't extract enough text. Is this a scanned/image PDF?" },
      { status: 422 }
    );
  }
  cvText = cvText.slice(0, MAX_CHARS);

  // ── Ask the AI for the prep plan ──
  try {
    const { content, model } = await aiChat(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Here is the CV text:\n\n${cvText}` },
      ],
      { json: true, temperature: 0.5, timeoutMs: 45000 }
    );

    let plan;
    try {
      plan = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("non-JSON response");
      plan = JSON.parse(m[0]);
    }

    return NextResponse.json({ plan, model });
  } catch (err) {
    if (err?.code === "PROVIDER") {
      console.error("AI provider error:", err.status, err.detail);
      return NextResponse.json(
        { error: `AI provider error (${err.status}). Please try again.` },
        { status: 502 }
      );
    }
    const msg = err?.name === "AbortError" ? "AI request timed out" : "AI analysis failed";
    console.error("cv-analyze:", err);
    return NextResponse.json({ error: msg }, { status: 504 });
  }
}
