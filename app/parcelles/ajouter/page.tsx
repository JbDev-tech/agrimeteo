import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ParcellesForm from "@/components/ParcellesForm";

export default async function AjouterParcellePage() {
  const user = await exigerUser();

  const cultures = await prisma.culture.findMany({
    where: { userId: user.id },
    orderBy: { nom: "asc" },
    select: { id: true, nom: true },
  });

  return (
    <ParcellesForm
      cultures={cultures}
      dateParDefaut={new Date().toISOString().slice(0, 10)}
    />
  );
}