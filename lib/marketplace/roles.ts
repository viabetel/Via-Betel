// Role-based access control
export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN"
export type RequestStatus = "NEW" | "VIEWED" | "RESPONDED" | "AGREED" | "COMPLETED" | "CANCELED" | "EXPIRED"
export type VerificationStatus = "PENDING_DOCS" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED"

// Check if user has admin role
export function isAdmin(role?: string): boolean {
  return role === "ADMIN"
}

// Check if user is instructor
export function isInstructor(role?: string): boolean {
  return role === "INSTRUCTOR"
}

// Check if user is student
export function isStudent(role?: string): boolean {
  return role === "STUDENT"
}

// Check if instructor is verified
export function isVerified(verificationStatus?: string): boolean {
  return verificationStatus === "VERIFIED"
}

// Check if user is banned
export function isBanned(bannedAt?: string | null): boolean {
  return bannedAt !== null && bannedAt !== undefined
}
