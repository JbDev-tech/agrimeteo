"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const FEUILLE = [
  "M12 21v-9",
  "M12 12c0-4-3-6-7-6 0 4 3 6 7 6z",
  "M12 14c0-3 2-5 6-5 0 3-2 5-6 5z",
];

const liens = [
  {
    href: "/dashboard",
    nom: "Tableau de bord",
    court: "Accueil",
    chemins: ["M3 11l9-8 9 8", "M5 10v10h14V10"],
  },
  {
    href: "/parcelles",
    nom: "Parcelles",
    court: "Parcelles",
    chemins: ["M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z", "M9 4v14M15 6v14"],
  },
  {
    href: "/cultures",
    nom: "Cultures",
    court: "Cultures",
    chemins: FEUILLE,
  },
  {
    href: "/cycles",
    nom: "Cycles",
    court: "Cycles",
    chemins: ["M20 11a8 8 0 0 0-14-4M4 13a8 8 0 0 0 14 4", "M5 3v4h4M19 21v-4h-4"],
  },
  {
    href: "/releves",
    nom: "Relevés",
    court: "Relevés",
    chemins: [
      "M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
      "M9 4h6v3H9zM9 12h6M9 16h4",
    ],
  },
];

function Icone({ chemins, taille }: { chemins: string[]; taille: number }) {
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

export default function Sidebar({ nom }: { nom: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function deconnecter() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function actif(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-7 bg-vert-fonce px-4 py-7 text-[#E7F1EA] md:flex">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-vert text-white">
            <Icone chemins={FEUILLE} taille={20} />
          </div>
          <a href="/dashboard" className="text-xl font-extrabold tracking-tight">AgriMétéo</a> 
        </div>

        <nav aria-label="Navigation principale" className="flex flex-col gap-1">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              aria-current={actif(lien.href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-[10px] p-3 text-[15px] ${
                actif(lien.href)
                  ? "bg-vert font-bold text-white"
                  : "font-semibold text-[#BFD6C6] hover:bg-white/10"
              }`}
            >
              <Icone chemins={lien.chemins} taille={20} />
              {lien.nom}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 border-t border-[#2A5240] px-2 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vert-clair font-extrabold text-vert-fonce">
            {nom.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold">{nom}</span>
            <button
              type="button"
              onClick={deconnecter}
              className="text-left text-[13px] text-[#BFD6C6] underline"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-10 flex border-t border-bordure bg-white px-1.5 pb-3.5 pt-1.5 md:hidden"
      >
        {liens.map((lien) => (
          <Link
            key={lien.href}
            href={lien.href}
            aria-current={actif(lien.href) ? "page" : undefined}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${
              actif(lien.href) ? "font-extrabold text-vert-texte" : "font-bold text-doux"
            }`}
          >
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-[14px] ${
                actif(lien.href) ? "bg-vert-clair" : ""
              }`}
            >
              <Icone chemins={lien.chemins} taille={20} />
            </span>
            {lien.court}
          </Link>
        ))}
      </nav>
    </>
  );
}