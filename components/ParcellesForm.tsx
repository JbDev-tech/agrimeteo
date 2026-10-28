"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TYPES_CULTURE, validerCulture, validerParcelle } from "@/lib/validation";

type Resultat = { label: string; lat: number; lon: number };
type Position = { label: string; lat: number; lon: number };
type ParcelleExistante = {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
  superficie: number;
};
type OptionCulture = { id: number; nom: string };

const classeChamp =
  "min-h-13 w-full rounded-xl border-[1.5px] border-contour bg-white px-4 text-base text-encre focus:border-vert focus:outline-none";

function formater(n: number) {
  return n.toFixed(4).replace(".", ",");
}

export default function ParcellesForm({
  parcelle,
  cultures = [],
  dateParDefaut = "",
}: {
  parcelle?: ParcelleExistante;
  cultures?: OptionCulture[];
  dateParDefaut?: string;
}) {
  const router = useRouter();
  const modification = Boolean(parcelle);

  const [nom, setNom] = useState(parcelle?.nom ?? "");
  const [superficie, setSuperficie] = useState(
    parcelle ? String(parcelle.superficie).replace(".", ",") : "",
  );
  const [lieu, setLieu] = useState("");
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [position, setPosition] = useState<Position | null>(
    parcelle
      ? { label: "Position enregistrée", lat: parcelle.latitude, lon: parcelle.longitude }
      : null,
  );
  const [messageLieu, setMessageLieu] = useState("");
  const [recherche, setRecherche] = useState(false);
  const [gps, setGps] = useState(false);

  const [choixCulture, setChoixCulture] = useState("");
  const [nomCulture, setNomCulture] = useState("");
  const [typeCulture, setTypeCulture] = useState("");
  const [datePlantation, setDatePlantation] = useState(dateParDefaut);

  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  function utiliserPosition() {
    setMessageLieu("");
    if (!navigator.geolocation) {
      setMessageLieu("Votre appareil ne permet pas la localisation. Cherchez votre village.");
      return;
    }
    setGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          label: "Ma position actuelle",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setResultats([]);
        setGps(false);
      },
      () => {
        setMessageLieu(
          "Impossible d'obtenir votre position. Autorisez la localisation ou cherchez votre village.",
        );
        setGps(false);
      },
      { timeout: 10000 },
    );
  }

  async function chercher() {
    setMessageLieu("");
    setResultats([]);
    if (lieu.trim().length < 2) {
      setMessageLieu("Écrivez au moins 2 lettres.");
      return;
    }
    setRecherche(true);
    try {
      const res = await fetch(`/api/geocodage?q=${encodeURIComponent(lieu.trim())}`);
      if (!res.ok) {
        setMessageLieu("La recherche a échoué. Réessayez.");
        setRecherche(false);
        return;
      }
      const data: Resultat[] = await res.json();
      if (data.length === 0) {
        setMessageLieu("Aucun résultat. Essayez la ville la plus proche.");
      }
      setResultats(data);
    } catch {
      setMessageLieu("Problème de connexion. Réessayez.");
    }
    setRecherche(false);
  }

  function choisir(r: Resultat) {
    setPosition({ label: r.label, lat: r.lat, lon: r.lon });
    setResultats([]);
    setMessageLieu("");
  }

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    if (!position) {
      setErreur("Choisissez l'emplacement de la parcelle.");
      return;
    }

    const surface = superficie.trim() === "" ? NaN : Number(superficie.replace(",", "."));
    if (Number.isNaN(surface)) {
      setErreur("Entrez une superficie valide, par exemple 2,5.");
      return;
    }

    const donnees = {
      nom: nom.trim(),
      latitude: position.lat,
      longitude: position.lon,
      superficie: surface,
    };

    const probleme = validerParcelle(donnees);
    if (probleme) {
      setErreur(probleme);
      return;
    }

    let culture: Record<string, unknown> | undefined;

    if (!modification && choixCulture !== "") {
      if (datePlantation === "" || Number.isNaN(new Date(datePlantation).getTime())) {
        setErreur("Entrez la date de plantation.");
        return;
      }

      if (choixCulture === "nouvelle") {
        const problemeCulture = validerCulture({ nom: nomCulture.trim(), type: typeCulture });
        if (problemeCulture) {
          setErreur(problemeCulture);
          return;
        }
        culture = {
          nom: nomCulture.trim(),
          type: typeCulture,
          date_plantation: datePlantation,
        };
      } else {
        culture = { cultureId: Number(choixCulture), date_plantation: datePlantation };
      }
    }

    setChargement(true);
    try {
      const res = await fetch(modification ? `/api/parcelles/${parcelle!.id}` : "/api/parcelles", {
        method: modification ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(culture ? { ...donnees, culture } : donnees),
      });

      if (!res.ok) {
        const corps = await res.json().catch(() => null);
        setErreur(corps?.error ?? corps?.message ?? "L'enregistrement a échoué. Réessayez.");
        setChargement(false);
        return;
      }

      router.push("/parcelles");
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
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {modification ? "Modifier la parcelle" : "Ajouter une parcelle"}
        </h1>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <form
          onSubmit={envoyer}
          noValidate
          className="flex min-w-0 max-w-155 flex-[1_1_480px] flex-col gap-5 rounded-2xl border border-bordure bg-white p-6 md:p-7"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nom" className="text-sm font-bold">
              Nom de la parcelle
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Champ de maïs"
              className={classeChamp}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="superficie" className="text-sm font-bold">
              Superficie (en hectares)
            </label>
            <input
              id="superficie"
              type="text"
              inputMode="decimal"
              value={superficie}
              onChange={(e) => setSuperficie(e.target.value)}
              placeholder="2,5"
              className={classeChamp}
            />
            <p className="text-[13px] text-doux">
              1 hectare = un carré d'environ 100 m de côté.
            </p>
          </div>

          <fieldset className="flex min-w-0 flex-col gap-4 rounded-[14px] border-[1.5px] border-bordure p-5">
            <legend className="px-2 text-sm font-bold">Où se trouve la parcelle ?</legend>

            <button
              type="button"
              onClick={utiliserPosition}
              disabled={gps}
              className="flex min-h-13 items-center justify-center gap-2.5 rounded-xl border-2 border-vert bg-white text-base font-bold text-vert-texte disabled:opacity-60"
            >
              <svg
                width="20"
                height="20"
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
              {gps ? "Recherche de votre position..." : "Utiliser ma position"}
            </button>

            <p className="text-center text-[13px] font-semibold text-doux">ou</p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lieu" className="text-sm font-bold">
                Chercher un village ou une ville
              </label>
              <div className="flex gap-2">
                <input
                  id="lieu"
                  type="text"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      chercher();
                    }
                  }}
                  placeholder="Kévé"
                  className={`${classeChamp} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={chercher}
                  disabled={recherche}
                  className="min-h-13 shrink-0 rounded-xl bg-encre px-5 text-[15px] font-bold text-white disabled:opacity-60"
                >
                  {recherche ? "..." : "Chercher"}
                </button>
              </div>
            </div>

            {messageLieu && <p className="text-sm text-alerte">{messageLieu}</p>}

            {resultats.length > 0 && (
              <ul className="overflow-hidden rounded-xl border-[1.5px] border-bordure">
                {resultats.map((r, i) => (
                  <li
                    key={`${r.lat}-${r.lon}-${i}`}
                    className="border-b border-bordure last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => choisir(r)}
                      className="block min-h-12 w-full bg-white px-4 text-left text-[15px] hover:bg-vert-clair"
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {position && (
              <div className="flex items-center gap-3 rounded-xl bg-vert-clair px-4 py-3.5 text-vert-texte">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l3 3 5-6" />
                </svg>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold">{position.label}</p>
                  <p className="text-[13px]">
                    Position enregistrée ({formater(position.lat)} ; {formater(position.lon)})
                  </p>
                </div>
              </div>
            )}
          </fieldset>

          {!modification && (
            <fieldset className="flex min-w-0 flex-col gap-4 rounded-[14px] border-[1.5px] border-bordure p-5">
              <legend className="px-2 text-sm font-bold">
                Qu'est-ce qui pousse sur cette parcelle ?{" "}
                <span className="font-medium text-doux">(facultatif)</span>
              </legend>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="choix-culture" className="text-sm font-bold">
                  Culture
                </label>
                <select
                  id="choix-culture"
                  value={choixCulture}
                  onChange={(e) => setChoixCulture(e.target.value)}
                  className={classeChamp}
                >
                  <option value="">Rien pour le moment</option>
                  {cultures.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                  <option value="nouvelle">+ Une autre culture</option>
                </select>
              </div>

              {choixCulture === "nouvelle" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nom-culture" className="text-sm font-bold">
                      Nom de la culture
                    </label>
                    <input
                      id="nom-culture"
                      type="text"
                      value={nomCulture}
                      onChange={(e) => setNomCulture(e.target.value)}
                      placeholder="Maïs"
                      className={classeChamp}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="type-culture" className="text-sm font-bold">
                      Type de culture
                    </label>
                    <select
                      id="type-culture"
                      value={typeCulture}
                      onChange={(e) => setTypeCulture(e.target.value)}
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
                </>
              )}

              {choixCulture !== "" && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="date-plantation" className="text-sm font-bold">
                    Date de plantation
                  </label>
                  <input
                    id="date-plantation"
                    type="date"
                    value={datePlantation}
                    onChange={(e) => setDatePlantation(e.target.value)}
                    className={classeChamp}
                  />
                </div>
              )}
            </fieldset>
          )}

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
              href="/parcelles"
              className="inline-flex min-h-13 items-center justify-center rounded-xl border-[1.5px] border-contour px-6 text-base font-bold"
            >
              Annuler
            </Link>
          </div>
        </form>

        <aside className="flex min-w-0 max-w-85 flex-[1_1_260px] flex-col gap-2.5 rounded-2xl border border-soleil-bord bg-soleil-fond p-5">
          <p className="text-[15px] font-extrabold text-soleil-texte">Astuce</p>
          <p className="text-sm leading-relaxed text-[#3D2500]">
            Pour une position précise, faites cette étape depuis votre champ, avec votre
            téléphone, et touchez « Utiliser ma position ».
          </p>
          <p className="text-sm leading-relaxed text-[#3D2500]">
            Si votre village n'apparaît pas, choisissez la ville la plus proche : la météo sera
            très proche de celle de votre champ.
          </p>
        </aside>
      </div>
    </div>
  );
}