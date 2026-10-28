"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validerCycle } from "@/lib/validation";

type Option = { id: number; nom: string };
type CycleExistant = {
  id: number;
  parcelleId: number;
  cultureId: number;
  date_plantation: string;
  date_recolte: string;
};

const classeChamp =
  "min-h-13 w-full rounded-xl border-[1.5px] border-contour bg-white px-4 text-base text-encre focus:border-vert focus:outline-none";

export default function CyclesCulturesForm({
  parcelles,
  cultures,
  cycle,
  dateParDefaut,
}: {
  parcelles: Option[];
  cultures: Option[];
  cycle?: CycleExistant;
  dateParDefaut?: string;
}) {
  const router = useRouter();
  const modification = Boolean(cycle);

  const [parcelleId, setParcelleId] = useState(cycle ? String(cycle.parcelleId) : "");
  const [cultureId, setCultureId] = useState(cycle ? String(cycle.cultureId) : "");
  const [plantation, setPlantation] = useState(cycle?.date_plantation ?? dateParDefaut ?? "");
  const [recolte, setRecolte] = useState(cycle?.date_recolte ?? "");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    const donnees = {
      parcelleId: Number(parcelleId),
      cultureId: Number(cultureId),
      date_plantation: plantation,
      date_recolte: recolte === "" ? null : recolte,
    };

    const probleme = validerCycle(donnees);
    if (probleme) {
      setErreur(probleme);
      return;
    }

    setChargement(true);
    try {
      const res = await fetch(
        modification ? `/api/cycleCultures/${cycle!.id}` : "/api/cycleCultures",
        {
          method: modification ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(donnees),
        },
      );

      if (!res.ok) {
        const corps = await res.json().catch(() => null);
        setErreur(corps?.error ?? "L'enregistrement a échoué. Réessayez.");
        setChargement(false);
        return;
      }

      router.push("/cycles");
      router.refresh();
    } catch {
      setErreur("Problème de connexion. Réessayez.");
      setChargement(false);
    }
  }

  const manque =
    parcelles.length === 0
      ? { texte: "Il faut d'abord ajouter une parcelle.", href: "/parcelles/ajouter", bouton: "Ajouter une parcelle" }
      : cultures.length === 0
        ? { texte: "Il faut d'abord ajouter une culture.", href: "/cultures/ajouter", bouton: "Ajouter une culture" }
        : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-6 md:px-10 md:py-10">
      <header>
        <Link
          href="/cycles"
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
          Mes cycles
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {modification ? "Modifier le cycle" : "Ajouter un cycle"}
        </h1>
      </header>

      {manque ? (
        <section className="flex max-w-155 flex-col items-start gap-3 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">{manque.texte}</h2>
          <p className="text-[15px] text-doux">
            Un cycle relie une culture à une parcelle, il faut donc les deux.
          </p>
          <Link
            href={manque.href}
            className="inline-flex min-h-12 items-center rounded-xl bg-vert px-6 font-bold text-white"
          >
            {manque.bouton}
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
              <label htmlFor="parcelle" className="text-sm font-bold">
                Parcelle
              </label>
              <select
                id="parcelle"
                value={parcelleId}
                onChange={(e) => setParcelleId(e.target.value)}
                className={classeChamp}
              >
                <option value="">Choisir une parcelle</option>
                {parcelles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="culture" className="text-sm font-bold">
                Culture
              </label>
              <select
                id="culture"
                value={cultureId}
                onChange={(e) => setCultureId(e.target.value)}
                className={classeChamp}
              >
                <option value="">Choisir une culture</option>
                {cultures.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="plantation" className="text-sm font-bold">
                Date de plantation
              </label>
              <input
                id="plantation"
                type="date"
                value={plantation}
                onChange={(e) => setPlantation(e.target.value)}
                className={classeChamp}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="recolte" className="text-sm font-bold">
                Date de récolte <span className="font-medium text-doux">(facultatif)</span>
              </label>
              <input
                id="recolte"
                type="date"
                value={recolte}
                onChange={(e) => setRecolte(e.target.value)}
                className={classeChamp}
              />
              <p className="text-[13px] text-doux">
                Laissez vide tant que la culture n'est pas récoltée. Le cycle reste « en cours » et
                reçoit des conseils.
              </p>
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
                href="/cycles"
                className="inline-flex min-h-13 items-center justify-center rounded-xl border-[1.5px] border-contour px-6 text-base font-bold"
              >
                Annuler
              </Link>
            </div>
          </form>

          <aside className="flex min-w-0 max-w-85 flex-[1_1_260px] flex-col gap-2.5 rounded-2xl border border-soleil-bord bg-soleil-fond p-5">
            <p className="text-[15px] font-extrabold text-soleil-texte">Astuce</p>
            <p className="text-sm leading-relaxed text-[#3D2500]">
              Un cycle, c'est une culture sur une parcelle, de la plantation à la récolte.
            </p>
            <p className="text-sm leading-relaxed text-[#3D2500]">
              Ajoutez ensuite des relevés pour noter l'étape de croissance : les conseils
              deviendront plus précis.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}