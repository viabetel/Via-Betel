import type { MetadataRoute } from "next"
import { instructors } from "@/data/instructors-data"
import { generateSlug } from "@/lib/instructor-utils"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://viabetel.com"
  const currentDate = new Date()

  const instructorPages: MetadataRoute.Sitemap = instructors.map((inst) => ({
    url: `${baseUrl}/instrutores/${generateSlug(inst.name, inst.city)}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/aluno`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instrutor`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instrutores`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    ...instructorPages,
  ]
}
