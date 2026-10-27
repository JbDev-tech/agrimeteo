export type MeteoActuelle = {
  temp: number;
  humidite: number;
  vent: number; // m/s
  pluie: number; // mm sur la dernière heure
  description: string;
  condition: string; // ex: "Rain", "Thunderstorm", "Clear"
};

export type ConseilGenere = {
  titre: string;
  message: string;
  type: "alerte" | "arrosage" | "culture" | "info";
};

export function genererConseils(
  meteo: MeteoActuelle,
  culture?: string | null,
  stade?: string | null,
): ConseilGenere[] {
  const conseils: ConseilGenere[] = [];
  const stadeNorm = (stade ?? "").toLowerCase();

  // --- Règles liées à la météo seule ---
  if (meteo.temp >= 35) {
    conseils.push({
      titre: "Forte chaleur",
      message: `Il fait ${meteo.temp}°C. Arrosez tôt le matin ou en fin de journée et protégez les jeunes plants du soleil.`,
      type: "alerte",
    });
  } else if (meteo.temp <= 10) {
    conseils.push({
      titre: "Températures basses",
      message: `Il fait ${meteo.temp}°C. Protégez les jeunes plants du froid (paillage, couverture).`,
      type: "alerte",
    });
  }

  if (meteo.condition === "Thunderstorm" || meteo.pluie >= 10) {
    conseils.push({
      titre: "Forte pluie",
      message:
        "Évitez les traitements et l'épandage d'engrais aujourd'hui, ils seraient lessivés. Vérifiez que l'eau s'évacue bien de la parcelle.",
      type: "alerte",
    });
  } else if (meteo.pluie > 0) {
    conseils.push({
      titre: "Pas besoin d'arroser",
      message: "Il pleut, le sol reçoit déjà de l'eau. Reportez l'arrosage.",
      type: "arrosage",
    });
  } else if (meteo.humidite <= 40 && meteo.temp >= 25) {
    conseils.push({
      titre: "Sol probablement sec",
      message: `Air sec (${meteo.humidite}% d'humidité) et chaud : pensez à arroser.`,
      type: "arrosage",
    });
  }

  if (meteo.humidite >= 85 && meteo.temp >= 20 && meteo.temp <= 32) {
    conseils.push({
      titre: "Risque de maladies",
      message:
        "Chaleur et forte humidité favorisent les champignons. Surveillez les feuilles (taches, moisissures).",
      type: "alerte",
    });
  }

  if (meteo.vent >= 10) {
    conseils.push({
      titre: "Vent fort",
      message: `Vent à ${Math.round(meteo.vent * 3.6)} km/h. Ne pulvérisez pas de produits aujourd'hui, ils seraient emportés.`,
      type: "alerte",
    });
  }

  // --- Règles liées à la culture et à son stade ---
  if (culture) {
    if (stadeNorm.includes("germination") && meteo.pluie === 0 && meteo.humidite < 60) {
      conseils.push({
        titre: `${culture} : germination`,
        message: "Gardez le sol humide pour que les graines lèvent bien.",
        type: "culture",
      });
    }

    if (stadeNorm.includes("floraison") && (meteo.pluie >= 10 || meteo.vent >= 10)) {
      conseils.push({
        titre: `${culture} : floraison fragile`,
        message:
          "La pluie forte ou le vent peuvent abîmer les fleurs. Surveillez la parcelle et protégez si possible.",
        type: "culture",
      });
    }

    if (
      (stadeNorm.includes("maturation") || stadeNorm.includes("récolte") || stadeNorm.includes("recolte")) &&
      meteo.pluie > 0
    ) {
      conseils.push({
        titre: `${culture} : récolte`,
        message:
          "La pluie peut faire pourrir les produits mûrs. Récoltez avant les averses si possible.",
        type: "culture",
      });
    }
  }

  if (conseils.length === 0) {
    conseils.push({
      titre: "Conditions favorables",
      message: `${meteo.description || "Météo calme"} : rien de particulier à signaler aujourd'hui.`,
      type: "info",
    });
  }

  return conseils;
}