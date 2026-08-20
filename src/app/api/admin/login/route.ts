import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminCookieOptions, getExpectedAdminToken, isCorrectAdminPassword } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { password?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "요청 형식이 올바르지 않아요." }, { status: 400 });
  }

  const password = String(body?.password ?? "");

  if (!(await isCorrectAdminPassword(password))) {
    return NextResponse.json({ message: "비밀번호가 올바르지 않아요." }, { status: 401 });
  }

  const token = await getExpectedAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions);
  return res;
}
