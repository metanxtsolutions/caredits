import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Caps each client's own connection pool so N concurrent build workers/instances
// can't collectively exceed a pooled provider's connection limit (e.g. Supabase's
// session pooler, capped at 15) — Prisma's auto-sized default pool is per-client.
function datasourceUrl() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url || url.includes("connection_limit=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}connection_limit=3`;
}

function createClient() {
  return new PrismaClient({ datasourceUrl: datasourceUrl() });
}

let client = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;

// Some resource-constrained hosts (shared Node.js hosting like Hostinger's) can
// crash Prisma's native query engine with a Rust panic in its async timer
// ("PANIC: timer has gone away" — github.com/prisma/prisma/issues/26073), an
// unresolved upstream bug. Once that happens the engine instance is dead for
// every subsequent query. Since we can't fix the engine itself, we detect the
// crash and swap in a fresh client so the running process recovers on its own
// instead of every request failing until a manual redeploy.
function isFatalEngineError(err: unknown) {
  return err instanceof Prisma.PrismaClientRustPanicError;
}

function recreateClient() {
  const stale = client;
  client = createClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  stale.$disconnect().catch(() => {});
}

function wrap(value: unknown, thisArg: unknown): unknown {
  if (typeof value === "function") {
    return new Proxy(value, {
      apply(fn, _thisArg, args) {
        const result = Reflect.apply(fn, thisArg, args);
        if (result && typeof (result as Promise<unknown>).then === "function") {
          return (result as Promise<unknown>).catch((err: unknown) => {
            if (isFatalEngineError(err)) recreateClient();
            throw err;
          });
        }
        return result;
      },
    });
  }
  if (value && typeof value === "object") {
    return new Proxy(value, {
      get(obj, prop) {
        return wrap(Reflect.get(obj, prop), obj);
      },
    });
  }
  return value;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return wrap(Reflect.get(client as object, prop), client);
  },
});
