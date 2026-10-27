import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 2) {
      return NextResponse.json({ error: "Tapez au moins 2 lettres" }, { status: 400 });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Recherche indisponible" }, { status: 502 });
    }

    const data: { name: string; state?: string; country: string; lat: number; lon: number }[] =
      await res.json();

    const lieux = data.map((l) => ({
      label: [l.name, l.state, l.country].filter(Boolean).join(", "),
      lat: l.lat,
      lon: l.lon,
    }));
    return NextResponse.json(lieux);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}