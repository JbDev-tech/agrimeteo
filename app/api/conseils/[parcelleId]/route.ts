import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMeteoActuelle } from "@/lib/meteo";
import { construireConseils, sauvegarderConseils } from "@/lib/conseilsParcelle";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ parcelleId: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const { parcelleId } = await params;
  const id = Number(parcelleId);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const parcelle = await prisma.parcelle.findFirst({
    where: { id, userId: user.id },
    include: {
      cycles: {
        where: {
          OR: [{ date_recolte: null }, { date_recolte: { gt: new Date() } }],
        },
        include: {
          culture: true,
          releves: { orderBy: { date: "desc" }, take: 1 },
        },
      },
    },
  });

  if (!parcelle) {
    return NextResponse.json({ error: "Parcelle introuvable" }, { status: 404 });
  }

  let meteo;
  try {
    meteo = await getMeteoActuelle(parcelle.latitude, parcelle.longitude);
  } catch {
    return NextResponse.json({ error: "Météo indisponible" }, { status: 502 });
  }

  if (!meteo) {
    return NextResponse.json({ error: "Météo indisponible" }, { status: 502 });
  }

  const conseils = construireConseils(meteo, parcelle.cycles);
  await sauvegarderConseils(parcelle.id, meteo, conseils);

  return NextResponse.json(conseils);
}