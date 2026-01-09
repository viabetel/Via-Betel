import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (!process.env.DATABASE_URL) {
  console.warn("[PRISMA] DATABASE_URL não configurada. Funcionalidades de banco de dados não estarão disponíveis.")
  // Cria cliente mock para não quebrar imports
  prisma = new Proxy({} as PrismaClient, {
    get: () => {
      throw new Error(
        "DATABASE_URL não configurada. Configure as variáveis de ambiente antes de usar o banco de dados.",
      )
    },
  })
} else {
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
  }
}

export { prisma }
