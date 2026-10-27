import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { parcelleAppartient } from "@/lib/acces";
import { validerParcelle } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const parcelle = await parcelleAppartient(Number((await params).id), user.id);
    if (!parcelle) return NextResponse.json({ error: "Parcelle introuvable" }, { status: 404 });
    return NextResponse.json(parcelle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la récupération de la parcelle" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const id = Number((await params).id);
    if (!(await parcelleAppartient(id, user.id))) {
      return NextResponse.json({ error: "Parcelle introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const messageErreur = validerParcelle(body);
    if (messageErreur) {
      return NextResponse.json({ error: messageErreur }, { status: 400 });
    }

    const misAJour = await prisma.parcelle.update({
      where: { id },
      data: {
        nom: String(body.nom).trim(),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        superficie: Number(body.superficie),
      },
    });
    return NextResponse.json(misAJour);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la modification de la parcelle" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const id = Number((await params).id);
    const parcelle = await parcelleAppartient(id, user.id);
    if (!parcelle) return NextResponse.json({ error: "Parcelle introuvable" }, { status: 404 });

    await prisma.$transaction([
      prisma.conseil.deleteMany({ where: { parcelleId: id } }),
      prisma.meteo.deleteMany({ where: { parcelleId: id } }),
      prisma.releve.deleteMany({ where: { cycleCulture: { parcelleId: id } } }),
      prisma.cycleCulture.deleteMany({ where: { parcelleId: id } }),
      prisma.parcelle.delete({ where: { id } }),
    ]);
    return NextResponse.json(parcelle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la parcelle" }, { status: 500 });
  }
}