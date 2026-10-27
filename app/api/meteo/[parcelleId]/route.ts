import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
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

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé api manquante" }, { status: 500 });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${parcelle.latitude}&lon=${parcelle.longitude}&appid=${apiKey}&units=metric&lang=fr`;

    const response = await fetch(url, {
      next: { revalidate: 900 }, // cache de 15 min
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("OpenWeather error:", errData);
      return NextResponse.json({ error: errData }, { status: response.status });
    }

    const meteo = await response.json();
    return NextResponse.json(meteo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}