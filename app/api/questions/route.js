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
  const cookie = req.cookies.get("admin_auth");
  const isAdmin = cookie.value === "true";

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
  const id = body.id;
  if (id) {
    const existingQ = await Question.findById(id);
    if (!existingQ) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    existingQ.question = body.question;
    existingQ.answer = body.answer;
    existingQ.category = body.category || existingQ.category;

    await existingQ.save();

    return NextResponse.json(existingQ);
  } 

  const newQ = await Question.create({
    question: body.question,
    answer: body.answer,
    category: body.category || "react"
  });

  return NextResponse.json(newQ);
}
