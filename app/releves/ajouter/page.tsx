import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RelevesForm from "@/components/RelevesForm";

export default async function AjouterRelevePage({
  searchParams,
}: {
  searchParams: Promise<{ cycle?: string }>;
}) {
  const user = await exigerUser();
  const { cycle } = await searchParams;
  const maintenant = new Date();

  const cycles = await prisma.cycleCulture.findMany({
    where: { parcelle: { userId: user.id } },
    orderBy: { date_plantation: "desc" },
    include: { culture: true, parcelle: true },
  });

  const options = cycles.map((c) => ({
    id: c.id,
    label: `${c.culture.nom} · ${c.parcelle.nom}${
      c.date_recolte && c.date_recolte <= maintenant ? " (terminé)" : ""
    }`,
  }));

  const preselection = options.some((o) => String(o.id) === cycle) ? cycle : undefined;

  return (
    <RelevesForm
      cycles={options}
      cycleParDefaut={preselection}
      dateParDefaut={maintenant.toISOString().slice(0, 10)}
    />
  );
}