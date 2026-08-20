import { ReservationRecord } from "./constants";
import { formatTimeSlotLabel } from "./constants";

const HEADERS = [
  "접수일시",
  "성함",
  "전화번호",
  "이메일",
  "촬영 스타일",
  "희망 날짜",
  "희망 시간",
  "장소",
  "요청사항",
];

function escapeCsvField(value: string): string {
  const needsQuoting = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function buildReservationsCsv(rows: ReservationRecord[]): string {
  const lines = [HEADERS.join(",")];

  for (const row of rows) {
    const style = row.style === "기타" && row.style_etc ? `기타(${row.style_etc})` : row.style;
    const fields = [
      formatDateTime(row.created_at),
      row.name,
      row.phone,
      row.email ?? "",
      style,
      row.shoot_date,
      formatTimeSlotLabel(row.shoot_time),
      row.location,
      row.request_note ?? "",
    ];
    lines.push(fields.map(escapeCsvField).join(","));
  }

  const csvBody = lines.join("\r\n");
  const BOM = "﻿"; // 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM 추가
  return BOM + csvBody;
}
