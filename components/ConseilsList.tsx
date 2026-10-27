import type { Conseil, Niveau } from "../lib/conseils";

const STYLES: Record<Niveau, { boite: string; etiquette: string; label: string }> = {
  urgent: {
    boite: "border-red-300 bg-red-50 text-red-900",
    etiquette: "bg-red-600 text-white",
    label: "Urgent",
  },
  attention: {
    boite: "border-amber-300 bg-amber-50 text-amber-900",
    etiquette: "bg-amber-500 text-white",
    label: "Attention",
  },
  info: {
    boite: "border-green-300 bg-green-50 text-green-900",
    etiquette: "bg-green-600 text-white",
    label: "Info",
  },
};

export default function ConseilsList({ conseils = [] }: { conseils?: Conseil[] }) {
  if (conseils.length === 0) {
    return <p className="text-sm text-gray-500">Aucun conseil pour le moment.</p>;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Conseils pour cette parcelle</h2>
      <ul className="space-y-3">
        {conseils.map((conseil) => {
          const style = STYLES[conseil.niveau];
          return (
            <li
              key={conseil.id}
              className={`rounded-lg border p-4 ${style.boite}`}
            >
              <span
                className={`mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${style.etiquette}`}
              >
                {style.label}
              </span>
              <p className="text-sm">{conseil.message}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}