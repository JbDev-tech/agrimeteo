import Link from "next/link";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMeteoActuelle } from "@/lib/meteo";
import { conseilsGeneraux, conseilsCulture, type MeteoActuelle } from "@/lib/conseils";
import SupprimerParcelleBouton from "@/components/SupprimerParcelleBouton";

export default async function ParcellesPage() {
  const user = await exigerUser();
  const maintenant = new Date();

  const parcelles = await prisma.parcelle.findMany({
    where: { userId: user.id },
    orderBy: { id: "asc" },
    include: {
      cycles: {
        where: {
          OR: [{ date_recolte: null }, { date_recolte: { gt: maintenant } }],
        },
        include: {
          culture: true,
          releves: { orderBy: { date: "desc" }, take: 1 },
        },
      },
    },
  });

  const lignes = await Promise.all(
    parcelles.map(async (p) => {
      let meteo: MeteoActuelle | null = null;
      try {
        meteo = await getMeteoActuelle(p.latitude, p.longitude);
      } catch {
        meteo = null;
      }

      const cultures = p.cycles.map((c) => ({
        nom: c.culture.nom,
        stade: c.releves[0]?.stade_croissance ?? null,
      }));

      let alertes = 0;
      if (meteo) {
        const generaux = conseilsGeneraux(meteo);
        const parCulture = cultures.flatMap((cu) => conseilsCulture(meteo, cu.nom, cu.stade));
        alertes = [...generaux, ...parCulture].filter((c) => c.type === "alerte").length;
      }

      return { parcelle: p, meteo, cultures, alertes };
    }),
  );

  const hectares =
    Math.round(parcelles.reduce((somme, p) => somme + p.superficie, 0) * 10) / 10;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-7 px-5 py-6 md:px-10 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mes parcelles</h1>
          <p className="mt-1.5 text-[15px] text-doux">
            {parcelles.length} parcelle{parcelles.length > 1 ? "s" : ""},{" "}
            {hectares.toLocaleString("fr-FR")} hectare{hectares > 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          href="/parcelles/ajouter"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-vert px-5 text-[15px] font-bold text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Ajouter une parcelle
        </Link>
      </header>

      {parcelles.length === 0 ? (
        <section className="flex flex-col items-start gap-3 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Aucune parcelle pour le moment</h2>
          <p className="text-[15px] text-doux">
            Ajoutez votre première parcelle pour voir sa météo et recevoir des conseils.
          </p>
        </section>
      ) : (
        <ul className="flex flex-col gap-4">
          {lignes.map(({ parcelle, meteo, cultures, alertes }) => (
            <li
              key={parcelle.id}
              className="flex flex-wrap items-center gap-5 rounded-2xl border border-bordure bg-white px-6 py-5"
            >
              <div className="min-w-0 flex-[1_1_240px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold">{parcelle.nom}</h2>
                  {alertes > 0 && (
                    <span className="rounded-full bg-soleil-fond px-2.5 py-1 text-xs font-bold text-soleil-texte">
                      {alertes} alerte{alertes > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-doux">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {parcelle.latitude.toFixed(2)} ; {parcelle.longitude.toFixed(2)} ·{" "}
                  {parcelle.superficie.toLocaleString("fr-FR")} ha
                </p>
              </div>

              <div className="min-w-0 flex-[1_1_180px]">
                <p className="text-xs font-semibold text-doux">Culture en cours</p>
                {cultures.length === 0 ? (
                  <p className="mt-1 text-[15px] font-medium text-doux">Aucune pour l'instant</p>
                ) : (
                  cultures.map((cu, i) => (
                    <p key={i} className="mt-1 text-[15px] font-bold">
                      {cu.nom}
                      {cu.stade && (
                        <span className="font-medium text-doux"> · {cu.stade}</span>
                      )}
                    </p>
                  ))
                )}
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-doux">Météo</p>
                <p className="mt-1 text-[22px] font-extrabold">
                  {meteo ? `${Math.round(meteo.temp)}°C` : "--"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/parcelles/${parcelle.id}`}
                  className="inline-flex min-h-11 items-center rounded-[10px] bg-vert-clair px-4 text-sm font-bold text-vert-texte"
                >
                  Voir
                </Link>
                <Link
                  href={`/parcelles/${parcelle.id}/modifier`}
                  className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-contour px-4 text-sm font-bold"
                >
                  Modifier
                </Link>
                <SupprimerParcelleBouton id={parcelle.id} nom={parcelle.nom} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}