import { notFound } from "next/navigation";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ParcellesForm from "@/components/ParcellesForm";

export default async function ModifierParcellePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await exigerUser();
  const { id } = await params;
  const parcelleId = Number(id);

  if (!Number.isInteger(parcelleId)) notFound();

  const parcelle = await prisma.parcelle.findFirst({
    where: { id: parcelleId, userId: user.id },
  });

  if (!parcelle) notFound();

  return (
    <ParcellesForm
      parcelle={{
        id: parcelle.id,
        nom: parcelle.nom,
        latitude: parcelle.latitude,
        longitude: parcelle.longitude,
        superficie: parcelle.superficie,
      }}
    />
  );
}