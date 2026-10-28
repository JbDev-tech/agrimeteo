import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CycleCulturesForm from "@/components/CycleCulturesForm";
export default async function AjouterCyclePage() {
  const user = await exigerUser();

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
      dateParDefaut={new Date().toISOString().slice(0, 10)}
    />
  );
}