import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const body = await request.json();
    const nom = String(body.nom ?? "").trim();
    const type = String(body.type ?? "").trim();
    if (!nom || !type) {
      return NextResponse.json({ error: "Nom et type requis" }, { status: 400 });
    }

    const culture = await prisma.culture.create({
      data: { nom, type, userId: user.id },
    });
    return NextResponse.json(culture, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création de la culture" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const cultures = await prisma.culture.findMany({ where: { userId: user.id } });
    return NextResponse.json(cultures);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la récupération des cultures" }, { status: 500 });
  }
}