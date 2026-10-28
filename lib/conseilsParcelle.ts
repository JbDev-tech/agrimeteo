import { prisma } from "@/lib/prisma";
import {
  conseilsGeneraux,
  conseilsCulture,
  type ConseilGenere,
  type MeteoActuelle,
} from "@/lib/conseils";

export type CycleEntree = {
  id: number;
  culture: { nom: string };
  releves: { stade_croissance: string | null }[];
};

export type ConseilsParcelle = {
  generaux: ConseilGenere[];
  cycles: { cycleId: number; conseils: ConseilGenere[] }[];
};

export function construireConseils(meteo: MeteoActuelle, cycles: CycleEntree[]): ConseilsParcelle {
  return {
    generaux: conseilsGeneraux(meteo),
    cycles: cycles.map((c) => ({
      cycleId: c.id,
      conseils: conseilsCulture(meteo, c.culture.nom, c.releves[0]?.stade_croissance),
    })),
  };
}

export async function sauvegarderConseils(
  parcelleId: number,
  meteo: MeteoActuelle,
  conseils: ConseilsParcelle,
) {
  const uneHeure = new Date(Date.now() - 60 * 60 * 1000);
  const debutJour = new Date();
  debutJour.setHours(0, 0, 0, 0);

  const recente = await prisma.meteo.findFirst({
    where: { parcelleId, date: { gte: uneHeure } },
  });

  if (!recente) {
    await prisma.meteo.create({
      data: {
        parcelleId,
        date: new Date(),
        temperature: meteo.temp,
        humidite: meteo.humidite,
        pluie: meteo.pluie,
        vent: meteo.vent,
      },
    });
  }

  const lignes = [
    ...conseils.generaux.map((c) => ({
      titre: c.titre,
      message: c.message,
      type: c.type,
      parcelleId,
      cycleCultureId: null as number | null,
    })),
    ...conseils.cycles.flatMap((cy) =>
      cy.conseils.map((c) => ({
        titre: c.titre,
        message: c.message,
        type: c.type,
        parcelleId,
        cycleCultureId: cy.cycleId as number | null,
      })),
    ),
  ];

  await prisma.$transaction([
    prisma.conseil.deleteMany({ where: { parcelleId, date: { gte: debutJour } } }),
    prisma.conseil.createMany({ data: lignes }),
  ]);
}