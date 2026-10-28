import Link from "next/link";

const FEUILLE = [
  "M12 21v-9",
  "M12 12c0-4-3-6-7-6 0 4 3 6 7 6z",
  "M12 14c0-3 2-5 6-5 0 3-2 5-6 5z",
];

const points = [
  {
    texte: "La météo de chacune de vos parcelles",
    chemins: [
      "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      "M12 2v2M12 20v2M2 12h2M20 12h2",
    ],
  },
  {
    texte: "Des conseils adaptés à votre culture",
    chemins: ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"],
  },
  {
    texte: "L'historique de vos relevés au même endroit",
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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap">
      <section className="hidden min-w-0 flex-[1_1_480px] flex-col justify-between gap-10 bg-vert-fonce p-16 text-[#E7F1EA] lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vert text-white">
            <Icone chemins={FEUILLE} taille={22} />
          </span>
          <span className="text-[22px] font-extrabold tracking-tight">AgriMétéo</span>
        </Link>

        <div className="flex flex-col gap-8">
          <h1 className="max-w-md text-5xl font-extrabold leading-tight tracking-tight text-white">
            Suivez vos cultures, anticipez la météo.
          </h1>
          <ul className="flex flex-col gap-4">
            {points.map((p) => (
              <li key={p.texte} className="flex items-center gap-3.5 text-[17px]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vert text-white">
                  <Icone chemins={p.chemins} taille={18} />
                </span>
                {p.texte}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-[#BFD6C6]">Gratuit. Fonctionne sur téléphone.</p>
      </section>

      <section className="flex min-w-0 flex-[1_1_480px] flex-col items-center justify-center gap-8 px-5 py-10 md:p-16">
        <Link href="/" className="flex items-center gap-2.5 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vert text-white">
            <Icone chemins={FEUILLE} taille={22} />
          </span>
          <span className="text-[22px] font-extrabold tracking-tight">AgriMétéo</span>
        </Link>
        {children}
      </section>
    </div>
  );
}