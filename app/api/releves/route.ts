import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerReleve } from "@/lib/validation";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const releves = await prisma.releve.findMany({
    where: { cycleCulture: { parcelle: { userId: user.id } } },
    orderBy: { date: "desc" },
    include: { cycleCulture: { include: { culture: true, parcelle: true } } },
  });

  return NextResponse.json(releves);
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

  const erreur = validerReleve({
    cycleCultureId: corps.cycleCultureId,
    date: corps.date,
    observation: corps.observation,
    stade_croissance: corps.stade_croissance,
  });
  if (erreur) {
    return NextResponse.json({ error: erreur }, { status: 400 });
  }

  const cycle = await prisma.cycleCulture.findFirst({
    where: { id: corps.cycleCultureId, parcelle: { userId: user.id } },
  });
  if (!cycle) {
    return NextResponse.json({ error: "Cycle introuvable" }, { status: 404 });
  }

  const releve = await prisma.releve.create({
    data: {
      cycleCultureId: cycle.id,
      date: new Date(corps.date),
      observation: String(corps.observation).trim(),
      stade_croissance: corps.stade_croissance,
    },
  });

  return NextResponse.json(releve, { status: 201 });
}