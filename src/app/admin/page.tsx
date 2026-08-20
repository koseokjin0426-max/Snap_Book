"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReservationRecord, formatDateLabel, formatTimeSlotLabel } from "@/lib/constants";

function formatCreatedAt(iso: string): string {
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/admin/reservations", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("예약 목록을 불러오지 못했어요.");
      const body = await res.json();
      setReservations(body.reservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "예약 목록을 불러오지 못했어요.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`${name}님의 예약을 삭제할까요? 되돌릴 수 없어요.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("예약을 삭제하지 못했어요.");
      setReservations((prev) => prev?.filter((r) => r.id !== id) ?? prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : "예약을 삭제하지 못했어요.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-dvh bg-cream-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-harbor-600">SNAP RESERVATION</p>
            <h1 className="mt-1 text-2xl font-bold text-ink-900">예약 관리</h1>
          </div>
          <div className="flex gap-2">
            <a
              href="/api/admin/export"
              className="focus-ring flex min-h-[44px] items-center justify-center rounded-xl bg-sunset-500 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-sunset-600"
            >
              엑셀로 내보내기
            </a>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="focus-ring flex min-h-[44px] items-center justify-center rounded-xl border border-ink-900/20 px-5 text-sm font-semibold text-ink-800 transition-colors hover:bg-cream-100 disabled:opacity-60"
            >
              로그아웃
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        )}

        {reservations === null && !error && (
          <p className="text-sm text-ink-700/60">불러오는 중...</p>
        )}

        {reservations && reservations.length === 0 && (
          <p className="rounded-xl2 border border-dashed border-ink-900/20 bg-white px-6 py-12 text-center text-sm text-ink-700/60">
            아직 접수된 예약이 없어요.
          </p>
        )}

        {reservations && reservations.length > 0 && (
          <div className="overflow-x-auto rounded-xl2 border border-ink-900/10 bg-white shadow-soft">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 bg-cream-100 text-ink-700/70">
                  <th className="px-4 py-3 font-semibold">접수일시</th>
                  <th className="px-4 py-3 font-semibold">성함</th>
                  <th className="px-4 py-3 font-semibold">전화번호</th>
                  <th className="px-4 py-3 font-semibold">촬영 스타일</th>
                  <th className="px-4 py-3 font-semibold">인원</th>
                  <th className="px-4 py-3 font-semibold">희망 날짜/시간</th>
                  <th className="px-4 py-3 font-semibold">장소</th>
                  <th className="px-4 py-3 font-semibold">요청사항</th>
                  <th className="px-4 py-3 font-semibold">관리</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-ink-900/5 last:border-0 hover:bg-cream-50">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-700/70">{formatCreatedAt(r.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-900">{r.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-800">{r.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-800">
                      {r.style === "기타" && r.style_etc ? `기타(${r.style_etc})` : r.style}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-800">{r.party_size || "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-800">
                      {formatDateLabel(r.shoot_date)} · {formatTimeSlotLabel(r.shoot_time)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-800">{r.location}</td>
                    <td className="max-w-xs px-4 py-3 text-ink-700/80">{r.request_note || "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.name)}
                        disabled={deletingId === r.id}
                        className="focus-ring rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === r.id ? "삭제 중..." : "삭제"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
