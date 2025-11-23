import { NextResponse } from "next/server";
import { connectDB } from "./../../../lib/mongodb";
import Question from "./../../../models/Question";

export async function DELETE(req, { params }) {
  const isAdmin = cookies().get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { id } = params;
  await Question.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
