-- SnapBook 예약 테이블
-- Supabase SQL Editor에서 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  style text not null check (style in ('스냅', '프로필', '가족사진', '커플', '기타')),
  style_etc text,
  shoot_date date not null,
  shoot_time text not null,
  location text not null,
  location_is_custom boolean not null default false,
  request_note text
);

create index if not exists reservations_created_at_idx
  on reservations (created_at desc);

-- RLS를 켜두고, 서버(Next.js API Route)에서 서비스 롤 키로만 접근합니다.
-- 클라이언트(브라우저)는 이 테이블에 직접 접근하지 않으므로 별도 정책은 두지 않습니다.
alter table reservations enable row level security;

-- 총 인원 필드 추가 (2026-08-20). 기존 테이블에 이미 데이터가 있다면
-- Supabase SQL Editor에서 아래 문장을 한 번 실행해 컬럼을 추가하세요.
alter table reservations add column if not exists party_size text not null default '1명';
