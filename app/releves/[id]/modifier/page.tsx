import { notFound } from "next/navigation";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RelevesForm from "@/components/RelevesForm";

export default async function ModifierRelevePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await exigerUser();
  const { id } = await params;
  const releveId = Number(id);

  if (!Number.isInteger(releveId)) notFound();

  const releve = await prisma.releve.findFirst({
    where: { id: releveId, cycleCulture: { parcelle: { userId: user.id } } },
  });

  if (!releve) notFound();

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

  return (
    <RelevesForm
      cycles={options}
      releve={{
        id: releve.id,
        cycleCultureId: releve.cycleCultureId,
        date: releve.date.toISOString().slice(0, 10),
        observation: releve.observation ?? "",
        stade_croissance: releve.stade_croissance ?? "",
      }}
    />
  );
}