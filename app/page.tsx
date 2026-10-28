import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

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

// Icônes personnalisées
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

const TRACTEUR = [
  "M3 17h18",
  "M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  "M17 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "M9 11V6h6l3 5",
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
      {/* 🟢 BARRE SUPÉRIEURE / DÉCORATION */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400" />

      {/* 🟢 EN-TÊTE DE NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-emerald-100">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Icone chemins={FEUILLE} taille={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-emerald-950">AgriMétéo</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">L'agronomie connectée</span>
            </div>
          </Link>

          <nav aria-label="Compte" className="flex items-center gap-2 md:gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-lg transition-all"
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* 🟢 SECTION HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 py-16 md:py-24">
          {/* Formes décoratives d'arrière-plan */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-200/30 blur-3xl rounded-full -z-10 pointer-events-none" />

          <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center gap-12 px-5 md:px-10">
            {/* Texte & Appel à l'action */}
            <div className="flex min-w-0 flex-1 flex-col items-start gap-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
                <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                Nouveau : Prévisions agronomiques personnalisées
              </div>

              <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-slate-900 md:text-6xl">
                Pilotez vos cultures avec la <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy">météo exacte</span> de vos champs.
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                AgriMétéo associe prévisions ultra-locales et conseils agronomiques pratiques. Anticipez le temps, optimisez vos travaux aux champs et augmentez la rentabilité de vos récoltes.
              </p>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 pt-2">
                <Link
                  href="/register"
                  className="inline-flex min-h-13 items-center justify-center rounded-2xl bg-emerald-600 px-8 text-base font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Démarrer gratuitement
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-13 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-7 text-base font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Accéder à mon espace
                </Link>
              </div>

              {/* Indicateurs de confiance */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 w-full max-w-lg">
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
            </div>

            {/* DÉMO / CARTE DE SIMULATION VISUELLE */}
            <div className="flex min-w-0 flex-1 justify-center w-full max-w-md lg:max-w-none">
              <div className="relative w-full max-w-md rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Aperçu en direct</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Parcelle active</span>
                </div>

                {/* Carte Météo Principale */}
                <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 p-6 text-white shadow-inner">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-emerald-600/80 backdrop-blur-md px-3 py-1 text-xs font-bold">
                      🌽 Parcelle Nord — Maïs
                    </span>
                    <span className="text-xs text-emerald-200 font-medium">Lomé, Togo</span>
                  </div>

                  <div className="flex items-end justify-between py-2">
                    <div>
                      <p className="text-5xl font-black tracking-tight">31°C</p>
                      <p className="text-sm text-emerald-200 mt-1">Sensation : 33°C — Ensoleillé</p>
                    </div>
                    <div className="text-emerald-400">
                      <Icone chemins={METEO} taille={48} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/10 p-3 text-center text-xs text-emerald-100 backdrop-blur-sm">
                    <div>
                      <p className="text-[10px] text-emerald-300 uppercase">Humidité</p>
                      <p className="font-bold text-sm">66 %</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300 uppercase">Vent</p>
                      <p className="font-bold text-sm">17 km/h</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300 uppercase">Pluie (24h)</p>
                      <p className="font-bold text-sm">0 mm</p>
                    </div>
                  </div>
                </div>

                {/* Carte d'Alerte & Conseil */}
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
            </div>
          </div>
        </section>

        {/* 🟢 SECTION FONCTIONNALITÉS */}
        <section className="bg-white py-20 border-y border-slate-100">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 md:px-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Conçu pour le terrain</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Un outil simple et complet pour piloter vos champs
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Des fonctionnalités pensées pour répondre concrètement aux défis quotidiens du monde agricole.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {fonctions.map((f) => (
                <div
                  key={f.titre}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 hover:bg-white hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                        <Icone chemins={f.chemins} taille={28} />
                      </span>
                      <span className="rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-800">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{f.titre}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{f.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🟢 SECTION AVANTAGES AGRONOMIQUS */}
        <section className="bg-emerald-950 py-20 text-white relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Impact immédiat</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Prenez de meilleures décisions, à chaque étape de la saison.
                </h2>
                <p className="mt-4 text-emerald-200/80 text-base leading-relaxed">
                  L'agriculture moderne exige de la précision. AgriMétéo simplifie la complexité météorologique pour la transformer en décisions claires et rentables.
                </p>

                <div className="mt-8 flex flex-col gap-5">
                  {avantages.map((item) => (
                    <div key={item.titre} className="flex gap-4 items-start">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 mt-1">
                        <Icone chemins={CHECK} taille={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">{item.titre}</h4>
                        <p className="text-sm text-emerald-200/70 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-800/60 bg-emerald-900/40 p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">Prêt à moderniser la gestion de vos parcelles ?</h3>
                <p className="text-sm text-emerald-200/80 mb-6 leading-relaxed">
                  Rejoignez les agriculteurs et producteurs qui utilisent AgriMétéo quotidiennement pour optimiser leurs interventions.
                </p>
                <Link
                  href="/register"
                  className="block w-full text-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-4 font-bold text-emerald-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
                >
                  Créer un compte gratuitement
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 🟢 SECTION ÉTAPES */}
        <section className="mx-auto w-full max-w-7xl px-5 py-20 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Simplicité d'utilisation</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Prêt en 3 minutes chrono
            </h2>
            <p className="mt-2 text-slate-600">Aucun équipement complexe à installer dans vos champs.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {etapes.map((e) => (
              <div key={e.titre} className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <span className="text-4xl font-black text-emerald-600/30 mb-4">{e.numero}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{e.titre}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{e.texte}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🟢 SECTION FAQ */}
        <section className="bg-slate-100/70 py-16">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <h2 className="text-2xl font-extrabold text-center text-slate-900 mb-10">Questions fréquentes</h2>
            <div className="grid gap-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-base">{faq.q}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.r}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🟢 BANNIÈRE D'APPEL À L'ACTION FINAL */}
        <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 p-8 text-white shadow-2xl md:p-14">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Inscrivez votre première parcelle dès aujourd'hui
              </h2>
              <p className="mt-4 text-emerald-100 text-base leading-relaxed">
                Rejoignez la communauté d'agriculteurs connectés. L'inscription prend moins d'une minute.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex min-h-13 items-center rounded-2xl bg-white px-8 text-base font-bold text-emerald-900 shadow-md hover:bg-emerald-50 transition-all"
                >
                  Créer un compte gratuit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 🟢 PIED DE PAGE */}
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