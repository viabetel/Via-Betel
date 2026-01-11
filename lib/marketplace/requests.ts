// Request status transitions and validation
import type { RequestStatus } from "./roles"

export function isValidStatusTransition(currentStatus: RequestStatus, newStatus: RequestStatus): boolean {
  const validTransitions: Record<RequestStatus, RequestStatus[]> = {
    NEW: ["VIEWED", "CANCELED"],
    VIEWED: ["RESPONDED", "CANCELED"],
    RESPONDED: ["AGREED", "CANCELED"],
    AGREED: ["COMPLETED", "CANCELED"],
    COMPLETED: [],
    CANCELED: [],
    EXPIRED: [],
  }

  return validTransitions[currentStatus]?.includes(newStatus) ?? false
}

export function canChangeStatus(
  currentStatus: RequestStatus,
  newStatus: RequestStatus,
  role: string,
  studentId: string,
  instructorId: string | null,
  userId: string,
): boolean {
  // Validate transition
  if (!isValidStatusTransition(currentStatus, newStatus)) return false

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

export function getRequestExpirationDate(createdAt: Date): Date {
  // Requests expire after 30 days
  const expirationDate = new Date(createdAt)
  expirationDate.setDate(expirationDate.getDate() + 30)
  return expirationDate
}
