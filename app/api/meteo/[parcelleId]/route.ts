import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  REQUEST: Request,
  { params }: { params: Promise<{ parcelleId: string }> },
) {
  try {
    const { parcelleId } = await params;

    const parcelle = await prisma.parcelle.findUnique({
      where: { id: Number(parcelleId) },
    });
    if (!parcelle) {
      return NextResponse.json(
        { error: "Erreur de parcelle" },
        { status: 404 },
      );
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé api manquante" }, { status: 500 });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${parcelle.latitude}&lon=${parcelle.longitude}&appid=${apiKey}&units=metric&lang=fr`;

    const response = await fetch(url, {
      next: { revalidate: 900 }, // <- cache en 15 min
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
