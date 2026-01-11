import { redirect } from "next/navigation"

export async function GET() {
  redirect("/conta/meus-planos")
}
