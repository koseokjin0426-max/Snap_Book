export const STYLE_OPTIONS = [
  "스냅",
  "프로필",
  "가족사진",
  "커플",
  "기타",
] as const;

export type StyleOption = (typeof STYLE_OPTIONS)[number];

export const PARTY_SIZE_OPTIONS = [
  "1명",
  "2명",
  "3명",
  "4명",
  "5명",
  "6명",
  "7명",
  "8명",
  "9명",
  "10명 이상",
] as const;

export type PartySizeOption = (typeof PARTY_SIZE_OPTIONS)[number];

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

export function formatTimeSlotLabel(slot: string): string {
  const [hourStr] = slot.split(":");
  const hour = Number(hourStr);
  if (hour < 12) return `오전 ${hour}시`;
  if (hour === 12) return `오후 12시`;
  return `오후 ${hour - 12}시`;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
}

export const LOCATION_CHIPS = ["성수", "연남", "한강", "스튜디오"] as const;
export const LOCATION_CUSTOM = "직접 입력" as const;

export const EMAIL_DOMAINS = [
  "naver.com",
  "gmail.com",
  "daum.net",
  "kakao.com",
  "nate.com",
  "icloud.com",
] as const;
export const EMAIL_DOMAIN_CUSTOM = "직접 입력" as const;

export interface ReservationInput {
  name: string;
  phone: string;
  email: string;
  style: string;
  styleEtc: string;
  partySize: string;
  shootDate: string;
  shootTime: string;
  location: string;
  locationIsCustom: boolean;
  requestNote: string;
}

export interface ReservationRecord {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  style: string;
  style_etc: string | null;
  party_size: string | null;
  shoot_date: string;
  shoot_time: string;
  location: string;
  location_is_custom: boolean;
  request_note: string | null;
}
