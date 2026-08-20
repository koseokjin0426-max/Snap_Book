import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/adminAuth";
import { listReservations } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authorized = await verifyAdminCookie(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!authorized) {
    return NextResponse.json({ message: "인증이 필요해요." }, { status: 401 });
  }

  const { data, error } = await listReservations();

  if (error) {
    console.error("[admin:reservations]", error);
    return NextResponse.json({ message: "예약 목록을 불러오지 못했어요." }, { status: 500 });
  }

  return NextResponse.json({ reservations: data });
}
