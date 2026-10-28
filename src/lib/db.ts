import { PrismaClient } from '@prisma/client';

// Errores de conexión transitorios: el proxy de Railway cierra las conexiones inactivas y Prisma puede
// reutilizar una ya cerrada (P1017) o no llegar a la base por un instante (P1001/P1002/P1008).
const TRANSIENT = new Set(['P1001', 'P1002', 'P1008', 'P1017']);

export function isTransientDbError(e: unknown) {
  return typeof e === 'object' && e !== null && 'code' in e && TRANSIENT.has((e as { code: string }).code);
}

function createClient() {
  return new PrismaClient().$extends({
    query: {
      // Cada consulta se reintenta (con la conexión ya renovada) si falla por un corte transitorio
      async $allOperations({ args, query }) {
        for (let attempt = 0; ; attempt++) {
          try {
            return await query(args);
          } catch (e) {
            if (attempt >= 2 || !isTransientDbError(e)) throw e;
            await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
          }
        }
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
