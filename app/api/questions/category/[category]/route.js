import { NextResponse } from "next/server";
import { connectDB } from "./../../../../lib/mongodb";
import Question from "./../../../../models/Question";

export async function GET(req, { params }) {
  await connectDB();
  const limit = 20;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page")) || 1;
  const { category } = await params;
  const items = await Question.find({ category}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  const documentCount = await Question.countDocuments({ category });
  const totalPages = Math.ceil(documentCount / limit);

  return NextResponse.json({
    "items" : items,
    "pageProperties": {
      "totalPages": totalPages,
      "currentPage": parseInt(page),
      "documentCount": documentCount
    }
  });
}
