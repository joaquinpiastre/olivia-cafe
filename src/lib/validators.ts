import { z } from 'zod';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida');
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const phoneField = z
  .string()
  .trim()
  .min(8, 'Ingresá un teléfono válido')
  .max(25, 'Teléfono demasiado largo')
  .regex(/^[\d\s+()-]+$/, 'Usá solo números');

const emailField = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email inválido');

export const reservationSchema = z.object({
  type: z.enum(['MESA', 'MERIENDA', 'TARDE_DE_TE', 'EVENTO'], { message: 'Elegí un tipo de reserva' }),
  date: dateStr,
  shiftId: z.coerce.number().int().positive('Elegí un horario'),
  partySize: z.coerce.number().int().min(1, 'Mínimo 1 persona').max(200),
  name: z.string().trim().min(2, 'Ingresá tu nombre').max(80),
  phone: phoneField,
  email: emailField,
  notes: optionalText(700), // el formulario antepone el menú elegido a los 600 caracteres del cliente
  // honeypot: los bots lo completan, las personas no lo ven
  website: z.string().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const eventInquirySchema = z.object({
  name: z.string().trim().min(2, 'Ingresá tu nombre').max(80),
  phone: phoneField,
  email: emailField,
  eventType: z.string().trim().min(2, 'Contanos qué tipo de evento es').max(60),
  eventDate: z
    .string()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Fecha inválida'),
  guests: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0 && v < 2000), 'Cantidad inválida'),
  message: z.string().trim().min(5, 'Contanos un poco más').max(1500),
  website: z.string().optional(),
});

export function firstError(err: z.ZodError) {
  return err.issues[0]?.message ?? 'Datos inválidos';
}
