export interface Instructor {
  id: string
  name: string
  role: string
  experience: string
  rating: string
  location: string
  city: string
  state: string
  neighborhood: string
  price: string
  studentsApproved: number
  specialties: string[]
  bio: string
  photo: string
}

export function extractCategories(role: string): string[] {
  const categories: string[] = []
  const categoryMatch = role.match(/Categoria[s]?\s+([A-E]+(?:\/[A-E]+)*)/i)

  if (categoryMatch) {
    const catString = categoryMatch[1]
    const cats = catString.split("/").map((c) => c.trim().toUpperCase())
    categories.push(...cats)
  }

  return [...new Set(categories)]
}

export function parsePrice(price: string): number {
  const match = price.match(/\d+/)
  return match ? Number.parseInt(match[0]) : 0
}

export function parseRating(rating: string): number {
  return Number.parseFloat(rating) || 0
}

export function generateSlug(name: string, city: string): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  return `${normalize(name)}-${normalize(city)}`
}

export function findInstructorBySlug(instructors: Instructor[], slug: string): Instructor | null {
  return instructors.find((inst) => generateSlug(inst.name, inst.city) === slug) || null
}
