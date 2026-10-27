import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { parcelleAppartient, cultureAppartient } from "@/lib/acces";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const body = await request.json();
    const parcelleId = Number(body.parcelleId);
    const cultureId = Number(body.cultureId);

    if (!body.date_plantation || !parcelleId || !cultureId) {
      return NextResponse.json(
        { error: "Parcelle, culture et date de plantation requises" },
        { status: 400 },
      );
    }

    // La parcelle ET la culture doivent appartenir à l'utilisateur
    const [parcelle, culture] = await Promise.all([
      parcelleAppartient(parcelleId, user.id),
      cultureAppartient(cultureId, user.id),
    ]);
    if (!parcelle || !culture) {
      return NextResponse.json({ error: "Parcelle ou culture introuvable" }, { status: 404 });
    }

    const cycle = await prisma.cycleCulture.create({
      data: {
        date_plantation: new Date(body.date_plantation),
        date_recolte: body.date_recolte ? new Date(body.date_recolte) : null,
        parcelleId,
        cultureId,
      },
    });
    return NextResponse.json(cycle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création du cycle" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const cycles = await prisma.cycleCulture.findMany({
      where: { parcelle: { userId: user.id } },
      include: { parcelle: true, culture: true },
      orderBy: { date_plantation: "desc" },
    });
    return NextResponse.json(cycles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'affichage des cycles" }, { status: 500 });
  }
}