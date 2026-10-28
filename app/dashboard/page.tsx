import Link from "next/link";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMeteoActuelle, getPrevisions } from "@/lib/meteo";
import {
  conseilsGeneraux,
  conseilsCulture,
  type ConseilGenere,
  type MeteoActuelle,
} from "@/lib/conseils";

const STYLES: Record<ConseilGenere["type"], { fond: string; pastille: string; chemins: string[] }> = {
  alerte: {
    fond: "bg-alerte-fond",
    pastille: "bg-alerte",
    chemins: ["M12 3l10 18H2z", "M12 10v5M12 18v.5"],
  },
  arrosage: {
    fond: "bg-eau-fond",
    pastille: "bg-eau",
    chemins: ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"],
  },
  culture: {
    fond: "bg-vert-clair",
    pastille: "bg-vert",
    chemins: ["M12 21v-9", "M12 12c0-4-3-6-7-6 0 4 3 6 7 6z", "M12 14c0-3 2-5 6-5 0 3-2 5-6 5z"],
  },
  info: {
    fond: "bg-[#EEEDE3]",
    pastille: "bg-doux",
    chemins: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 11v5M12 8v.5"],
  },
};

const ORDRE: Record<ConseilGenere["type"], number> = {
  alerte: 0,
  arrosage: 1,
  culture: 2,
  info: 3,
};

function Icone({ chemins, taille }: { chemins: string[]; taille: number }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {chemins.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function IconeMeteo({ condition }: { condition: string }) {
  if (condition === "Clear") {
    return (
      <Icone
        taille={56}
        chemins={[
          "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
          "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5",
        ]}
      />
    );
  }
  return <Icone taille={56} chemins={["M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-.5 8.5H7z"]} />;
}

type ParcelleMeteo = {
  id: number;
  nom: string;
  meteo: MeteoActuelle;
  cultures: { nom: string; stade: string | null }[];
};

export default async function DashboardPage() {
  const user = await exigerUser();
  const maintenant = new Date();
  const cycleActif = {
    OR: [{ date_recolte: null }, { date_recolte: { gt: maintenant } }],
  };

  const [parcelles, nbParcelles, somme, cyclesActifs] = await Promise.all([
    prisma.parcelle.findMany({
      where: { userId: user.id },
      orderBy: { id: "asc" },
      take: 5,
      include: {
        cycles: {
          where: cycleActif,
          include: {
            culture: true,
            releves: { orderBy: { date: "desc" }, take: 1 },
          },
        },
      },
    }),
    prisma.parcelle.count({ where: { userId: user.id } }),
    prisma.parcelle.aggregate({
      where: { userId: user.id },
      _sum: { superficie: true },
    }),
    prisma.cycleCulture.findMany({
      where: { parcelle: { userId: user.id }, ...cycleActif },
      select: { culture: { select: { nom: true } } },
    }),
  ]);

  const resultats = await Promise.all(
    parcelles.map(async (p): Promise<ParcelleMeteo | null> => {
      try {
        const meteo = await getMeteoActuelle(p.latitude, p.longitude);
        if (!meteo) return null;
        return {
          id: p.id,
          nom: p.nom,
          meteo,
          cultures: p.cycles.map((c) => ({
            nom: c.culture.nom,
            stade: c.releves[0]?.stade_croissance ?? null,
          })),
        };
      } catch {
        return null;
      }
    }),
  );

  const donnees = resultats.filter((r): r is ParcelleMeteo => r !== null);
  const principale = donnees[0];

  let previsions: Awaited<ReturnType<typeof getPrevisions>> = [];
  if (parcelles[0]) {
    try {
      previsions = await getPrevisions(parcelles[0].latitude, parcelles[0].longitude);
    } catch {
      previsions = [];
    }
  }

  const conseils = donnees
    .flatMap((d) => [
      ...conseilsGeneraux(d.meteo).map((c) => ({ ...c, parcelle: d.nom })),
      ...d.cultures.flatMap((cu) =>
        conseilsCulture(d.meteo, cu.nom, cu.stade)
          .filter((c) => c.type !== "info")
          .map((c) => ({ ...c, parcelle: d.nom })),
      ),
    ])
    .sort((a, b) => ORDRE[a.type] - ORDRE[b.type])
    .slice(0, 8);

  const nbAlertes = conseils.filter((c) => c.type === "alerte").length;

  const nomsCultures = [...new Set(cyclesActifs.map((c) => c.culture.nom))];
  const hectares = Math.round((somme._sum.superficie ?? 0) * 10) / 10;

  const date = maintenant.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dateAffichee = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 md:px-10 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold text-doux">{dateAffichee}</p>
          <h1 className="mt-0.5 text-3xl font-extrabold tracking-tight md:text-4xl">
            Bonjour {user.nom}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/releves/ajouter"
            className="inline-flex min-h-11 items-center rounded-lg border-2 border-vert bg-white px-4 text-sm font-bold text-vert-texte"
          >
            Ajouter un relevé
          </Link>
          <Link
            href="/parcelles/ajouter"
            className="inline-flex min-h-11 items-center rounded-lg bg-vert px-4 text-sm font-bold text-white"
          >
            + Ajouter une parcelle
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-bordure bg-white p-4">
          <p className="text-xs font-semibold text-doux">Parcelles</p>
          <p className="mt-1 text-3xl font-extrabold">{nbParcelles}</p>
          <p className="mt-1 text-xs text-doux">
            {hectares.toLocaleString("fr-FR")} hectare{hectares > 1 ? "s" : ""} au total
          </p>
        </div>
        <div className="rounded-2xl border border-bordure bg-white p-4">
          <p className="text-xs font-semibold text-doux">Cultures en cours</p>
          <p className="mt-1 text-3xl font-extrabold">{nomsCultures.length}</p>
          <p className="mt-1 text-xs text-doux">
            {nomsCultures.length > 0 ? nomsCultures.slice(0, 3).join(", ") : "Aucune pour le moment"}
          </p>
        </div>
        <div className="rounded-2xl border border-soleil-bord bg-soleil-fond p-4">
          <p className="text-xs font-semibold text-soleil-texte">Alertes du jour</p>
          <p className="mt-1 text-3xl font-extrabold text-soleil-texte">{nbAlertes}</p>
          <p className="mt-1 text-xs text-soleil-texte">
            {nbAlertes > 0 ? "À lire ci-dessous" : "Rien d'urgent"}
          </p>
        </div>
      </section>

      {nbParcelles === 0 ? (
        <section className="flex flex-col items-start gap-3 rounded-[20px] border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Commencez par ajouter une parcelle</h2>
          <p className="text-[15px] text-doux">
            Dès que vous avez une parcelle, vous voyez ici sa météo et vos conseils du jour.
          </p>
          <Link
            href="/parcelles/ajouter"
            className="inline-flex min-h-12 items-center rounded-xl bg-vert px-6 font-bold text-white"
          >
            Ajouter une parcelle
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <section className="flex flex-col gap-4 rounded-[20px] border border-bordure bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Météo</h2>
              {principale && (
                <span className="rounded-full bg-vert-clair px-3 py-1 text-xs font-bold text-vert-texte">
                  {principale.nom}
                </span>
              )}
            </div>

            {principale ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="flex text-[#E0A23A]">
                    <IconeMeteo condition={principale.meteo.condition} />
                  </span>
                  <div>
                    <p className="text-6xl font-extrabold leading-none tracking-tight">
                      {Math.round(principale.meteo.temp)}°C
                    </p>
                    <p className="mt-1 text-sm capitalize text-doux">
                      {principale.meteo.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-fond p-3">
                    <p className="text-xs font-semibold text-doux">Humidité</p>
                    <p className="mt-0.5 text-lg font-extrabold">
                      {Math.round(principale.meteo.humidite)} %
                    </p>
                  </div>
                  <div className="rounded-xl bg-fond p-3">
                    <p className="text-xs font-semibold text-doux">Vent</p>
                    <p className="mt-0.5 text-lg font-extrabold">
                      {Math.round(principale.meteo.vent * 3.6)} km/h
                    </p>
                  </div>
                  <div className="rounded-xl bg-fond p-3">
                    <p className="text-xs font-semibold text-doux">Pluie</p>
                    <p className="mt-0.5 text-lg font-extrabold">{principale.meteo.pluie} mm</p>
                  </div>
                </div>

                {previsions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-doux">Les 5 prochains jours</p>
                    <div className="grid grid-cols-5 gap-2">
                      {previsions.slice(0, 5).map((j) => {
                        const proba = Math.round(j.probaPluie <= 1 ? j.probaPluie * 100 : j.probaPluie);
                        const jour = new Date(j.date)
                          .toLocaleDateString("fr-FR", { weekday: "short" })
                          .replace(".", "");
                        return (
                          <div
                            key={String(j.date)}
                            className={`flex flex-col items-center rounded-xl p-2 text-center ${
                              proba >= 60 ? "bg-eau-fond" : "bg-fond"
                            }`}
                          >
                            <span className="text-xs font-semibold capitalize text-doux">
                              {jour}
                            </span>
                            <span className="mt-1 text-base font-extrabold">
                              {Math.round(j.tempMax)}°
                            </span>
                            <span className="text-xs text-doux">{proba} %</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Link
                  href={`/parcelles/${principale.id}`}
                  className="text-sm font-bold text-vert-texte underline"
                >
                  Voir la parcelle
                </Link>
              </>
            ) : (
              <p className="text-[15px] text-doux">
                La météo n'est pas disponible pour le moment. Réessayez dans quelques minutes.
              </p>
            )}
          </section>

          <section className="flex flex-col gap-2.5 rounded-[20px] border border-bordure bg-white p-5">
            <h2 className="text-lg font-bold">Conseils du jour</h2>
            {conseils.length === 0 ? (
              <p className="text-[15px] text-doux">Aucun conseil pour le moment.</p>
            ) : (
              conseils.map((c, i) => {
                const style = STYLES[c.type];
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-xl p-3.5 ${style.fond}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${style.pastille}`}>
                      <Icone chemins={style.chemins} taille={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-doux">{c.parcelle}</p>
                      <p className="text-[15px] font-bold">{c.titre}</p>
                      <p className="mt-0.5 text-[13px] leading-snug">{c.message}</p>
                    </div>
                  </div>
                );
              })
            )}
            <p className="mt-1 text-xs text-doux">
              Conseils indicatifs basés sur la météo. Fiez-vous aussi à votre expérience.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}