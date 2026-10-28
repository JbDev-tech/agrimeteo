"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TYPES_CULTURE, validerCulture } from "@/lib/validation";

type CultureExistante = { id: number; nom: string; type: string };

const classeChamp =
  "min-h-[52px] w-full rounded-xl border-[1.5px] border-contour bg-white px-4 text-base text-encre focus:border-vert focus:outline-none";

export default function CulturesForm({ culture }: { culture?: CultureExistante }) {
  const router = useRouter();
  const modification = Boolean(culture);

  const [nom, setNom] = useState(culture?.nom ?? "");
  const [type, setType] = useState(
    culture && TYPES_CULTURE.includes(culture.type) ? culture.type : "",
  );
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    const donnees = { nom: nom.trim(), type };
    const probleme = validerCulture(donnees);
    if (probleme) {
      setErreur(probleme);
      return;
    }

    setChargement(true);
    try {
      const res = await fetch(modification ? `/api/cultures/${culture!.id}` : "/api/cultures", {
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

      router.push("/cultures");
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
          href="/cultures"
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
          Mes cultures
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {modification ? "Modifier la culture" : "Ajouter une culture"}
        </h1>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <form
          onSubmit={envoyer}
          noValidate
          className="flex min-w-0 max-w-[620px] flex-[1_1_480px] flex-col gap-5 rounded-2xl border border-bordure bg-white p-6 md:p-7"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nom" className="text-sm font-bold">
              Nom de la culture
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Maïs"
              className={classeChamp}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="type" className="text-sm font-bold">
              Type de culture
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={classeChamp}
            >
              <option value="">Choisir un type</option>
              {TYPES_CULTURE.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-vert px-7 text-base font-bold text-white disabled:opacity-60"
            >
              {chargement ? "Enregistrement..." : "Enregistrer"}
            </button>
            <Link
              href="/cultures"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-[1.5px] border-contour px-6 text-base font-bold"
            >
              Annuler
            </Link>
          </div>
        </form>

        <aside className="flex min-w-0 max-w-[340px] flex-[1_1_260px] flex-col gap-2.5 rounded-2xl border border-soleil-bord bg-soleil-fond p-5">
          <p className="text-[15px] font-extrabold text-soleil-texte">Astuce</p>
          <p className="text-sm leading-relaxed text-[#3D2500]">
            Écrivez le nom comme vous le dites tous les jours : maïs, tomate, manioc, riz.
          </p>
          <p className="text-sm leading-relaxed text-[#3D2500]">
            Une fois la culture ajoutée, créez un cycle pour dire sur quelle parcelle et à quelle
            date vous l'avez plantée.
          </p>
        </aside>
      </div>
    </div>
  );
}