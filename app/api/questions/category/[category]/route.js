import { NextResponse } from "next/server";
import { connectDB } from "./../../../../lib/mongodb";
import Question from "./../../../../models/Question";

export async function GET(req, { params }) {
  await connectDB();
    const { category } = await params;
  const items = await Question.find({ category}).sort({ createdAt: -1 });
  return NextResponse.json(items);
}
