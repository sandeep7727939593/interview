import { NextResponse } from "next/server";
import { connectDB } from "./../../../lib/mongodb";
import QuestionRequest from "./../../../models/QuestionRequest";
import Question from "./../../../models/Question";

function isAdmin(req) {
  return req.cookies.get("admin_auth")?.value === "true";
}

// PATCH — admin: approve a request (creates a real Question) or update its fields.
export async function PATCH(req, { params }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const reqDoc = await QuestionRequest.findById(id);
  if (!reqDoc) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  // allow admin to tweak before approving
  if (typeof body.question === "string") reqDoc.question = body.question;
  if (typeof body.answer === "string") reqDoc.answer = body.answer;
  if (typeof body.category === "string") reqDoc.category = body.category;

  if (body.action === "approve") {
    if (!reqDoc.answer?.trim()) {
      return NextResponse.json(
        { error: "Cannot approve a request without an answer" },
        { status: 400 }
      );
    }
    await Question.create({
      question: reqDoc.question,
      answer: reqDoc.answer,
      category: reqDoc.category || "react",
    });
    reqDoc.status = "approved";
  } else if (body.action === "reject") {
    reqDoc.status = "rejected";
  }

  await reqDoc.save();
  return NextResponse.json({ success: true, request: reqDoc });
}

// DELETE — admin: remove a request entirely.
export async function DELETE(req, { params }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  await QuestionRequest.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
