import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerParcelle, validerCulture } from "@/lib/validation";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const parcelles = await prisma.parcelle.findMany({
    where: { userId: user.id },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(parcelles);
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

  const erreur = validerParcelle({
    nom: corps.nom,
    latitude: corps.latitude,
    longitude: corps.longitude,
    superficie: corps.superficie,
  });
  if (erreur) {
    return NextResponse.json({ error: erreur }, { status: 400 });
  }

  const initiale = corps.culture ?? null;
  let cultureExistante: { id: number } | null = null;
  let nouvelle: { nom: string; type: string } | null = null;

  if (initiale) {
    const date = initiale.date_plantation;
    if (typeof date !== "string" || Number.isNaN(new Date(date).getTime())) {
      return NextResponse.json({ error: "Entrez une date de plantation valide." }, { status: 400 });
    }

    if (initiale.cultureId !== undefined && initiale.cultureId !== null) {
      if (!Number.isInteger(initiale.cultureId)) {
        return NextResponse.json({ error: "Culture invalide." }, { status: 400 });
      }
      cultureExistante = await prisma.culture.findFirst({
        where: { id: initiale.cultureId, userId: user.id },
        select: { id: true },
      });
      if (!cultureExistante) {
        return NextResponse.json({ error: "Culture introuvable." }, { status: 404 });
      }
    } else {
      const erreurCulture = validerCulture({ nom: initiale.nom, type: initiale.type });
      if (erreurCulture) {
        return NextResponse.json({ error: erreurCulture }, { status: 400 });
      }
      nouvelle = { nom: String(initiale.nom).trim(), type: initiale.type };
      cultureExistante = await prisma.culture.findFirst({
        where: { userId: user.id, nom: nouvelle.nom },
        select: { id: true },
      });
    }
  }

  const parcelle = await prisma.$transaction(async (tx) => {
    const creee = await tx.parcelle.create({
      data: {
        nom: String(corps.nom).trim(),
        latitude: corps.latitude,
        longitude: corps.longitude,
        superficie: corps.superficie,
        userId: user.id,
      },
    });

    if (initiale) {
      const cultureId = cultureExistante
        ? cultureExistante.id
        : (
            await tx.culture.create({
              data: { nom: nouvelle!.nom, type: nouvelle!.type, userId: user.id },
            })
          ).id;

      await tx.cycleCulture.create({
        data: {
          parcelleId: creee.id,
          cultureId,
          date_plantation: new Date(initiale.date_plantation),
          date_recolte: null,
        },
      });
    }

    return creee;
  });

  return NextResponse.json(parcelle, { status: 201 });
}