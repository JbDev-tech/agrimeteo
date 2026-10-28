import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-4 px-5 py-10">
      <p className="text-sm font-bold text-vert-texte">Erreur 404</p>
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Page introuvable</h1>
      <p className="text-[15px] text-doux">
        Cette page n'existe pas, ou elle ne vous appartient pas. Retournez à vos parcelles.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="inline-flex min-h-12 items-center rounded-xl bg-vert px-6 font-bold text-white"
        >
          Tableau de bord
        </Link>
        <Link
          href="/parcelles"
          className="inline-flex min-h-12 items-center rounded-xl border-[1.5px] border-contour px-6 font-bold"
        >
          Mes parcelles
        </Link>
      </div>
    </div>
  );
}