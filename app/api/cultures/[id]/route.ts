import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { cultureAppartient } from "@/lib/acces";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const culture = await cultureAppartient(Number((await params).id), user.id);
    if (!culture) return NextResponse.json({ error: "Culture introuvable" }, { status: 404 });
    return NextResponse.json(culture);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'affichage de la culture" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const id = Number((await params).id);
    if (!(await cultureAppartient(id, user.id))) {
      return NextResponse.json({ error: "Culture introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const culture = await prisma.culture.update({
      where: { id },
      data: { nom: body.nom, type: body.type },
    });
    return NextResponse.json(culture);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const id = Number((await params).id);
    if (!(await cultureAppartient(id, user.id))) {
      return NextResponse.json({ error: "Culture introuvable" }, { status: 404 });
    }

    const nbCycles = await prisma.cycleCulture.count({ where: { cultureId: id } });
    if (nbCycles > 0) {
      return NextResponse.json(
        { error: "Cette culture est utilisée par un cycle : supprimez d'abord le cycle" },
        { status: 409 },
      );
    }

    const culture = await prisma.culture.delete({ where: { id } });
    return NextResponse.json(culture);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la culture" }, { status: 500 });
  }
}