import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { validerParcelle } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const body = await request.json();
    const messageErreur = validerParcelle(body);
    if (messageErreur) {
      return NextResponse.json({ error: messageErreur }, { status: 400 });
    }

    const parcelle = await prisma.parcelle.create({
      data: {
        nom: String(body.nom).trim(),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        superficie: Number(body.superficie),
        userId: user.id,
      },
    });
    return NextResponse.json({ parcelle }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la parcelle" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const parcelles = await prisma.parcelle.findMany({
      where: { userId: user.id },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(parcelles);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des parcelles" },
      { status: 500 },
    );
  }
}