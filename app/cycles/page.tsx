import Link from "next/link";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SupprimerBouton from "@/components/SupprimerBouton";

function formater(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function CyclesPage() {
  const user = await exigerUser();
  const maintenant = new Date();

  const cycles = await prisma.cycleCulture.findMany({
    where: { parcelle: { userId: user.id } },
    orderBy: { date_plantation: "desc" },
    include: {
      parcelle: true,
      culture: true,
      _count: { select: { releves: true } },
    },
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7 px-5 py-6 md:px-10 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mes cycles</h1>
          <p className="mt-1.5 text-[15px] text-doux">
            {cycles.length} cycle{cycles.length > 1 ? "s" : ""} de culture
          </p>
        </div>
        <Link
          href="/cycles/ajouter"
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
          Ajouter un cycle
        </Link>
      </header>

      {cycles.length === 0 ? (
        <section className="flex flex-col items-start gap-3 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Aucun cycle pour le moment</h2>
          <p className="text-[15px] text-doux">
            Un cycle dit quelle culture pousse sur quelle parcelle. C'est lui qui permet de donner
            des conseils adaptés à votre plante.
          </p>
        </section>
      ) : (
        <ul className="flex flex-col gap-3">
          {cycles.map((c) => {
            const enCours = !c.date_recolte || c.date_recolte > maintenant;
            return (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-bordure bg-white px-6 py-4"
              >
                <div className="min-w-0 flex-[1_1_260px]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-bold">
                      {c.culture.nom} · {c.parcelle.nom}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        enCours ? "bg-vert-clair text-vert-texte" : "bg-[#EEEDE6] text-doux"
                      }`}
                    >
                      {enCours ? "En cours" : "Terminé"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-doux">
                    Planté le {formater(c.date_plantation)}
                    {c.date_recolte && ` · Récolte le ${formater(c.date_recolte)}`}
                  </p>
                  <p className="mt-0.5 text-sm text-doux">
                    {c._count.releves === 0
                      ? "Aucun relevé"
                      : `${c._count.releves} relevé${c._count.releves > 1 ? "s" : ""}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/cycles/${c.id}/modifier`}
                    className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-contour px-4 text-sm font-bold"
                  >
                    Modifier
                  </Link>
                  <SupprimerBouton
                    url={`/api/cycleCultures/${c.id}`}
                    confirmation={`Supprimer ce cycle (${c.culture.nom}, ${c.parcelle.nom}) ? Ses ${c._count.releves} relevé(s) seront aussi supprimés.`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}