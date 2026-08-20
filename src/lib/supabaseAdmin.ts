import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ReservationRecord } from "./constants";

export interface ReservationInsert {
  name: string;
  phone: string;
  email: string | null;
  style: string;
  style_etc: string | null;
  party_size: string;
  shoot_date: string;
  shoot_time: string;
  location: string;
  location_is_custom: boolean;
  request_note: string | null;
}

let client: SupabaseClient | null = null;

// 서버 전용 클라이언트. 서비스 롤 키를 사용하므로 API 라우트/서버 컴포넌트에서만 import 하세요.
function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되어 있지 않습니다."
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return client;
}

// 이 버전의 supabase-js는 Database 제네릭 없이도(또는 있어도) 테이블 스키마 추론이
// 불안정해 insert/select 결과가 `never`로 좁혀지는 경우가 있어, 이 파일 안에서만
// 최소한으로 캐스팅하고 나머지 코드는 아래 타입이 지정된 헬퍼를 통해서만 접근합니다.
export async function insertReservation(
  row: ReservationInsert
): Promise<{ error: { message: string } | null }> {
  const supabase = getClient();
  const { error } = await (supabase.from("reservations") as any).insert(row);
  return { error };
}

export async function listReservations(): Promise<{
  data: ReservationRecord[] | null;
  error: { message: string } | null;
}> {
  const supabase = getClient();
  const { data, error } = await (supabase.from("reservations") as any)
    .select("*")
    .order("created_at", { ascending: false });
  return { data: data as ReservationRecord[] | null, error };
}

export async function listBookedTimesForDate(
  date: string
): Promise<{ data: string[] | null; error: { message: string } | null }> {
  const supabase = getClient();
  const { data, error } = await (supabase.from("reservations") as any)
    .select("shoot_time")
    .eq("shoot_date", date);
  if (error) return { data: null, error };
  return { data: (data as Array<{ shoot_time: string }>).map((r) => r.shoot_time), error: null };
}

export async function isSlotTaken(
  date: string,
  time: string
): Promise<{ taken: boolean; error: { message: string } | null }> {
  const supabase = getClient();
  const { data, error } = await (supabase.from("reservations") as any)
    .select("id")
    .eq("shoot_date", date)
    .eq("shoot_time", time)
    .limit(1);
  if (error) return { taken: false, error };
  return { taken: (data?.length ?? 0) > 0, error: null };
}

export async function deleteReservation(
  id: string
): Promise<{ error: { message: string } | null }> {
  const supabase = getClient();
  const { error } = await (supabase.from("reservations") as any)
    .delete()
    .eq("id", id);
  return { error };
}
