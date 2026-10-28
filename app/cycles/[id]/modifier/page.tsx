import { notFound } from "next/navigation";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CycleCulturesForm from "@/components/CycleCulturesForm";

export default async function ModifierCyclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await exigerUser();
  const { id } = await params;
  const cycleId = Number(id);

  if (!Number.isInteger(cycleId)) notFound();

  const cycle = await prisma.cycleCulture.findFirst({
    where: { id: cycleId, parcelle: { userId: user.id } },
  });

  if (!cycle) notFound();

  const [parcelles, cultures] = await Promise.all([
    prisma.parcelle.findMany({
      where: { userId: user.id },
      orderBy: { nom: "asc" },
      select: { id: true, nom: true },
    }),
    prisma.culture.findMany({
      where: { userId: user.id },
      orderBy: { nom: "asc" },
      select: { id: true, nom: true },
    }),
  ]);

  return (
    <CycleCulturesForm
      parcelles={parcelles}
      cultures={cultures}
      cycle={{
        id: cycle.id,
        parcelleId: cycle.parcelleId,
        cultureId: cycle.cultureId,
        date_plantation: cycle.date_plantation.toISOString().slice(0, 10),
        date_recolte: cycle.date_recolte ? cycle.date_recolte.toISOString().slice(0, 10) : "",
      }}
    />
  );
}