"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "로그인에 실패했어요.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl2 border border-ink-900/10 bg-white p-6 shadow-card"
      >
        <p className="text-sm font-semibold tracking-wide text-harbor-600">SNAP RESERVATION</p>
        <h1 className="mt-1 text-xl font-bold text-ink-900">관리자 로그인</h1>
        <p className="mt-1 text-sm text-ink-700/60">예약 목록을 확인하려면 비밀번호를 입력하세요.</p>

        <label htmlFor="admin-password" className="field-label mt-6">
          비밀번호
        </label>
        <input
          id="admin-password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="text-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!error}
        />

        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !password}
          className="focus-ring mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-harbor-500 px-6 text-base font-semibold text-white shadow-soft transition-colors hover:bg-harbor-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "확인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
