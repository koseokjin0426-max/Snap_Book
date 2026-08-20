import { NextRequest, NextResponse } from "next/server";
import { listBookedTimesForDate } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "";

  if (!DATE_RE.test(date)) {
    return NextResponse.json({ message: "date 파라미터가 올바르지 않아요." }, { status: 400 });
  }

  const { data, error } = await listBookedTimesForDate(date);

  if (error) {
    console.error("[reservations:availability]", error);
    return NextResponse.json({ message: "예약 가능 시간을 불러오지 못했어요." }, { status: 500 });
  }

  return NextResponse.json({ bookedTimes: data ?? [] });
}
