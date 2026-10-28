import Link from "next/link";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SupprimerBouton from "@/components/SupprimerBouton";

export default async function CulturesPage() {
  const user = await exigerUser();

  const cultures = await prisma.culture.findMany({
    where: { userId: user.id },
    orderBy: { nom: "asc" },
    include: { _count: { select: { cycles: true } } },
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7 px-5 py-6 md:px-10 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mes cultures</h1>
          <p className="mt-1.5 text-[15px] text-doux">
            {cultures.length} culture{cultures.length > 1 ? "s" : ""} enregistrée
            {cultures.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/cultures/ajouter"
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
          Ajouter une culture
        </Link>
      </header>

      {cultures.length === 0 ? (
        <section className="flex flex-col items-start gap-3 rounded-2xl border border-bordure bg-white p-6">
          <h2 className="text-lg font-bold">Aucune culture pour le moment</h2>
          <p className="text-[15px] text-doux">
            Ajoutez les plantes que vous cultivez (maïs, tomate, manioc...) pour pouvoir créer des
            cycles et recevoir des conseils.
          </p>
        </section>
      ) : (
        <ul className="flex flex-col gap-3">
          {cultures.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-bordure bg-white px-6 py-4"
            >
              <div className="min-w-0 flex-[1_1_220px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg font-bold">{c.nom}</h2>
                  <span className="rounded-full bg-vert-clair px-2.5 py-1 text-xs font-bold text-vert-texte">
                    {c.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-doux">
                  {c._count.cycles === 0
                    ? "Aucun cycle"
                    : `${c._count.cycles} cycle${c._count.cycles > 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/cultures/${c.id}/modifier`}
                  className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-contour px-4 text-sm font-bold"
                >
                  Modifier
                </Link>
                <SupprimerBouton
                  url={`/api/cultures/${c.id}`}
                  confirmation={`Supprimer la culture « ${c.nom} » ?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}