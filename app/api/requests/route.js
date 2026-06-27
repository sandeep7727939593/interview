import { NextResponse } from "next/server";
import { connectDB } from "./../../lib/mongodb";
import QuestionRequest from "./../../models/QuestionRequest";

// POST — public: a user sends a request to the admin to add a question.
export async function POST(req) {
  await connectDB();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const question = (body?.question || "").toString().trim();
  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const created = await QuestionRequest.create({
    question,
    answer: (body?.answer || "").toString(),
    category: (body?.category || "general").toString(),
    source: body?.source === "ai" ? "ai" : "user",
    status: "pending",
  });

  return NextResponse.json({ success: true, id: created._id });
}

// GET — admin only: list submitted requests (newest first).
export async function GET(req) {
  const cookie = req.cookies.get("admin_auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // optional filter
  const filter = status ? { status } : {};

  const items = await QuestionRequest.find(filter).sort({ createdAt: -1 }).limit(200);
  const pendingCount = await QuestionRequest.countDocuments({ status: "pending" });

  return NextResponse.json({ items, pendingCount });
}
