// Firma/verificación del JWT de sesión. Solo depende de `jose`, así que corre también en el middleware (edge).
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'olivia_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error('AUTH_SECRET no está definido (mínimo 16 caracteres).');
  return new TextEncoder().encode(s);
}

export async function signToken(payload: { uid: number; username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { uid: payload.uid as number, username: payload.username as string };
  } catch {
    return null;
  }
}
