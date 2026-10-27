import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { creerSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const motDePasse = String(body.motDePasse ?? "");

    const user = await prisma.user.findUnique({ where: { email } });
    const valide = user ? await compare(motDePasse, user.motDePasse) : false;

    // Même message dans les deux cas, pour ne pas révéler quels emails existent
    if (!user || !valide) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    await creerSession(user.id);
    return NextResponse.json({ id: user.id, nom: user.nom, email: user.email });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}