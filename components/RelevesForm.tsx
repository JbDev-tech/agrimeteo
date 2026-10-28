"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STADES } from "@/lib/stades";
import { validerReleve } from "@/lib/validation";

type OptionCycle = { id: number; label: string };
type ReleveExistant = {
  id: number;
  cycleCultureId: number;
  date: string;
  observation: string;
  stade_croissance: string;
};

const classeChamp =
  "min-h-13 w-full rounded-xl border-[1.5px] border-contour bg-white px-4 text-base text-encre focus:border-vert focus:outline-none";

export default function RelevesForm({
  cycles,
  releve,
  cycleParDefaut,
  dateParDefaut,
}: {
  cycles: OptionCycle[];
  releve?: ReleveExistant;
  cycleParDefaut?: string;
  dateParDefaut?: string;
}) {
  const router = useRouter();
  const modification = Boolean(releve);

  const [cycleId, setCycleId] = useState(
    releve ? String(releve.cycleCultureId) : (cycleParDefaut ?? ""),
  );
  const [date, setDate] = useState(releve?.date ?? dateParDefaut ?? "");
  const [stade, setStade] = useState(
    releve && STADES.includes(releve.stade_croissance) ? releve.stade_croissance : "",
  );
  const [observation, setObservation] = useState(releve?.observation ?? "");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    const donnees = {
      cycleCultureId: Number(cycleId),
      date,
      observation: observation.trim(),
      stade_croissance: stade,
    };

    const probleme = validerReleve(donnees);
    if (probleme) {
      setErreur(probleme);
      return;
    }

    setChargement(true);
    try {
      const res = await fetch(modification ? `/api/releves/${releve!.id}` : "/api/releves", {
        method: modification ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      });

      if (!res.ok) {
        const corps = await res.json().catch(() => null);
        setErreur(corps?.error ?? "L'enregistrement a échoué. Réessayez.");
        setChargement(false);
        return;
      }

      router.push("/releves");
      router.refresh();
    } catch {
      setErreur("Problème de connexion. Réessayez.");
      setChargement(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-6 md:px-10 md:py-10">
      <header>
        <Link
          href="/releves"
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
          Mes relevés
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {modification ? "Modifier le relevé" : "Ajouter un relevé"}
        </h1>
      </header>

      {cycles.length === 0 ? (
        <section className="flex max-w-155 flex-col items-start gap-3 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Il faut d'abord ajouter un cycle</h2>
          <p className="text-[15px] text-doux">
            Un relevé note l'état d'une culture sur une parcelle. Ajoutez d'abord la culture et sa
            date de plantation.
          </p>
          <Link
            href="/cycles/ajouter"
            className="inline-flex min-h-12 items-center rounded-xl bg-vert px-6 font-bold text-white"
          >
            Ajouter un cycle
          </Link>
        </section>
      ) : (
        <div className="flex flex-wrap items-start gap-6">
          <form
            onSubmit={envoyer}
            noValidate
            className="flex min-w-0 max-w-155 flex-[1_1_480px] flex-col gap-5 rounded-2xl border border-bordure bg-white p-6 md:p-7"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cycle" className="text-sm font-bold">
                Culture et parcelle
              </label>
              <select
                id="cycle"
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                className={classeChamp}
              >
                <option value="">Choisir</option>
                {cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-sm font-bold">
                Date du relevé
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={classeChamp}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="stade" className="text-sm font-bold">
                Étape de croissance
              </label>
              <select
                id="stade"
                value={stade}
                onChange={(e) => setStade(e.target.value)}
                className={classeChamp}
              >
                <option value="">Choisir une étape</option>
                {STADES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-[13px] text-doux">
                C'est cette étape qui permet de donner des conseils adaptés à votre culture.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="observation" className="text-sm font-bold">
                Ce que vous avez observé
              </label>
              <textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={4}
                placeholder="Les premières fleurs sont apparues, plants en bonne santé."
                className="min-h-32 w-full rounded-xl border-[1.5px] border-contour bg-white px-4 py-3 text-base text-encre focus:border-vert focus:outline-none"
              />
            </div>

            {erreur && (
              <p
                role="alert"
                className="rounded-xl bg-alerte-fond px-4 py-3 text-sm font-semibold text-alerte"
              >
                {erreur}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={chargement}
                className="inline-flex min-h-13 items-center justify-center rounded-xl bg-vert px-7 text-base font-bold text-white disabled:opacity-60"
              >
                {chargement ? "Enregistrement..." : "Enregistrer"}
              </button>
              <Link
                href="/releves"
                className="inline-flex min-h-13 items-center justify-center rounded-xl border-[1.5px] border-contour px-6 text-base font-bold"
              >
                Annuler
              </Link>
            </div>
          </form>

          <aside className="flex min-w-0 max-w-85 flex-[1_1_260px] flex-col gap-2.5 rounded-2xl border border-soleil-bord bg-soleil-fond p-5">
            <p className="text-[15px] font-extrabold text-soleil-texte">Astuce</p>
            <p className="text-sm leading-relaxed text-[#3D2500]">
              Faites un relevé toutes les une à deux semaines, ou quand vous voyez un changement.
            </p>
            <p className="text-sm leading-relaxed text-[#3D2500]">
              Notez ce que vous voyez : feuilles jaunies, fleurs, insectes, état du sol.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}