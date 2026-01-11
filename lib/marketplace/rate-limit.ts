import { supabase } from "@/lib/supabase/server"

const RATE_LIMITS = {
  CREATE_REQUEST: { requests: 5, window: 3600 }, // 5 por hora
  SEND_MESSAGE: { requests: 50, window: 3600 }, // 50 por hora
  UPLOAD_FILE: { requests: 20, window: 3600 }, // 20 por hora
}

export async function checkRateLimit(
  userId: string,
  action: keyof typeof RATE_LIMITS,
): Promise<{ allowed: boolean; remaining: number }> {
  const limit = RATE_LIMITS[action]
  const windowStart = new Date(Date.now() - limit.window * 1000).toISOString()

  const { count } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .eq("actorId", userId)
    .gte("createdAt", windowStart)

  const remaining = Math.max(0, limit.requests - (count || 0))
  return {
    allowed: remaining > 0,
    remaining,
  }
}

export function getRateLimitHeaders(remaining: number, limit: number) {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Limit": limit.toString(),
  }
}
