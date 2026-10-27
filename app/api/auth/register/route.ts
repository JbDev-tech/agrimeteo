import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { creerSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nom = String(body.nom ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const motDePasse = String(body.motDePasse ?? "");

    if (!nom || !email.includes("@") || motDePasse.length < 8) {
      return NextResponse.json(
        { error: "Nom, email valide et mot de passe d'au moins 8 caractères requis" },
        { status: 400 },
      );
    }

    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: { nom, email, motDePasse: await hash(motDePasse, 10) },
    });

    await creerSession(user.id);
    return NextResponse.json({ id: user.id, nom: user.nom, email: user.email }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}