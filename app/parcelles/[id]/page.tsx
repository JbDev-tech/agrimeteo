import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMeteoActuelle, getPrevisions } from "@/lib/meteo";
import { construireConseils, sauvegarderConseils } from "@/lib/conseilsParcelle";
import { STADES, indexStade } from "@/lib/stades";
import CarteConseil from "@/components/CarteConseil";

function pourcentage(valeur: number) {
  return Math.round(valeur <= 1 ? valeur * 100 : valeur);
}

function majuscule(texte: string) {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export default async function ParcellePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await exigerUser();
  const { id } = await params;
  const parcelleId = Number(id);

  if (!Number.isInteger(parcelleId)) notFound();

  const parcelle = await prisma.parcelle.findFirst({
    where: { id: parcelleId, userId: user.id },
    include: {
      cycles: {
        where: {
          OR: [{ date_recolte: null }, { date_recolte: { gt: new Date() } }],
        },
        orderBy: { date_plantation: "desc" },
        include: {
          culture: true,
          releves: { orderBy: { date: "desc" }, take: 3 },
        },
      },
    },
  });

  if (!parcelle) notFound();

  const [meteoRes, previsionsRes] = await Promise.allSettled([
    getMeteoActuelle(parcelle.latitude, parcelle.longitude),
    getPrevisions(parcelle.latitude, parcelle.longitude),
  ]);

  const meteo = meteoRes.status === "fulfilled" ? meteoRes.value : null;
  const previsions = previsionsRes.status === "fulfilled" ? previsionsRes.value : [];

  const conseils = meteo ? construireConseils(meteo, parcelle.cycles) : null;

  if (meteo && conseils) {
    try {
      await sauvegarderConseils(parcelle.id, meteo, conseils);
    } catch {}
  }

  const premier = parcelle.cycles[0];
  const stadePremier = premier?.releves[0]?.stade_croissance;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 md:px-10 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/parcelles"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-vert-texte"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Mes parcelles
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{parcelle.nom}</h1>
          <p className="mt-1.5 text-[15px] text-doux">
            {parcelle.latitude.toFixed(2)} ; {parcelle.longitude.toFixed(2)} ·{" "}
            {parcelle.superficie.toLocaleString("fr-FR")} ha
            {premier && ` · ${premier.culture.nom}${stadePremier ? ` en ${stadePremier.toLowerCase()}` : ""}`}
          </p>
        </div>
        <Link
          href={`/parcelles/${parcelle.id}/modifier`}
          className="inline-flex min-h-12 items-center rounded-xl border-2 border-contour px-5 text-[15px] font-bold"
        >
          Modifier la parcelle
        </Link>
      </header>

      <section className="flex flex-wrap items-stretch gap-5">
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Météo maintenant</h2>
          {meteo ? (
            <>
              <div>
                <p className="text-6xl font-extrabold leading-none tracking-tight">
                  {Math.round(meteo.temp)}°C
                </p>
                <p className="mt-1.5 text-[17px] capitalize text-doux">{meteo.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl bg-fond p-3">
                  <p className="text-xs font-semibold text-doux">Humidité</p>
                  <p className="mt-1 text-lg font-bold">{Math.round(meteo.humidite)} %</p>
                </div>
                <div className="rounded-xl bg-fond p-3">
                  <p className="text-xs font-semibold text-doux">Vent</p>
                  <p className="mt-1 text-lg font-bold">{Math.round(meteo.vent * 3.6)} km/h</p>
                </div>
                <div className="rounded-xl bg-fond p-3">
                  <p className="text-xs font-semibold text-doux">Pluie</p>
                  <p className="mt-1 text-lg font-bold">{meteo.pluie} mm</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[15px] text-doux">
              La météo n'est pas disponible pour le moment. Réessayez dans quelques minutes.
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-[1.6_1_440px] flex-col gap-3.5 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Prévisions sur 5 jours</h2>
          {previsions.length === 0 ? (
            <p className="text-[15px] text-doux">Les prévisions ne sont pas disponibles.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {previsions.slice(0, 5).map((j) => {
                const proba = pourcentage(j.probaPluie);
                const pluvieux = proba >= 60;
                const jour = majuscule(
                  new Date(j.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }),
                );
                return (
                  <li
                    key={String(j.date)}
                    className={`flex flex-wrap items-center gap-3 rounded-xl px-3.5 py-2.5 ${
                      pluvieux ? "bg-eau-fond" : "bg-fond"
                    }`}
                  >
                    <span className="w-28 shrink-0 text-sm font-bold">{jour}</span>
                    <span
                      className={`min-w-28 flex-1 text-sm capitalize ${
                        pluvieux ? "font-semibold text-[#174E8C]" : "text-doux"
                      }`}
                    >
                      {j.description}
                      {j.pluie > 0 && `, ${Math.round(j.pluie)} mm`}
                    </span>
                    <span className="w-20 shrink-0 text-[15px] font-bold">
                      {Math.round(j.tempMin)}° / {Math.round(j.tempMax)}°
                    </span>
                    <span className="flex w-28 shrink-0 items-center gap-2 text-[13px] font-bold text-[#174E8C]">
                      <span className="block h-1.5 flex-1 overflow-hidden rounded-[3px] bg-[#D5DEE9]">
                        <span
                          className="block h-1.5 bg-eau"
                          style={{ width: `${proba}%` }}
                        />
                      </span>
                      {proba} %
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[1.2_1_400px] flex-col gap-4 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Conseils du jour</h2>
          {conseils ? (
            conseils.generaux.map((c, i) => <CarteConseil key={i} conseil={c} />)
          ) : (
            <p className="text-[15px] text-doux">
              Les conseils apparaîtront dès que la météo sera disponible.
            </p>
          )}
          <p className="text-xs text-doux">
            Conseils indicatifs basés sur la météo. Fiez-vous aussi à votre expérience et à votre
            technicien agricole.
          </p>
        </div>

        <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
          {parcelle.cycles.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-bordure bg-white p-6">
              <h2 className="text-lg font-bold">Aucune culture en cours</h2>
              <p className="text-[15px] text-doux">
                Ajoutez un cycle de culture pour recevoir des conseils adaptés à votre plante.
              </p>
              <Link
                href="/cycles/ajouter"
                className="inline-flex min-h-11 items-center rounded-xl bg-vert px-5 text-sm font-bold text-white"
              >
                Ajouter un cycle
              </Link>
            </div>
          ) : (
            parcelle.cycles.map((cycle) => {
              const stade = cycle.releves[0]?.stade_croissance;
              const actuel = indexStade(stade);
              const conseilsCycle = conseils?.cycles.find((c) => c.cycleId === cycle.id);

              return (
                <div
                  key={cycle.id}
                  className="flex flex-col gap-4 rounded-2xl border border-bordure bg-white p-6"
                >
                  <div>
                    <h2 className="text-lg font-bold">{cycle.culture.nom} · cycle en cours</h2>
                    <p className="mt-1 text-sm text-doux">
                      Planté le{" "}
                      {cycle.date_plantation.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <ol aria-label="Étapes de croissance" className="flex flex-wrap gap-2">
                    {STADES.map((s, i) => (
                      <li
                        key={s}
                        aria-current={i === actuel ? "step" : undefined}
                        className={`rounded-full px-3 py-1.5 text-[13px] font-bold ${
                          i === actuel
                            ? "bg-vert text-white"
                            : i < actuel
                              ? "bg-vert-clair text-vert-texte"
                              : "bg-[#EEEDE6] text-doux"
                        }`}
                      >
                        {s}
                      </li>
                    ))}
                  </ol>

                  {actuel === -1 && (
                    <p className="text-sm text-doux">
                      Ajoutez un relevé avec le stade de votre culture pour recevoir des conseils
                      plus précis.
                    </p>
                  )}

                  {conseilsCycle && (
                    <div className="flex flex-col gap-3">
                      {conseilsCycle.conseils.map((c, i) => (
                        <CarteConseil key={i} conseil={c} />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 border-t border-bordure pt-4">
                    <h3 className="text-base font-bold">Derniers relevés</h3>
                    <Link
                      href={`/releves/ajouter?cycle=${cycle.id}`}
                      className="inline-flex min-h-11 items-center text-sm font-bold text-vert-texte underline"
                    >
                      Ajouter un relevé
                    </Link>
                  </div>

                  {cycle.releves.length === 0 ? (
                    <p className="text-sm text-doux">Aucun relevé pour ce cycle.</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {cycle.releves.map((r) => (
                        <li key={r.id} className="rounded-xl bg-fond px-3.5 py-3">
                          <p className="text-[13px] font-bold text-doux">
                            {r.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                            {r.stade_croissance && ` · ${r.stade_croissance}`}
                          </p>
                          {r.observation && (
                            <p className="mt-1 text-sm leading-snug">{r.observation}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}