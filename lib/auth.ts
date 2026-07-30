import { SignJWT, jwtVerify } from "jose";

import { adminLogin, adminPassword, sessionSecret } from "@/lib/env";

// Сессия админки: подписанный JWT в httpOnly-куке. jose работает и в
// middleware (edge runtime), и в обычных роутах, поэтому логика одна на всех.

export const SESSION_COOKIE = "ng_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function secretKey(): Uint8Array {
  return new TextEncoder().encode(sessionSecret);
}

export function checkCredentials(login: string, password: string): boolean {
  if (!adminLogin || !adminPassword) {
    return false;
  }

  return login === adminLogin && password === adminPassword;
}

export async function createSessionToken(login: string): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(login)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !sessionSecret) {
    return false;
  }

  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS
};
