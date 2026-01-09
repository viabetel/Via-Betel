import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function parseConnectionString(connectionString: string | undefined) {
  if (!connectionString) {
    return {
      host: null,
      user: null,
      port: null,
    }
  }

  try {
    // Parse PostgreSQL connection string
    // Format: postgresql://user:password@host:port/database
    const url = new URL(connectionString)

    return {
      host: url.hostname || null,
      user: url.username || null,
      port: url.port || null,
    }
  } catch (error) {
    console.error("[v0] Error parsing connection string:", error)
    return {
      host: "parse_error",
      user: "parse_error",
      port: "parse_error",
    }
  }
}

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL
  const directUrl = process.env.DIRECT_URL

  const databaseUrlParsed = parseConnectionString(databaseUrl)
  const directUrlParsed = parseConnectionString(directUrl)

  return NextResponse.json({
    has_DATABASE_URL: !!databaseUrl,
    has_DIRECT_URL: !!directUrl,
    database_url_host: databaseUrlParsed.host,
    database_url_user: databaseUrlParsed.user,
    database_url_port: databaseUrlParsed.port,
    direct_url_host: directUrlParsed.host,
    direct_url_user: directUrlParsed.user,
    direct_url_port: directUrlParsed.port,
    timestamp: new Date().toISOString(),
  })
}
