import Link from "next/link";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SupprimerBouton from "@/components/SupprimerBouton";

export default async function RelevesPage() {
  const user = await exigerUser();

  const releves = await prisma.releve.findMany({
    where: { cycleCulture: { parcelle: { userId: user.id } } },
    orderBy: { date: "desc" },
    take: 100,
    include: { cycleCulture: { include: { culture: true, parcelle: true } } },
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7 px-5 py-6 md:px-10 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mes relevés</h1>
          <p className="mt-1.5 text-[15px] text-doux">
            {releves.length} relevé{releves.length > 1 ? "s" : ""}, du plus récent au plus ancien
          </p>
        </div>
        <Link
          href="/releves/ajouter"
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
          Ajouter un relevé
        </Link>
      </header>

      {releves.length === 0 ? (
        <section className="flex flex-col items-start gap-3 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Aucun relevé pour le moment</h2>
          <p className="text-[15px] text-doux">
            Un relevé note l'état de votre culture à une date donnée. C'est grâce à lui que les
            conseils s'adaptent à son étape de croissance.
          </p>
        </section>
      ) : (
        <ul className="flex flex-col gap-3">
          {releves.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-start gap-4 rounded-2xl border border-bordure bg-white px-6 py-4"
            >
              <div className="min-w-0 flex-[1_1_280px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-base font-bold">
                    {r.date.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  {r.stade_croissance && (
                    <span className="rounded-full bg-vert-clair px-2.5 py-1 text-xs font-bold text-vert-texte">
                      {r.stade_croissance}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-doux">
                  {r.cycleCulture.culture.nom} · {r.cycleCulture.parcelle.nom}
                </p>
                {r.observation && (
                  <p className="mt-2 text-sm leading-relaxed">{r.observation}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/releves/${r.id}/modifier`}
                  className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-contour px-4 text-sm font-bold"
                >
                  Modifier
                </Link>
                <SupprimerBouton
                  url={`/api/releves/${r.id}`}
                  confirmation="Supprimer ce relevé ?"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}