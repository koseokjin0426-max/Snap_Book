"use client";

import { useState } from "react";

interface DateCalendarProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  ariaLabel: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function DateCalendar({ value, onChange, ariaLabel }: DateCalendarProps) {
  const today = startOfToday();
  const initial = value ? new Date(`${value}T00:00:00`) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();

  const isBeforeCurrentMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  function goPrevMonth() {
    if (isBeforeCurrentMonth) return;
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  }

  function goNextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  const cells: Array<{ day: number; key: string; disabled: boolean; isToday: boolean } | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const key = toDateKey(viewYear, viewMonth, day);
    const cellDate = new Date(viewYear, viewMonth, day);
    cells.push({
      day,
      key,
      disabled: cellDate < today,
      isToday: cellDate.getTime() === today.getTime(),
    });
  }

  return (
    <div className="rounded-xl2 border border-ink-900/10 bg-cream-50 p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrevMonth}
          disabled={isBeforeCurrentMonth}
          aria-label="이전 달"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-ink-900">
          {viewYear}년 {viewMonth + 1}월
        </p>
        <button
          type="button"
          onClick={goNextMonth}
          aria-label="다음 달"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-cream-100"
        >
          ›
        </button>
      </div>

      <div
        role="grid"
        aria-label={ariaLabel}
        className="grid grid-cols-7 gap-y-1 text-center"
      >
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="pb-2 text-xs font-medium text-ink-700/60">
            {wd}
          </div>
        ))}

        {cells.map((cell, idx) => {
          if (!cell) return <div key={`empty-${idx}`} />;
          const selected = cell.key === value;
          return (
            <div key={cell.key} className="flex items-center justify-center py-0.5">
              <button
                type="button"
                role="gridcell"
                aria-selected={selected}
                aria-label={cell.key}
                disabled={cell.disabled}
                onClick={() => onChange(cell.key)}
                className={`focus-ring flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  cell.disabled
                    ? "cursor-not-allowed text-ink-700/25"
                    : selected
                      ? "bg-sunset-500 text-white shadow-soft"
                      : cell.isToday
                        ? "border border-harbor-400 text-harbor-600 hover:bg-harbor-50"
                        : "text-ink-800 hover:bg-cream-100"
                }`}
              >
                {cell.day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
