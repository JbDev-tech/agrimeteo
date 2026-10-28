import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerCycle } from "@/lib/validation";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const cycles = await prisma.cycleCulture.findMany({
    where: { parcelle: { userId: user.id } },
    orderBy: { date_plantation: "desc" },
    include: { parcelle: true, culture: true },
  });

  return NextResponse.json(cycles);
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

  const erreur = validerCycle({
    parcelleId: corps.parcelleId,
    cultureId: corps.cultureId,
    date_plantation: corps.date_plantation,
    date_recolte: corps.date_recolte,
  });
  if (erreur) {
    return NextResponse.json({ error: erreur }, { status: 400 });
  }

  const [parcelle, culture] = await Promise.all([
    prisma.parcelle.findFirst({ where: { id: corps.parcelleId, userId: user.id } }),
    prisma.culture.findFirst({ where: { id: corps.cultureId, userId: user.id } }),
  ]);

  if (!parcelle || !culture) {
    return NextResponse.json({ error: "Parcelle ou culture introuvable" }, { status: 404 });
  }

  const cycle = await prisma.cycleCulture.create({
    data: {
      parcelleId: parcelle.id,
      cultureId: culture.id,
      date_plantation: new Date(corps.date_plantation),
      date_recolte: corps.date_recolte ? new Date(corps.date_recolte) : null,
    },
  });

  return NextResponse.json(cycle, { status: 201 });
}