import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getMeteoActuelle } from "@/lib/meteo";
import { genererConseils } from "@/lib/conseils";
import { getUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ parcelleId: string }> },
) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const { parcelleId } = await params;
    const id = Number(parcelleId);

    const parcelle = await prisma.parcelle.findFirst({
      where: { id, userId: user.id },
    });
    if (!parcelle) {
      return NextResponse.json({ error: "Parcelle introuvable" }, { status: 404 });
    }

    // Cycle actif : pas de date de récolte, ou récolte dans le futur
    const cycle = await prisma.cycleCulture.findFirst({
      where: {
        parcelleId: id,
        OR: [{ date_recolte: null }, { date_recolte: { gt: new Date() } }],
      },
      orderBy: { date_plantation: "desc" },
      include: {
        culture: true,
        releves: { orderBy: { date: "desc" }, take: 1 },
      },
    });

    const meteo = await getMeteoActuelle(parcelle.latitude, parcelle.longitude);

    // Sauvegarde d'un instantané météo (au maximum 1 par heure)
    const ilYAUneHeure = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await prisma.meteo.findFirst({
      where: { parcelleId: id, date: { gte: ilYAUneHeure } },
    });
    if (!recent) {
      await prisma.meteo.create({
        data: {
          parcelleId: id,
          date: new Date(),
          temperature: meteo.temp,
          humidite: meteo.humidite,
          pluie: meteo.pluie,
          vent: meteo.vent,
        },
      });
    }

    const conseils = genererConseils(
      meteo,
      cycle?.culture.nom,
      cycle?.releves[0]?.stade_croissance,
    );

    // On remplace les conseils d'aujourd'hui pour éviter les doublons
    const debutJournee = new Date();
    debutJournee.setHours(0, 0, 0, 0);

    await prisma.conseil.deleteMany({
      where: { parcelleId: id, date: { gte: debutJournee } },
    });
    await prisma.conseil.createMany({
      data: conseils.map((c) => ({ ...c, parcelleId: id })),
    });

    return NextResponse.json(conseils);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}