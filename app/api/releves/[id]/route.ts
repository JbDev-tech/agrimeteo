import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerReleve } from "@/lib/validation";

type Contexte = { params: Promise<{ id: string }> };

async function trouver(contexte: Contexte) {
  const user = await getUser();
  if (!user) {
    return { reponse: NextResponse.json({ error: "Non connecté" }, { status: 401 }) };
  }

  const { id } = await contexte.params;
  const releveId = Number(id);
  if (!Number.isInteger(releveId)) {
    return { reponse: NextResponse.json({ error: "Identifiant invalide" }, { status: 400 }) };
  }

  const releve = await prisma.releve.findFirst({
    where: { id: releveId, cycleCulture: { parcelle: { userId: user.id } } },
  });
  if (!releve) {
    return { reponse: NextResponse.json({ error: "Relevé introuvable" }, { status: 404 }) };
  }

  return { user, releve };
}

export async function GET(_req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;
  return NextResponse.json(r.releve);
}

export async function PUT(req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;

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
    where: { id: corps.cycleCultureId, parcelle: { userId: r.user!.id } },
  });
  if (!cycle) {
    return NextResponse.json({ error: "Cycle introuvable" }, { status: 404 });
  }

  const releve = await prisma.releve.update({
    where: { id: r.releve!.id },
    data: {
      cycleCultureId: cycle.id,
      date: new Date(corps.date),
      observation: String(corps.observation).trim(),
      stade_croissance: corps.stade_croissance,
    },
  });

  return NextResponse.json(releve);
}

export async function DELETE(_req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;

  await prisma.releve.delete({ where: { id: r.releve!.id } });
  return NextResponse.json({ ok: true });
}