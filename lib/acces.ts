import { prisma } from "@/lib/prisma";

// Chaque fonction renvoie l'élément seulement s'il appartient à l'utilisateur, sinon null

export function parcelleAppartient(id: number, userId: number) {
  return prisma.parcelle.findFirst({ where: { id, userId } });
}

export function cultureAppartient(id: number, userId: number) {
  return prisma.culture.findFirst({ where: { id, userId } });
}

export function cycleAppartient(id: number, userId: number) {
  return prisma.cycleCulture.findFirst({ where: { id, parcelle: { userId } } });
}

export function releveAppartient(id: number, userId: number) {
  return prisma.releve.findFirst({
    where: { id, cycleCulture: { parcelle: { userId } } },
  });
}