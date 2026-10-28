import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MENU_PAGES = [
  { slug: 'carta-promos', title: 'Promos', alt: 'Promos y meriendas de Olivia Pastelería y Café con precios', sortOrder: 1 },
  { slug: 'carta-dulces-y-salados', title: 'Dulces y salados', alt: 'Carta de Olivia Pastelería y Café: opciones dulces y saladas con precios', sortOrder: 2 },
  { slug: 'carta-bebidas', title: 'Bebidas', alt: 'Carta de bebidas de Olivia Pastelería y Café: cafés, jugos, limonadas, batidos y más, con precios', sortOrder: 3 },
  { slug: 'carta-sin-tacc', title: 'Sin TACC', alt: 'Carta de opciones Sin TACC de Olivia Pastelería y Café con precios', sortOrder: 4 },
];

function times(from: string, to: string, stepMin: number) {
  const [fh, fm] = from.split(':').map(Number);
  const [th, tm] = to.split(':').map(Number);
  const out: string[] = [];
  for (let m = fh * 60 + fm; m <= th * 60 + tm; m += stepMin) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
}

async function main() {
  await prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  for (const startTime of [...times('09:00', '12:30', 30), ...times('17:00', '20:00', 30)]) {
    await prisma.shift.upsert({ where: { startTime }, update: {}, create: { startTime, capacity: 20 } });
  }

  for (const p of MENU_PAGES) {
    // update vacío: volver a correr el seed no pisa lo que se editó desde el panel
    await prisma.menuPage.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  const username = process.env.SEED_ADMIN_USER || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) throw new Error('Definí SEED_ADMIN_PASSWORD para crear el usuario admin.');
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({ where: { username }, update: { passwordHash }, create: { username, passwordHash } });

  console.log(`Seed listo. Usuario admin: ${username}`);
}

main().finally(() => prisma.$disconnect());
