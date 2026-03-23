import { NextResponse } from "next/server";
import { createAuthCookie, verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (await verifyAdmin(password)) {
    await createAuthCookie(password);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}
