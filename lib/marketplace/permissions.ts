// Permission checks for specific actions
import { isAdmin, isInstructor, isStudent, isVerified } from "./roles"

export function canCreateRequest(role?: string): boolean {
  return isStudent(role)
}

export function canViewRequest(
  requestId: string,
  studentId: string,
  instructorId: string | null,
  userId: string,
  role?: string,
): boolean {
  // Student can view own, instructor can view assigned, admin can view all
  if (isAdmin(role)) return true
  if (isStudent(role) && studentId === userId) return true
  if (isInstructor(role) && instructorId === userId) return true
  return false
}

export function canRespondToRequest(
  instructorId: string | null,
  userId: string,
  role?: string,
  verificationStatus?: string,
): boolean {
  // Only verified instructors can respond
  if (!isInstructor(role)) return false
  if (!isVerified(verificationStatus)) return false
  // Instructor can respond to unassigned or own requests
  if (instructorId === null || instructorId === userId) return true
  return false
}

export function canCompleteRequest(studentId: string, instructorId: string, userId: string, role?: string): boolean {
  // Both student and instructor can mark complete, or admin
  if (isAdmin(role)) return true
  if (isStudent(role) && studentId === userId) return true
  if (isInstructor(role) && instructorId === userId) return true
  return false
}

export function canSendMessage(
  conversationId: string,
  studentId: string,
  instructorId: string,
  userId: string,
  role?: string,
): boolean {
  // Only participants or admin can send messages
  if (isAdmin(role)) return true
  if (studentId === userId || instructorId === userId) return true
  return false
}

export function canViewDocuments(role?: string): boolean {
  // Only admin can view documents for verification
  return isAdmin(role)
}

export function canApproveDocuments(role?: string): boolean {
  // Only admin can approve documents
  return isAdmin(role)
}

export function canChangeStatus(
  currentStatus: "NEW" | "VIEWED" | "RESPONDED" | "AGREED" | "COMPLETED" | "CANCELED" | "EXPIRED",
  newStatus: "NEW" | "VIEWED" | "RESPONDED" | "AGREED" | "COMPLETED" | "CANCELED" | "EXPIRED",
  role: string | undefined,
  studentId: string,
  instructorId: string | null,
  userId: string,
): boolean {
  // Validate transition
  const validTransitions: Record<string, string[]> = {
    NEW: ["VIEWED", "CANCELED"],
    VIEWED: ["RESPONDED", "CANCELED"],
    RESPONDED: ["AGREED", "CANCELED"],
    AGREED: ["COMPLETED", "CANCELED"],
    COMPLETED: [],
    CANCELED: [],
    EXPIRED: [],
  }

  if (!validTransitions[currentStatus]?.includes(newStatus)) return false

  // Admin can do anything
  if (role === "ADMIN") return true

  // Student can cancel
  if (role === "STUDENT" && studentId === userId && newStatus === "CANCELED") return true

  // Instructor can mark VIEWED, RESPONDED, AGREED, COMPLETED
  if (role === "INSTRUCTOR" && instructorId === userId) {
    return ["VIEWED", "RESPONDED", "AGREED", "COMPLETED"].includes(newStatus)
  }

  return false
}
