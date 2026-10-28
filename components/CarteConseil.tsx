import type { ConseilGenere } from "@/lib/conseils";

const STYLES: Record<ConseilGenere["type"], { fond: string; pastille: string; chemins: string[] }> = {
  alerte: {
    fond: "bg-alerte-fond",
    pastille: "bg-alerte",
    chemins: ["M12 3l10 18H2z", "M12 10v5M12 18v.5"],
  },
  arrosage: {
    fond: "bg-eau-fond",
    pastille: "bg-eau",
    chemins: ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"],
  },
  culture: {
    fond: "bg-vert-clair",
    pastille: "bg-vert",
    chemins: ["M12 21v-9", "M12 12c0-4-3-6-7-6 0 4 3 6 7 6z", "M12 14c0-3 2-5 6-5 0 3-2 5-6 5z"],
  },
  info: {
    fond: "bg-[#EEEDE3]",
    pastille: "bg-doux",
    chemins: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 11v5M12 8v.5"],
  },
};

export default function CarteConseil({
  conseil,
  etiquette,
}: {
  conseil: ConseilGenere;
  etiquette?: string;
}) {
  const style = STYLES[conseil.type];

  return (
    <div className={`flex items-start gap-3.5 rounded-[14px] p-4 ${style.fond}`}>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${style.pastille}`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {style.chemins.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        {etiquette && <p className="text-xs font-semibold text-doux">{etiquette}</p>}
        <p className="text-base font-bold">{conseil.titre}</p>
        <p className="mt-1 text-sm leading-relaxed">{conseil.message}</p>
      </div>
    </div>
  );
}