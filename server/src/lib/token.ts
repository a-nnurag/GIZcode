import crypto from 'node:crypto';
import { config } from '../config';

export interface TokenPayload {
  v: 1;
  iat: number;
  exp: number;
  origin: string;
  nonce: string;
}

const TTL_MS = 15 * 60 * 1000;

function hmac(encodedPayload: string): string {
  return crypto.createHmac('sha256', config.sessionSecret).update(encodedPayload).digest('base64url');
}

export function signToken(origin: string): { token: string; expiresAt: number } {
  const now = Date.now();
  const payload: TokenPayload = {
    v: 1,
    iat: now,
    exp: now + TTL_MS,
    origin,
    nonce: crypto.randomBytes(8).toString('hex'),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = hmac(encodedPayload);
  return { token: `${encodedPayload}.${signature}`, expiresAt: payload.exp };
}

// Constant-time signature comparison (crypto.timingSafeEqual) so verification time
// doesn't leak how many leading bytes of a forged signature happened to match.
export function verifyToken(token: string | undefined): TokenPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;

  const expectedSignature = hmac(encodedPayload);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (signatureBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(signatureBuf, expectedBuf)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (typeof payload.exp !== 'number' || payload.exp <= Date.now()) return null;
  return payload;
}
