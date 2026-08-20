import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/adminAuth";
import { listReservations } from "@/lib/supabaseAdmin";
import { buildReservationsCsv } from "@/lib/csv";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authorized = await verifyAdminCookie(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!authorized) {
    return NextResponse.json({ message: "인증이 필요해요." }, { status: 401 });
  }

  const { data, error } = await listReservations();

  if (error) {
    console.error("[admin:export]", error);
    return NextResponse.json({ message: "CSV를 생성하지 못했어요." }, { status: 500 });
  }

  const csv = buildReservationsCsv(data ?? []);
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservations-${today}.csv"`,
    },
  });
}
