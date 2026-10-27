import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { cycleAppartient } from "@/lib/acces";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const body = await request.json();
    const cycleCultureId = Number(body.cycleCultureId);

    if (!body.date || !body.stade_croissance || !cycleCultureId) {
      return NextResponse.json(
        { error: "Cycle, date et stade de croissance requis" },
        { status: 400 },
      );
    }

    if (!(await cycleAppartient(cycleCultureId, user.id))) {
      return NextResponse.json({ error: "Cycle introuvable" }, { status: 404 });
    }

    const releve = await prisma.releve.create({
      data: {
        date: new Date(body.date),
        observation: body.observation ?? "",
        stade_croissance: body.stade_croissance,
        cycleCultureId,
      },
    });
    return NextResponse.json(releve, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création du relevé" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const releves = await prisma.releve.findMany({
      where: { cycleCulture: { parcelle: { userId: user.id } } },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(releves);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la récupération des relevés" }, { status: 500 });
  }
}