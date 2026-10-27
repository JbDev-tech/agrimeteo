import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getPrevisions } from "@/lib/meteo";
import { getUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ parcelleId: string }> },
) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const { parcelleId } = await params;

    const parcelle = await prisma.parcelle.findFirst({
      where: { id: Number(parcelleId), userId: user.id },
    });
    if (!parcelle) {
      return NextResponse.json({ error: "Parcelle introuvable" }, { status: 404 });
    }

    const previsions = await getPrevisions(parcelle.latitude, parcelle.longitude);
    return NextResponse.json(previsions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}