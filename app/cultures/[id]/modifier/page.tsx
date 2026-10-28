import { notFound } from "next/navigation";
import { exigerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CulturesForm from "@/components/CulturesForm";

export default async function ModifierCulturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await exigerUser();
  const { id } = await params;
  const cultureId = Number(id);

  if (!Number.isInteger(cultureId)) notFound();

  const culture = await prisma.culture.findFirst({
    where: { id: cultureId, userId: user.id },
  });

  if (!culture) notFound();

  return <CulturesForm culture={{ id: culture.id, nom: culture.nom, type: culture.type }} />;
}