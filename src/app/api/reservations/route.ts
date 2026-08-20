import { NextRequest, NextResponse } from "next/server";
import { insertReservation } from "@/lib/supabaseAdmin";
import { ReservationInput } from "@/lib/constants";
import { hasErrors, validateReservation } from "@/lib/validateReservation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: ReservationInput;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "요청 형식이 올바르지 않아요." }, { status: 400 });
  }

  const input: ReservationInput = {
    name: String(body?.name ?? "").trim(),
    phone: String(body?.phone ?? "").trim(),
    email: String(body?.email ?? "").trim(),
    style: String(body?.style ?? "").trim(),
    styleEtc: String(body?.styleEtc ?? "").trim(),
    shootDate: String(body?.shootDate ?? "").trim(),
    shootTime: String(body?.shootTime ?? "").trim(),
    location: String(body?.location ?? "").trim(),
    locationIsCustom: Boolean(body?.locationIsCustom),
    requestNote: String(body?.requestNote ?? "").trim(),
  };

  const errors = validateReservation(input);
  if (hasErrors(errors)) {
    return NextResponse.json({ message: "입력값을 다시 확인해 주세요.", errors }, { status: 400 });
  }

  try {
    const { error } = await insertReservation({
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      style: input.style,
      style_etc: input.style === "기타" ? input.styleEtc : null,
      shoot_date: input.shootDate,
      shoot_time: input.shootTime,
      location: input.location,
      location_is_custom: input.locationIsCustom,
      request_note: input.requestNote || null,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[reservations:create]", err);
    return NextResponse.json(
      { message: "예약 저장 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
