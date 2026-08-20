import { LOCATION_CUSTOM, ReservationInput, STYLE_OPTIONS, TIME_SLOTS } from "./constants";

export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>;

const PHONE_DIGITS_RE = /^01[016789]\d{7,8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateReservation(input: ReservationInput): ReservationErrors {
  const errors: ReservationErrors = {};

  if (!input.name.trim()) {
    errors.name = "성함을 입력해 주세요.";
  }

  const phoneDigits = input.phone.replace(/\D/g, "");
  if (!phoneDigits) {
    errors.phone = "전화번호를 입력해 주세요.";
  } else if (!PHONE_DIGITS_RE.test(phoneDigits)) {
    errors.phone = "올바른 휴대폰 번호 형식이 아니에요.";
  }

  if (input.email.trim() && !EMAIL_RE.test(input.email.trim())) {
    errors.email = "올바른 이메일 형식이 아니에요.";
  }

  if (!input.style || !STYLE_OPTIONS.includes(input.style as (typeof STYLE_OPTIONS)[number])) {
    errors.style = "촬영 스타일을 선택해 주세요.";
  } else if (input.style === "기타" && !input.styleEtc.trim()) {
    errors.styleEtc = "촬영 스타일을 직접 입력해 주세요.";
  }

  if (!input.shootDate) {
    errors.shootDate = "희망 촬영 날짜를 선택해 주세요.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(`${input.shootDate}T00:00:00`);
    if (Number.isNaN(picked.getTime()) || picked < today) {
      errors.shootDate = "지난 날짜는 선택할 수 없어요.";
    }
  }

  if (!input.shootTime || !TIME_SLOTS.includes(input.shootTime as (typeof TIME_SLOTS)[number])) {
    errors.shootTime = "희망 촬영 시간을 선택해 주세요.";
  }

  if (!input.location.trim()) {
    errors.location = "촬영 장소를 선택하거나 입력해 주세요.";
  } else if (input.location === LOCATION_CUSTOM) {
    errors.location = "촬영 장소를 직접 입력해 주세요.";
  }

  return errors;
}

export function hasErrors(errors: ReservationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function formatPhoneNumber(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length < 11) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
}
