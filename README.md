# SnapBook — 스냅 작가 예약 웹앱

카카오톡 오픈채팅 대신 링크 하나로 공유할 수 있는 원페이지 예약 폼 + 관리자 대시보드.

## 기술 스택

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Supabase (Postgres) — 예약 데이터 영속 저장
- Vercel 배포 전제 (서버리스 API Route + Edge 미들웨어)

## 로컬 개발 준비

1. 의존성 설치

   ```
   npm install
   ```

2. Supabase 프로젝트 생성 후 `supabase/schema.sql` 내용을 SQL Editor에서 실행해 `reservations` 테이블을 만듭니다.

3. `.env.example`을 복사해 `.env.local` 생성 후 값 채우기

   ```
   cp .env.example .env.local
   ```

   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase 프로젝트 Settings → API에서 확인
     (⚠️ service role key는 서버에서만 쓰이며 절대 클라이언트에 노출되지 않습니다)
   - `ADMIN_PASSWORD`: 관리자 화면(`/admin`) 접속 비밀번호
   - `ADMIN_SESSION_SECRET`: 임의의 긴 랜덤 문자열 (`openssl rand -hex 32`)

4. 개발 서버 실행

   ```
   npm run dev
   ```

   - 예약 폼: http://localhost:3000
   - 관리자: http://localhost:3000/admin (비밀번호 로그인 후 접근)

## 배포 (Vercel)

1. GitHub 저장소에 push 후 Vercel에서 Import
2. Vercel 프로젝트 Settings → Environment Variables에 위 4개 값 동일하게 등록
3. Deploy — 배포된 URL을 고객에게 공유하면 됩니다 (예: `https://your-project.vercel.app`)

## 폴더 구조 요약

- `src/app/page.tsx` — 예약 폼 (원페이지)
- `src/app/admin/` — 관리자 로그인 / 대시보드
- `src/app/api/reservations` — 예약 생성 API
- `src/app/api/admin/` — 관리자 로그인/로그아웃/목록/CSV 내보내기 API
- `src/middleware.ts` — `/admin`, `/api/admin` 경로 비밀번호 보호
- `supabase/schema.sql` — 예약 테이블 스키마

## 관리자 접근 보호 방식

무거운 인증 시스템 대신, 비밀번호 해시를 쿠키에 저장하는 가벼운 방식입니다.
로그인 시 `sha256(ADMIN_SESSION_SECRET:ADMIN_PASSWORD)` 값을 httpOnly 쿠키로 저장하고,
미들웨어가 모든 `/admin`, `/api/admin` 요청에서 이 쿠키를 검증합니다.
