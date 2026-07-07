import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Caps each client's own connection pool so N concurrent build workers/instances
// can't collectively exceed a pooled provider's connection limit (e.g. Supabase's
// session pooler, capped at 15) — Prisma's auto-sized default pool is per-client.
function datasourceUrl() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url || url.includes("connection_limit=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}connection_limit=3`;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: datasourceUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
