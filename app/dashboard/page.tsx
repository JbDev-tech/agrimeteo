import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigerUser } from "@/lib/auth";
import { getMeteoActuelle } from "@/lib/meteo";
import { genererConseils, type ConseilGenere } from "@/lib/conseils";


const couleurs: Record<string, string> = {
  alerte: "border-red-500 bg-red-50",
  arrosage: "border-blue-500 bg-blue-50",
  culture: "border-green-500 bg-green-50",
  info: "border-gray-400 bg-gray-50",
};

export default async function DashboardPage() {
  const user = await exigerUser();

  // Cycle "actif" : pas de date de récolte, ou récolte dans le futur
  const cycleActif = {
    OR: [{ date_recolte: null }, { date_recolte: { gt: new Date() } }],
  };

  const nbParcelles = await prisma.parcelle.count({ where: { userId: user.id } });
  const nbCycles = await prisma.cycleCulture.count({
    where: { parcelle: { userId: user.id }, ...cycleActif },
  });

  // On limite à 5 parcelles pour ne pas faire trop d'appels météo
  const parcelles = await prisma.parcelle.findMany({
    where: { userId: user.id },
    orderBy: { id: "asc" },
    take: 5,
    include: {
      cycles: {
        where: cycleActif,
        orderBy: { date_plantation: "desc" },
        take: 1,
        include: {
          culture: true,
          releves: { orderBy: { date: "desc" }, take: 1 },
        },
      },
    },
  });

  const details = await Promise.all(
    parcelles.map(async (p) => {
      try {
        const meteo = await getMeteoActuelle(p.latitude, p.longitude);
        const cycle = p.cycles[0];
        const conseils = genererConseils(
          meteo,
          cycle?.culture.nom,
          cycle?.releves[0]?.stade_croissance,
        );
        return { parcelle: p, cycle, meteo, conseils };
      } catch {
        return {
            parcelle: p,
            cycle: p.cycles[0],
            meteo: null,
            conseils: [] as ConseilGenere[],
};
      }
    }),
  );

  const nbAlertes = details.reduce(
    (total, d) => total + d.conseils.filter((c) => c.type === "alerte").length,
    0,
  );
  const principale = details[0];

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold">Bonjour {user.nom} 👋</h1>
      <p className="text-gray-600 mb-6">Voici l&apos;état de vos cultures aujourd&apos;hui.</p>

      {/* Chiffres clés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Parcelles</p>
          <p className="text-3xl font-bold">{nbParcelles}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Cultures en cours</p>
          <p className="text-3xl font-bold">{nbCycles}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Alertes du jour</p>
          <p className={`text-3xl font-bold ${nbAlertes > 0 ? "text-red-600" : ""}`}>
            {nbAlertes}
          </p>
        </div>
      </div>

      {nbParcelles === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm text-center">
          <p className="mb-3">Vous n&apos;avez pas encore de parcelle.</p>
          <Link
            href="/parcelles/ajouter"
            className="inline-block rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Ajouter ma première parcelle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Météo de la parcelle principale */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="font-semibold mb-1">Météo</h2>
            <p className="text-sm text-gray-500 mb-3">{principale.parcelle.nom}</p>
            {principale.meteo ? (
              <>
                <p className="text-4xl font-bold">{Math.round(principale.meteo.temp)}°C</p>
                <p className="capitalize">{principale.meteo.description}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Humidité : {principale.meteo.humidite}%
                </p>
                <p className="text-sm text-gray-600">
                  Vent : {Math.round(principale.meteo.vent * 3.6)} km/h
                </p>
              </>
            ) : (
              <p className="text-gray-500">Météo indisponible pour le moment.</p>
            )}
            <Link
              href={`/parcelles/${principale.parcelle.id}`}
              className="mt-3 inline-block text-sm text-green-700 underline"
            >
              Voir la parcelle
            </Link>
          </div>

          {/* Conseils du jour */}
          <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow-sm">
            <h2 className="font-semibold mb-3">Conseils du jour</h2>
            <div className="space-y-3">
              {details.flatMap((d) =>
                d.conseils.map((c, i) => (
                  <div
                    key={`${d.parcelle.id}-${i}`}
                    className={`border-l-4 rounded p-3 ${couleurs[c.type]}`}
                  >
                    <p className="text-xs text-gray-500">{d.parcelle.nom}</p>
                    <p className="font-semibold">{c.titre}</p>
                    <p className="text-sm">{c.message}</p>
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Raccourcis */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/parcelles/ajouter" className="rounded-lg bg-green-600 px-4 py-2 text-white">
          + Ajouter une parcelle
        </Link>
        <Link href="/releves/ajouter" className="rounded-lg border border-green-600 px-4 py-2 text-green-700">
          + Ajouter un relevé
        </Link>
      </div>
    </div>
  );
}