export const STADES = [
  "Germination",
  "Croissance",
  "Floraison",
  "Fructification",
  "Maturation",
  "Récolte",
];

function normaliser(texte: string) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function indexStade(stade: string | null | undefined): number {
  if (!stade) return -1;
  const cherche = normaliser(stade);
  return STADES.findIndex((s) => cherche.includes(normaliser(s)));
}