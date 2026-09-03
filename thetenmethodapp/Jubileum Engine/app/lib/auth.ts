import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "jubileum-admin";
const SESSION_COOKIE = "jubileum_session";

export async function verifyPassword(password: string): Promise<boolean> {
  if (ADMIN_PASSWORD_HASH) {
    return compare(password, ADMIN_PASSWORD_HASH);
  }
  return password === ADMIN_PASSWORD;
}

export async function createSession(password: string): Promise<boolean> {
  const ok = await verifyPassword(password);
  if (!ok) return false;
  const token = await hash(password + Date.now().toString(), 10);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return true;
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) {
    redirect("/login");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
