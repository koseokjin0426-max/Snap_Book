"use client";

import { FormEvent, useRef, useState } from "react";
import DateCalendar from "./DateCalendar";
import EmailField from "./EmailField";
import LocationPicker from "./LocationPicker";
import SelectField from "./SelectField";
import {
  ReservationInput,
  STYLE_OPTIONS,
  TIME_SLOTS,
  formatDateLabel,
  formatTimeSlotLabel,
} from "@/lib/constants";
import {
  ReservationErrors,
  formatPhoneNumber,
  hasErrors,
  validateReservation,
} from "@/lib/validateReservation";

const EMPTY_INPUT: ReservationInput = {
  name: "",
  phone: "",
  email: "",
  style: "",
  styleEtc: "",
  shootDate: "",
  shootTime: "",
  location: "",
  locationIsCustom: false,
  requestNote: "",
};

const STYLE_SELECT_OPTIONS = STYLE_OPTIONS.map((s) => ({ value: s, label: s }));
const TIME_SELECT_OPTIONS = TIME_SLOTS.map((t) => ({ value: t, label: formatTimeSlotLabel(t) }));

export default function ReservationForm() {
  const [input, setInput] = useState<ReservationInput>(EMPTY_INPUT);
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<ReservationInput | null>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  function update<K extends keyof ReservationInput>(key: K, value: ReservationInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateReservation(input);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "예약 접수 중 문제가 발생했어요.");
      }

      setSubmitted(input);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "예약 접수 중 문제가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setInput(EMPTY_INPUT);
    setErrors({});
    setSubmitted(null);
    setSubmitError(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (submitted) {
    return <ConfirmationView data={submitted} onReset={handleReset} />;
  }

  return (
    <div ref={formTopRef} className="mx-auto w-full max-w-lg px-4 py-6 sm:py-10">
      <header className="mb-5 px-1 sm:mb-6">
        <p className="text-sm font-semibold tracking-wide text-harbor-600">SNAP RESERVATION</p>
        <h1 className="mt-1.5 text-2xl font-bold text-ink-900 sm:text-3xl">촬영 예약하기</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700/70">
          아래 항목을 선택해 주시면 빠르게 예약을 확인해 드릴게요.
        </p>
      </header>

      <div className="form-card p-5 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="field-name" className="field-label">
                성함 <span className="text-sunset-600">*</span>
              </label>
              <input
                id="field-name"
                type="text"
                className="text-input"
                value={input.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "error-name" : undefined}
                placeholder="예: 홍길동"
                autoComplete="name"
              />
              {errors.name && (
                <p id="error-name" className="field-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="field-phone" className="field-label">
                전화번호 <span className="text-sunset-600">*</span>
              </label>
              <input
                id="field-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                className="text-input"
                value={input.phone}
                onChange={(e) => update("phone", formatPhoneNumber(e.target.value))}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "error-phone" : undefined}
                placeholder="010-1234-5678"
                maxLength={13}
              />
              {errors.phone && (
                <p id="error-phone" className="field-error" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="field-email" className="field-label">
              이메일 <span className="font-normal text-ink-700/50">(선택 · 예약 확인 안내용)</span>
            </label>
            <EmailField
              id="field-email"
              value={input.email}
              onChange={(v) => update("email", v)}
              ariaInvalid={!!errors.email}
              ariaDescribedby={errors.email ? "error-email" : undefined}
            />
            {errors.email && (
              <p id="error-email" className="field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="field-style" className="field-label">
                  촬영 스타일 <span className="text-sunset-600">*</span>
                </label>
                <SelectField
                  id="field-style"
                  value={input.style}
                  onChange={(v) => update("style", v)}
                  options={STYLE_SELECT_OPTIONS}
                  placeholder="스타일 선택"
                  ariaInvalid={!!errors.style}
                  ariaDescribedby={errors.style ? "error-style" : undefined}
                />
                {errors.style && (
                  <p id="error-style" className="field-error" role="alert">
                    {errors.style}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="field-shootTime" className="field-label">
                  희망 촬영 시간 <span className="text-sunset-600">*</span>
                </label>
                <SelectField
                  id="field-shootTime"
                  value={input.shootTime}
                  onChange={(v) => update("shootTime", v)}
                  options={TIME_SELECT_OPTIONS}
                  placeholder="시간 선택"
                  ariaInvalid={!!errors.shootTime}
                  ariaDescribedby={errors.shootTime ? "error-shootTime" : undefined}
                />
                {errors.shootTime && (
                  <p id="error-shootTime" className="field-error" role="alert">
                    {errors.shootTime}
                  </p>
                )}
              </div>
            </div>

            {input.style === "기타" && (
              <div className="mt-3">
                <input
                  id="field-styleEtc"
                  type="text"
                  autoFocus
                  className="text-input"
                  value={input.styleEtc}
                  onChange={(e) => update("styleEtc", e.target.value)}
                  aria-invalid={!!errors.styleEtc}
                  aria-describedby={errors.styleEtc ? "error-styleEtc" : undefined}
                  placeholder="원하시는 촬영 스타일을 알려주세요"
                />
                {errors.styleEtc && (
                  <p id="error-styleEtc" className="field-error" role="alert">
                    {errors.styleEtc}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <span className="field-label">
              희망 촬영 날짜 <span className="text-sunset-600">*</span>
            </span>
            <div id="field-shootDate" tabIndex={-1}>
              <DateCalendar
                value={input.shootDate}
                onChange={(v) => update("shootDate", v)}
                ariaLabel="희망 촬영 날짜"
              />
            </div>
            {errors.shootDate && (
              <p className="field-error" role="alert">
                {errors.shootDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="field-location" className="field-label">
              촬영 장소 <span className="text-sunset-600">*</span>
            </label>
            <LocationPicker
              id="field-location"
              location={input.location}
              isCustom={input.locationIsCustom}
              onChange={(location, locationIsCustom) =>
                setInput((prev) => ({ ...prev, location, locationIsCustom }))
              }
              ariaInvalid={!!errors.location}
              ariaDescribedby={errors.location ? "error-location" : undefined}
            />
            {errors.location && (
              <p id="error-location" className="field-error" role="alert">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="field-requestNote" className="field-label">
              요청사항 / QnA <span className="font-normal text-ink-700/50">(선택)</span>
            </label>
            <textarea
              id="field-requestNote"
              className="text-input min-h-[120px] resize-y"
              value={input.requestNote}
              onChange={(e) => update("requestNote", e.target.value)}
              placeholder="전달하고 싶은 내용이 있다면 자유롭게 남겨주세요."
              rows={4}
            />
          </div>

          {submitError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring flex min-h-[52px] w-full items-center justify-center rounded-xl bg-sunset-500 px-6 text-base font-semibold text-white shadow-card transition-colors hover:bg-sunset-600 active:bg-sunset-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "제출 중..." : "예약 신청하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ConfirmationView({
  data,
  onReset,
}: {
  data: ReservationInput;
  onReset: () => void;
}) {
  const styleLabel = data.style === "기타" ? `기타 (${data.styleEtc})` : data.style;

  const rows: Array<[string, string]> = [
    ["성함", data.name],
    ["전화번호", data.phone],
    ...(data.email ? ([["이메일", data.email]] as Array<[string, string]>) : []),
    ["촬영 스타일", styleLabel],
    ["희망 날짜", formatDateLabel(data.shootDate)],
    ["희망 시간", formatTimeSlotLabel(data.shootTime)],
    ["촬영 장소", data.location],
    ...(data.requestNote ? ([["요청사항", data.requestNote]] as Array<[string, string]>) : []),
  ];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-harbor-100 text-harbor-600">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="mt-5 text-2xl font-bold text-ink-900">예약이 접수되었습니다</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-700/70">
        입력해 주신 연락처로 곧 확인 안내를 드릴게요.
      </p>

      <dl className="form-card mt-8 w-full space-y-3 p-5 text-left">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-sm">
            <dt className="shrink-0 font-medium text-ink-700/60">{label}</dt>
            <dd className="text-right font-semibold text-ink-900">{value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onReset}
        className="focus-ring mt-8 min-h-[48px] rounded-xl border border-ink-900/20 px-6 text-sm font-semibold text-ink-800 transition-colors hover:bg-cream-100"
      >
        새 예약 작성하기
      </button>
    </div>
  );
}
