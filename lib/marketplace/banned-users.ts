import { supabase } from "@/lib/supabase/server"

export async function isBanned(userId: string): Promise<boolean> {
  const { data: profile } = await supabase.from("profiles").select("bannedAt").eq("id", userId).single()

  if (!profile?.bannedAt) return false

  const bannedAt = new Date(profile.bannedAt)
  return bannedAt > new Date()
}

export async function checkBanStatus(
  userId: string,
): Promise<{ banned: boolean; reason?: string; expiresAt?: string }> {
  const { data: audit } = await supabase
    .from("audit_logs")
    .select("details")
    .eq("actorId", userId)
    .eq("action", "USER_BANNED")
    .order("createdAt", { ascending: false })
    .limit(1)
    .single()

  if (!audit) return { banned: false }

  const { reason, expiresAt } = audit.details || {}
  const banned = expiresAt ? new Date(expiresAt) > new Date() : true

  return { banned, reason, expiresAt }
}
