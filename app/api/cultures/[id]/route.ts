import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerCulture } from "@/lib/validation";

type Contexte = { params: Promise<{ id: string }> };

async function trouver(contexte: Contexte) {
  const user = await getUser();
  if (!user) {
    return { reponse: NextResponse.json({ error: "Non connecté" }, { status: 401 }) };
  }

  const { id } = await contexte.params;
  const cultureId = Number(id);
  if (!Number.isInteger(cultureId)) {
    return { reponse: NextResponse.json({ error: "Identifiant invalide" }, { status: 400 }) };
  }

  const culture = await prisma.culture.findFirst({
    where: { id: cultureId, userId: user.id },
  });
  if (!culture) {
    return { reponse: NextResponse.json({ error: "Culture introuvable" }, { status: 404 }) };
  }

  return { user, culture };
}

export async function GET(_req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;
  return NextResponse.json(r.culture);
}

export async function PUT(req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;

  const corps = await req.json().catch(() => null);
  if (!corps) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const erreur = validerCulture({ nom: corps.nom, type: corps.type });
  if (erreur) {
    return NextResponse.json({ error: erreur }, { status: 400 });
  }

  const nom = String(corps.nom).trim();

  const doublon = await prisma.culture.findFirst({
    where: { userId: r.user!.id, nom, NOT: { id: r.culture!.id } },
  });
  if (doublon) {
    return NextResponse.json({ error: `Vous avez déjà une culture « ${nom} ».` }, { status: 409 });
  }

  const culture = await prisma.culture.update({
    where: { id: r.culture!.id },
    data: { nom, type: corps.type },
  });

  return NextResponse.json(culture);
}

export async function DELETE(_req: Request, contexte: Contexte) {
  const r = await trouver(contexte);
  if (r.reponse) return r.reponse;

  const nbCycles = await prisma.cycleCulture.count({
    where: { cultureId: r.culture!.id },
  });
  if (nbCycles > 0) {
    return NextResponse.json(
      {
        error: `Cette culture est utilisée par ${nbCycles} cycle${nbCycles > 1 ? "s" : ""}. Supprimez d'abord ces cycles.`,
      },
      { status: 409 },
    );
  }

  await prisma.culture.delete({ where: { id: r.culture!.id } });
  return NextResponse.json({ ok: true });
}