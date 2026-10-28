import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerCycle } from "@/lib/validation";

type Contexte = { params: Promise<{ id: string }> };

async function trouver(contexte: Contexte) {
  const user = await getUser();
  if (!user) {
    return { reponse: NextResponse.json({ error: "Non connecté" }, { status: 401 }) };
  }

  const { id } = await contexte.params;
  const cycleId = Number(id);
  if (!Number.isInteger(cycleId)) {
    return { reponse: NextResponse.json({ error: "Identifiant invalide" }, { status: 400 }) };
  }

  const cycle = await prisma.cycleCulture.findFirst({
    where: { id: cycleId, parcelle: { userId: user.id } },
  });
  if (!cycle) {
    return { reponse: NextResponse.json({ error: "Cycle introuvable" }, { status: 404 }) };
  }

  return { user, cycle };
}

export async function GET(_req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;
  return NextResponse.json(r.cycle);
}

export async function PUT(req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;

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
    prisma.parcelle.findFirst({ where: { id: corps.parcelleId, userId: r.user!.id } }),
    prisma.culture.findFirst({ where: { id: corps.cultureId, userId: r.user!.id } }),
  ]);

  if (!parcelle || !culture) {
    return NextResponse.json({ error: "Parcelle ou culture introuvable" }, { status: 404 });
  }

  const cycle = await prisma.cycleCulture.update({
    where: { id: r.cycle!.id },
    data: {
      parcelleId: parcelle.id,
      cultureId: culture.id,
      date_plantation: new Date(corps.date_plantation),
      date_recolte: corps.date_recolte ? new Date(corps.date_recolte) : null,
    },
  });

  return NextResponse.json(cycle);
}

export async function DELETE(_req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;

  const id = r.cycle!.id;

  await prisma.$transaction([
    prisma.releve.deleteMany({ where: { cycleCultureId: id } }),
    prisma.conseil.deleteMany({ where: { cycleCultureId: id } }),
    prisma.cycleCulture.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}