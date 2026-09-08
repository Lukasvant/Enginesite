import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SESSION_COOKIE = "jubileum_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = { exp: number };

function sessionSecret(): string {
  return ADMIN_PASSWORD_HASH || ADMIN_PASSWORD;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS } satisfies SessionPayload)
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function hasValidSession(token: string | undefined): boolean {
  if (!token || !sessionSecret()) return false;
  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length > 0) return false;

  const expectedSignature = sign(payload);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    return Number.isInteger(exp) && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  if (ADMIN_PASSWORD_HASH) {
    return compare(password, ADMIN_PASSWORD_HASH);
  }
  return Boolean(ADMIN_PASSWORD) && password === ADMIN_PASSWORD;
}

export async function createSession(password: string): Promise<boolean> {
  const ok = await verifyPassword(password);
  if (!ok) return false;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
  return true;
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!hasValidSession(session?.value)) {
    redirect("/login");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
