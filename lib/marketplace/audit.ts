// Audit logging helper
import { supabase } from "@/lib/supabase/server"

export type AuditAction =
  | "REQUEST_CREATED"
  | "REQUEST_VIEWED"
  | "REQUEST_RESPONDED"
  | "REQUEST_AGREED"
  | "REQUEST_COMPLETED"
  | "REQUEST_CANCELED"
  | "MESSAGE_SENT"
  | "ATTACHMENT_UPLOADED"
  | "DOCUMENT_SUBMITTED"
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_REJECTED"
  | "USER_BANNED"
  | "USER_UNBANNED"

export async function logAudit(
  action: AuditAction,
  resourceType: "request" | "message" | "document" | "user",
  resourceId: string,
  details?: Record<string, any>,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  try {
    await supabase.from("audit_logs").insert({
      id: crypto.randomUUID(),
      actorId: user.id,
      action,
      resourceType,
      resourceId,
      details: details || {},
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Failed to log audit:", error)
    // Don't throw - audit logging should not break operations
  }
}

export async function logRequestEvent(requestId: string, type: string, data?: Record<string, any>): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  try {
    await supabase.from("request_events").insert({
      id: crypto.randomUUID(),
      requestId,
      actor_id: user.id,
      type,
      data: data || {},
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Failed to log request event:", error)
  }
}
