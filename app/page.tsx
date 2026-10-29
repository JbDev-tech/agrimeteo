import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import Apparition from "@/components/Apparition";

export const metadata: Metadata = {
  title: "AgriMétéo : Votre assistant météo et décisionnel agricole",
  description:
    "Anticipez le temps, optimisez vos traitements et prenez soin de vos parcelles. Météo ultra-locale et conseils agronomiques personnalisés sur mobile.",
};

function Icone({ chemins, taille = 22 }: { chemins: string[]; taille?: number }) {
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

const FEUILLE = [
  "M12 21v-9",
  "M12 12c0-4-3-6-7-6 0 4 3 6 7 6z",
  "M12 14c0-3 2-5 6-5 0 3-2 5-6 5z",
];

const METEO = [
  "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5",
];

const GOUTTE = ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"];

const CAHIER = [
  "M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  "M9 4h6v3H9zM9 12h6M9 16h4",
];

const CHECK = ["M20 6L9 17l-5-5"];

const fonctions = [
  {
    titre: "Météo ultra-locale par parcelle",
    texte:
      "Accédez aux prévisions précises à 5 jours pour chaque coin de votre exploitation. Température du sol, risque de gel, pluviométrie exacte et rafales de vent : des données localisées directement sur votre champ.",
    chemins: METEO,
    tag: "Haute Précision",
  },
  {
    titre: "Conseils agronomiques intelligents",
    texte:
      "Sachez exactement quand irriguer, semer, traiter ou fertiliser. Nos recommandations croisent les données météo en temps réel avec le stade de croissance spécifique de vos cultures.",
    chemins: GOUTTE,
    tag: "Prise de décision",
  },
  {
    titre: "Carnet de bord & Historique d'exploitation",
    texte:
      "Conservez la mémoire de vos terres. Notez vos observations, suivez les dates d'intervention et comparez le comportement de vos cultures d'une saison à l'autre.",
    chemins: CAHIER,
    tag: "Traçabilité",
  },
];

const avantages = [
  {
    titre: "Économisez vos intrants",
    description: "Évitez le lessivage des engrais et optimisez chaque passage en fonction des fenêtres météo favorables.",
  },
  {
    titre: "Protégez vos récoltes",
    description: "Soyez alerte des risques de gel, d'excès d'humidité ou de sécheresse avant qu'il ne soit trop tard.",
  },
  {
    titre: "Gagnez un temps précieux",
    description: "Consultez l'état de l'ensemble de vos parcelles en un coup d'œil, directement depuis votre mobile.",
  },
];

const etapes = [
  {
    numero: "01",
    titre: "Localisez votre parcelle",
    texte: "Geolocalisez votre champ directement sur la carte grâce au GPS de votre téléphone ou recherchez votre commune.",
  },
  {
    numero: "02",
    titre: "Renseignez vos cultures",
    texte: "Indiquez la variété plantée (maïs, blé, maraîchage, riz...) et la date de semis ou de plantation.",
  },
  {
    numero: "03",
    titre: "Recevez vos alertes et conseils",
    texte: "Accédez immédiatement aux tableaux de bord météo et recevez des recommandations quotidiennes sur-mesure.",
  },
];

const faqs = [
  {
    q: "AgriMétéo est-il réellement gratuit ?",
    r: "Oui, la création de compte et l'accès aux prévisions fondamentales ainsi qu'aux conseils quotidiens sont 100% gratuits.",
  },
  {
    q: "Comment fonctionne la météo localisée ?",
    r: "Nous utilisons les coordonnées GPS précises de votre parcelle couplées à des modèles météo haute résolution pour vous offrir des données personnalisées au champ près.",
  },
  {
    q: "L'application fonctionne-t-elle sur tous les téléphones ?",
    r: "Absolument. AgriMétéo est conçue pour être très légère et fonctionner parfaitement sur n'importe quel smartphone connecté à Internet.",
  },
];

export default async function AccueilPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-green-700 text-white shadow-md shadow-emerald-600/20 transition-transform group-hover:scale-105 group-hover:-rotate-6">
              <Icone chemins={FEUILLE} taille={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-emerald-950">AgriMétéo</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">L'agronomie connectée</span>
            </div>
          </Link>

          <nav aria-label="Compte" className="flex items-center gap-2 md:gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-50"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-lg"
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/60 via-white to-slate-50 py-16 md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-87.5 w-200 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-5 md:px-10 lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-6 text-left">
              <Apparition delai={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
                  <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                  Nouveau : Prévisions agronomiques personnalisées
                </div>
              </Apparition>

              <Apparition delai={120}>
                <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-slate-900 md:text-6xl">
                  Pilotez vos cultures avec la{" "}
                  <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy">météo exacte</span>{" "}
                  de vos champs.
                </h1>
              </Apparition>

              <Apparition delai={240}>
                <p className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  AgriMétéo associe prévisions ultra-locales et conseils agronomiques pratiques. Anticipez le temps, optimisez vos travaux aux champs et augmentez la rentabilité de vos récoltes.
                </p>
              </Apparition>

              <Apparition delai={360} className="w-full sm:w-auto">
                <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex min-h-13 items-center justify-center rounded-2xl bg-emerald-600 px-8 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl"
                  >
                    Démarrer gratuitement
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex min-h-13 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-7 text-base font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    Accéder à mon espace
                  </Link>
                </div>
              </Apparition>

              <Apparition delai={480} className="w-full max-w-lg">
                <div className="grid w-full grid-cols-3 gap-6 border-t border-slate-200/80 pt-6">
                  <div>
                    <p className="text-2xl font-black text-emerald-700">100%</p>
                    <p className="text-xs font-medium text-slate-500">Gratuit & Facile</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-700">5 Jours</p>
                    <p className="text-xs font-medium text-slate-500">Anticipation Météo</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-700">Sur-mesure</p>
                    <p className="text-xs font-medium text-slate-500">Par type de culture</p>
                  </div>
                </div>
              </Apparition>
            </div>

            <div className="flex w-full max-w-md min-w-0 flex-1 justify-center lg:max-w-none">
              <Apparition delai={300} className="w-full max-w-md">
                <div className="animate-flottement relative w-full rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-md">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Aperçu en direct</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Parcelle active</span>
                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl bg-linear-to-br from-emerald-900 via-slate-900 to-emerald-950 p-6 text-white shadow-inner">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-emerald-600/80 px-3 py-1 text-xs font-bold backdrop-blur-md">
                        🌽 Parcelle Nord — Maïs
                      </span>
                      <span className="text-xs font-medium text-emerald-200">Lomé, Togo</span>
                    </div>

                    <div className="flex items-end justify-between py-2">
                      <div>
                        <p className="text-5xl font-black tracking-tight">31°C</p>
                        <p className="mt-1 text-sm text-emerald-200">Sensation : 33°C — Ensoleillé</p>
                      </div>
                      <span className="animate-tourner inline-block text-amber-300">
                        <Icone chemins={METEO} taille={48} />
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/10 p-3 text-center text-xs text-emerald-100 backdrop-blur-sm">
                      <div>
                        <p className="text-[10px] uppercase text-emerald-300">Humidité</p>
                        <p className="text-sm font-bold">66 %</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-emerald-300">Vent</p>
                        <p className="text-sm font-bold">17 km/h</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-emerald-300">Pluie (24h)</p>
                        <p className="text-sm font-bold">0 mm</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3.5 rounded-2xl border border-amber-200/60 bg-amber-50/80 p-4 text-amber-900">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
                      <Icone chemins={["M12 3l10 18H2z", "M12 10v5M12 18v.5"]} taille={20} />
                    </span>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-amber-950">Conseil d'intervention</p>
                        <span className="text-[11px] font-semibold text-amber-700">Aujourd'hui</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-amber-900/90">
                        Pluies torrentielles prévues sous 24h. <strong className="font-semibold">Reportez l'épandage d'engrais</strong> pour éviter le lessivage.
                      </p>
                    </div>
                  </div>
                </div>
              </Apparition>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-white py-20">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 md:px-10">
            <Apparition className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Conçu pour le terrain</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Un outil simple et complet pour piloter vos champs
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Des fonctionnalités pensées pour répondre concrètement aux défis quotidiens du monde agricole.
              </p>
            </Apparition>

            <div className="grid gap-8 md:grid-cols-3">
              {fonctions.map((f, i) => (
                <Apparition key={f.titre} delai={i * 150} className="h-full">
                  <div className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 transition-all hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                        <Icone chemins={f.chemins} taille={28} />
                      </span>
                      <span className="rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-800">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">{f.titre}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{f.texte}</p>
                  </div>
                </Apparition>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-emerald-950 py-20 text-white">
          <div className="animate-flottement pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-emerald-800/20 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Apparition>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Impact immédiat</span>
                  <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Prenez de meilleures décisions, à chaque étape de la saison.
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-emerald-200/80">
                    L'agriculture moderne exige de la précision. AgriMétéo simplifie la complexité météorologique pour la transformer en décisions claires et rentables.
                  </p>
                </Apparition>

                <div className="mt-8 flex flex-col gap-5">
                  {avantages.map((item, i) => (
                    <Apparition key={item.titre} delai={i * 150}>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                          <Icone chemins={CHECK} taille={16} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{item.titre}</h4>
                          <p className="mt-0.5 text-sm text-emerald-200/70">{item.description}</p>
                        </div>
                      </div>
                    </Apparition>
                  ))}
                </div>
              </div>

              <Apparition delai={200}>
                <div className="rounded-3xl border border-emerald-800/60 bg-emerald-900/40 p-8 backdrop-blur-sm">
                  <h3 className="mb-4 text-xl font-bold text-white">Prêt à moderniser la gestion de vos parcelles ?</h3>
                  <p className="mb-6 text-sm leading-relaxed text-emerald-200/80">
                    Rejoignez les agriculteurs et producteurs qui utilisent AgriMétéo quotidiennement pour optimiser leurs interventions.
                  </p>
                  <Link
                    href="/register"
                    className="block w-full rounded-2xl bg-linear-to-r from-emerald-500 to-green-500 py-4 text-center font-bold text-emerald-950 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110"
                  >
                    Créer un compte gratuitement
                  </Link>
                </div>
              </Apparition>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-20 md:px-10">
          <Apparition className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Simplicité d'utilisation</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Prêt en 3 minutes chrono
            </h2>
            <p className="mt-2 text-slate-600">Aucun équipement complexe à installer dans vos champs.</p>
          </Apparition>

          <div className="grid gap-8 md:grid-cols-3">
            {etapes.map((e, i) => (
              <Apparition key={e.titre} delai={i * 150} className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-emerald-300 hover:shadow-lg">
                  <span className="mb-4 text-4xl font-black text-emerald-600/30">{e.numero}</span>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{e.titre}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{e.texte}</p>
                </div>
              </Apparition>
            ))}
          </div>
        </section>

        <section className="bg-slate-100/70 py-16">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <Apparition>
              <h2 className="mb-10 text-center text-2xl font-extrabold text-slate-900">Questions fréquentes</h2>
            </Apparition>
            <div className="grid gap-6">
              {faqs.map((faq, i) => (
                <Apparition key={faq.q} delai={i * 120}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <h3 className="text-base font-bold text-slate-900">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.r}</p>
                  </div>
                </Apparition>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10">
          <Apparition>
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-700 via-green-700 to-emerald-800 p-8 text-white shadow-2xl md:p-14">
              <div className="animate-flottement pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                  Inscrivez votre première parcelle dès aujourd'hui
                </h2>
                <p className="mt-4 text-base leading-relaxed text-emerald-100">
                  Rejoignez la communauté d'agriculteurs connectés. L'inscription prend moins d'une minute.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="inline-flex min-h-13 items-center rounded-2xl bg-white px-8 text-base font-bold text-emerald-900 shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
                  >
                    Créer un compte gratuit
                  </Link>
                </div>
              </div>
            </div>
          </Apparition>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-left md:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Icone chemins={FEUILLE} taille={18} />
            </div>
            <span className="font-bold text-slate-900">AgriMétéo</span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AgriMétéo. Données météo propulsées par OpenWeather.
          </p>
        </div>
      </footer>
    </div>
  );
}