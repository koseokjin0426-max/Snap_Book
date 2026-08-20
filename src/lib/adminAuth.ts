// 별도 세션 저장소 없이, 비밀번호+시크릿을 해시한 고정 토큰을 쿠키에 저장하는
// 가벼운 방식의 관리자 인증. Edge 미들웨어와 Node 런타임 양쪽에서 동작하도록
// Web Crypto(SubtleCrypto)만 사용합니다.

export const ADMIN_COOKIE_NAME = "snapbook_admin";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7일

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getExpectedAdminToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) {
    throw new Error(
      "ADMIN_PASSWORD / ADMIN_SESSION_SECRET 환경 변수가 설정되어 있지 않습니다."
    );
  }
  return sha256Hex(`${secret}:${password}`);
}

export async function isCorrectAdminPassword(candidate: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return candidate === password;
}

export async function verifyAdminCookie(cookieValue: string | undefined | null): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await getExpectedAdminToken();
  return cookieValue === expected;
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE_SECONDS,
};
