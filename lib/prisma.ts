// Usa dinâmico import com fallback seguro

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

let prisma: any

try {
  const { PrismaClient } = require("@prisma/client")

  if (!process.env.DATABASE_URL) {
    console.warn("[PRISMA] DATABASE_URL não configurada.")
    prisma = new Proxy(
      {},
      {
        get: () => {
          throw new Error("DATABASE_URL não configurada.")
        },
      },
    )
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
} catch (error) {
  console.warn("[PRISMA] Erro ao carregar Prisma Client:", error)
  prisma = new Proxy(
    {},
    {
      get: () => {
        throw new Error("Prisma Client não disponível. Execute 'npm run postinstall' para gerar.")
      },
    },
  )
}

export { prisma }

// Para compatibilidade com código existente que usa await import
export async function getPrisma() {
  return prisma
}
