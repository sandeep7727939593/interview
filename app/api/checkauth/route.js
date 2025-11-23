import { NextResponse } from "next/server";

export async function GET(request) {
  const cookie = request.cookies.get("admin_auth");

  const isAdmin = cookie?.value === "true";

  return NextResponse.json({ auth: isAdmin });
}
