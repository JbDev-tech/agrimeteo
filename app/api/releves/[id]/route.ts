import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { cycleAppartient, releveAppartient } from "@/lib/acces";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const releve = await releveAppartient(Number((await params).id), user.id);
    if (!releve) return NextResponse.json({ error: "Relevé introuvable" }, { status: 404 });
    return NextResponse.json(releve);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'affichage du relevé" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const id = Number((await params).id);
    if (!(await releveAppartient(id, user.id))) {
      return NextResponse.json({ error: "Relevé introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const cycleCultureId = Number(body.cycleCultureId);

    // Le nouveau cycle choisi doit aussi appartenir à l'utilisateur
    if (!(await cycleAppartient(cycleCultureId, user.id))) {
      return NextResponse.json({ error: "Cycle introuvable" }, { status: 404 });
    }

    const releve = await prisma.releve.update({
      where: { id },
      data: {
        date: new Date(body.date),
        observation: body.observation ?? "",
        stade_croissance: body.stade_croissance,
        cycleCultureId,
      },
    });
    return NextResponse.json(releve);
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
    if (!(await releveAppartient(id, user.id))) {
      return NextResponse.json({ error: "Relevé introuvable" }, { status: 404 });
    }

    const releve = await prisma.releve.delete({ where: { id } });
    return NextResponse.json(releve);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}