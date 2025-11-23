import { NextResponse } from "next/server";
import { connectDB } from "./../../lib/mongodb";
import Question from "./../../models/Question";
import { cookies } from "next/headers";

export async function GET() {
  await connectDB();
  const items = await Question.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req) {
  const isAdmin = cookies().get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();

  if (!body.question || !body.answer) {
    return NextResponse.json(
      { error: "Question and answer are required" },
      { status: 400 }
    );
  }

  const newQ = await Question.create({
    question: body.question,
    answer: body.answer,
    category: body.category || "react"
  });

  return NextResponse.json(newQ);
}
