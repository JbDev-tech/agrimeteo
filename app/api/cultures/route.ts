import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerCulture } from "@/lib/validation";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const cultures = await prisma.culture.findMany({
    where: { userId: user.id },
    orderBy: { nom: "asc" },
  });

  return NextResponse.json(cultures);
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const corps = await req.json().catch(() => null);
  if (!corps) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const erreur = validerCulture({ nom: corps.nom, type: corps.type });
  if (erreur) {
    return NextResponse.json({ error: erreur }, { status: 400 });
  }

  const nom = String(corps.nom).trim();

  const existe = await prisma.culture.findFirst({
    where: { userId: user.id, nom },
  });
  if (existe) {
    return NextResponse.json({ error: `Vous avez déjà une culture « ${nom} ».` }, { status: 409 });
  }

  const culture = await prisma.culture.create({
    data: { nom, type: corps.type, userId: user.id },
  });

  return NextResponse.json(culture, { status: 201 });
}