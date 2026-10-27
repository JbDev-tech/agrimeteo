import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const NOM_COOKIE = "session";
const DUREE = 60 * 60 * 24 * 7; // 7 jours

function getSecret() {
  if (!process.env.AUTH_SECRET) throw new Error("AUTH_SECRET manquant dans .env");
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export async function creerSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(NOM_COOKIE, token, {
    httpOnly: true, // illisible par le JavaScript du navigateur
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE,
  });
}

export async function supprimerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(NOM_COOKIE);
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOM_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: { id: true, nom: true, email: true },
    });
  } catch {
    return null; // token invalide ou expiré
  }
}

// Pour les pages : redirige vers /login si non connecté
export async function exigerUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}