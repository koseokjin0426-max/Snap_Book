import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/adminAuth";
import { deleteReservation } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authorized = await verifyAdminCookie(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!authorized) {
    return NextResponse.json({ message: "인증이 필요해요." }, { status: 401 });
  }

  const { error } = await deleteReservation(params.id);

  if (error) {
    console.error("[admin:reservations:delete]", error);
    return NextResponse.json({ message: "예약을 삭제하지 못했어요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
