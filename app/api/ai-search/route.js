import { NextResponse } from "next/server";
import { aiChat, aiConfigured } from "./../../lib/ai";

export async function POST(req) {
  if (!aiConfigured()) {
    return NextResponse.json(
      { error: "AI search is not configured. Set GROK_API_KEY in .env.local." },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const question = (body?.question || "").toString().trim();
  const category = (body?.category || "general").toString();

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json({ error: "Question is too long" }, { status: 400 });
  }

  const systemPrompt = `You are an expert technical interviewer and tutor for the "InterviewWithJangir" question bank.
Answer the user's technical interview question clearly and accurately.
Topic context: ${category}.
Rules:
- Keep it concise but complete (roughly 2-6 short paragraphs).
- Format the answer as clean HTML using only these tags: <p>, <ul>, <li>, <strong>, <pre>, <code>.
- Put any code inside <pre><code>...</code></pre> and escape < > & as &lt; &gt; &amp;.
- Do NOT wrap the whole answer in markdown fences. Return only the HTML body, no <html> or <body> tags.
- If the question is not a technical/interview question, briefly say it is out of scope.`;

  try {
    const { content, model } = await aiChat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      { temperature: 0.4, timeoutMs: 30000 }
    );

    if (!content) {
      return NextResponse.json({ error: "No answer returned" }, { status: 502 });
    }
    return NextResponse.json({ answer: content, model });
  } catch (err) {
    if (err?.code === "PROVIDER") {
      console.error("AI provider error:", err.status, err.detail);
      return NextResponse.json(
        { error: `AI provider error (${err.status}). Please try again later.` },
        { status: 502 }
      );
    }
    const msg = err?.name === "AbortError" ? "AI request timed out" : "AI request failed";
    console.error("ai-search:", err);
    return NextResponse.json({ error: msg }, { status: 504 });
  }
}
