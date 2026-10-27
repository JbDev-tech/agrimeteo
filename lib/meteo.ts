import type { MeteoActuelle } from "./conseils";

export async function getMeteoActuelle(
  lat: number,
  lon: number,
): Promise<MeteoActuelle> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Clé API manquante");

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
  const res = await fetch(url, { next: { revalidate: 900 } }); // cache 15 min
  if (!res.ok) throw new Error(`Erreur OpenWeather (${res.status})`);

  const d = await res.json();
  return {
    temp: d.main.temp,
    humidite: d.main.humidity,
    vent: d.wind?.speed ?? 0,
    pluie: d.rain?.["1h"] ?? 0,
    description: d.weather?.[0]?.description ?? "",
    condition: d.weather?.[0]?.main ?? "",
  };
}
export type PrevisionJour = {
  date: string; // AAAA-MM-JJ
  tempMin: number;
  tempMax: number;
  pluie: number; // mm sur la journée
  probaPluie: number; // % (maximum de la journée)
  description: string;
};

export async function getPrevisions(
  lat: number,
  lon: number,
): Promise<PrevisionJour[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Clé API manquante");

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
  const res = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
  if (!res.ok) throw new Error(`Erreur OpenWeather (${res.status})`);

  const data = await res.json();

  const jours = new Map<
    string,
    { temps: number[]; pluie: number; pop: number; descriptions: string[] }
  >();

  for (const p of data.list) {
    const jour: string = p.dt_txt.slice(0, 10);
    if (!jours.has(jour)) {
      jours.set(jour, { temps: [], pluie: 0, pop: 0, descriptions: [] });
    }
    const j = jours.get(jour)!;
    j.temps.push(p.main.temp);
    j.pluie += p.rain?.["3h"] ?? 0;
    j.pop = Math.max(j.pop, p.pop ?? 0);
    j.descriptions.push(p.weather?.[0]?.description ?? "");
  }

  return Array.from(jours.entries())
    .slice(0, 5)
    .map(([date, j]) => ({
      date,
      tempMin: Math.round(Math.min(...j.temps)),
      tempMax: Math.round(Math.max(...j.temps)),
      pluie: Math.round(j.pluie * 10) / 10,
      probaPluie: Math.round(j.pop * 100),
      description: j.descriptions[Math.floor(j.descriptions.length / 2)],
    }));
}