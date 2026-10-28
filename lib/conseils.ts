export type MeteoActuelle = {
  temp: number;
  humidite: number;
  vent: number;
  pluie: number;
  description: string;
  condition: string;
};

export type ConseilGenere = {
  titre: string;
  message: string;
  type: "alerte" | "arrosage" | "culture" | "info";
};

function conditionsFavorables(meteo: MeteoActuelle): ConseilGenere {
  return {
    titre: "Conditions favorables",
    message: `${meteo.description || "Météo calme"} : rien de particulier à signaler aujourd'hui.`,
    type: "info",
  };
}

function reglesMeteo(meteo: MeteoActuelle): ConseilGenere[] {
  const conseils: ConseilGenere[] = [];

  if (meteo.temp >= 35) {
    conseils.push({
      titre: "Forte chaleur",
      message: `Il fait ${meteo.temp}°C. Pensez à arroser tôt le matin ou en fin de journée, et à protéger les jeunes plants du soleil.`,
      type: "alerte",
    });
  } else if (meteo.temp <= 10) {
    conseils.push({
      titre: "Températures basses",
      message: `Il fait ${meteo.temp}°C. Pensez à protéger les jeunes plants du froid (paillage, couverture).`,
      type: "alerte",
    });
  }

  if (meteo.condition === "Thunderstorm" || meteo.pluie >= 10) {
    conseils.push({
      titre: "Forte pluie",
      message:
        "Il vaut mieux éviter les traitements et l'épandage d'engrais aujourd'hui, ils risquent d'être lessivés. Vérifiez que l'eau s'évacue bien de la parcelle.",
      type: "alerte",
    });
  } else if (meteo.pluie > 0) {
    conseils.push({
      titre: "Pas besoin d'arroser",
      message: "Il pleut, le sol reçoit déjà de l'eau. Vous pouvez reporter l'arrosage.",
      type: "arrosage",
    });
  } else if (meteo.humidite <= 40 && meteo.temp >= 25) {
    conseils.push({
      titre: "Sol probablement sec",
      message: `Air sec (${meteo.humidite}% d'humidité) et chaud : pensez à vérifier l'humidité du sol et à arroser si besoin.`,
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
      message: `Vent à ${Math.round(meteo.vent * 3.6)} km/h. Évitez de pulvériser des produits aujourd'hui, le vent les emporterait.`,
      type: "alerte",
    });
  }

  return conseils;
}

function reglesCulture(
  meteo: MeteoActuelle,
  culture: string,
  stade?: string | null,
): ConseilGenere[] {
  const conseils: ConseilGenere[] = [];
  const stadeNorm = (stade ?? "").toLowerCase();

  if (stadeNorm.includes("germination") && meteo.pluie === 0 && meteo.humidite < 60) {
    conseils.push({
      titre: `${culture} : germination`,
      message: "Pensez à garder le sol humide pour que les graines lèvent bien.",
      type: "culture",
    });
  }

  if (stadeNorm.includes("croissance") && meteo.temp >= 33 && meteo.pluie === 0) {
    conseils.push({
      titre: `${culture} : besoin d'eau`,
      message:
        "Pendant la croissance, la plante a besoin d'eau régulièrement. Vérifiez l'humidité du sol.",
      type: "culture",
    });
  }

  if (stadeNorm.includes("floraison") && (meteo.pluie >= 10 || meteo.vent >= 10)) {
    conseils.push({
      titre: `${culture} : floraison fragile`,
      message:
        "La pluie forte ou le vent peuvent abîmer les fleurs. Surveillez la parcelle et protégez-la si possible.",
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
        "La pluie peut abîmer les produits mûrs. Si possible, récoltez avant les averses.",
      type: "culture",
    });
  }

  return conseils;
}

export function conseilsGeneraux(meteo: MeteoActuelle): ConseilGenere[] {
  const conseils = reglesMeteo(meteo);
  return conseils.length > 0 ? conseils : [conditionsFavorables(meteo)];
}

export function conseilsCulture(
  meteo: MeteoActuelle,
  culture: string,
  stade?: string | null,
): ConseilGenere[] {
  const conseils = reglesCulture(meteo, culture, stade);
  return conseils.length > 0
    ? conseils
    : [
        {
          titre: `${culture} : rien à signaler`,
          message: "Aucun conseil particulier pour cette culture aujourd'hui.",
          type: "info",
        },
      ];
}

export function genererConseils(
  meteo: MeteoActuelle,
  culture?: string | null,
  stade?: string | null,
): ConseilGenere[] {
  const conseils = [
    ...reglesMeteo(meteo),
    ...(culture ? reglesCulture(meteo, culture, stade) : []),
  ];
  return conseils.length > 0 ? conseils : [conditionsFavorables(meteo)];
}