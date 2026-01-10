import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { instructors } from "@/data/instructors-data"
import { findInstructorBySlug, extractCategories, generateSlug } from "@/lib/instructor-utils"
import InstructorProfileClient from "./instructor-profile-client"

export async function generateStaticParams() {
  return instructors.map((inst) => ({
    slug: generateSlug(inst.name, inst.city),
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const instructor = findInstructorBySlug(instructors, params.slug)

  if (!instructor) {
    return {
      title: "Instrutor não encontrado | Via Betel",
    }
  }

  const categories = extractCategories(instructor.role).join(", ")

  return {
    title: `${instructor.name} - Instrutor ${categories} em ${instructor.city} | Via Betel`,
    description: `${instructor.name}, instrutor de direção em ${instructor.city}/${instructor.state}. ${instructor.experience}, nota ${instructor.rating}, ${instructor.studentsApproved} alunos aprovados. ${instructor.bio}`,
    openGraph: {
      title: `${instructor.name} - Instrutor de Direção`,
      description: `${instructor.experience}, ${instructor.studentsApproved} alunos aprovados`,
      images: [instructor.photo],
    },
  }
}

export default function InstructorProfilePage({ params }: { params: { slug: string } }) {
  const instructor = findInstructorBySlug(instructors, params.slug)

  if (!instructor) {
    notFound()
  }

  return <InstructorProfileClient instructor={instructor} />
}
