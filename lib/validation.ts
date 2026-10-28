import { STADES } from "@/lib/stades";

export const TYPES_CULTURE = [
  "Céréale",
  "Légume",
  "Tubercule",
  "Légumineuse",
  "Fruit",
  "Autre",
];

function texteValide(valeur: unknown): valeur is string {
  return typeof valeur === "string";
}

function entierPositif(valeur: unknown) {
  return typeof valeur === "number" && Number.isInteger(valeur) && valeur > 0;
}

function dateValide(valeur: unknown) {
  if (typeof valeur !== "string" || valeur.trim() === "") return false;
  return !Number.isNaN(new Date(valeur).getTime());
}

export function validerParcelle(d: {
  nom: string;
  latitude: number;
  longitude: number;
  superficie: number;
}): string | null {
  if (!texteValide(d.nom) || d.nom.trim().length < 2 || d.nom.trim().length > 100) {
    return "Le nom doit contenir entre 2 et 100 caractères.";
  }
  if (!Number.isFinite(d.latitude) || d.latitude < -90 || d.latitude > 90) {
    return "La latitude doit être comprise entre -90 et 90.";
  }
  if (!Number.isFinite(d.longitude) || d.longitude < -180 || d.longitude > 180) {
    return "La longitude doit être comprise entre -180 et 180.";
  }
  if (!Number.isFinite(d.superficie) || d.superficie <= 0) {
    return "La superficie doit être supérieure à 0.";
  }
  return null;
}

export function validerCulture(d: { nom: unknown; type: unknown }): string | null {
  if (!texteValide(d.nom) || d.nom.trim().length < 2 || d.nom.trim().length > 60) {
    return "Le nom de la culture doit contenir entre 2 et 60 caractères.";
  }
  if (!texteValide(d.type) || !TYPES_CULTURE.includes(d.type)) {
    return "Choisissez un type de culture dans la liste.";
  }
  return null;
}

export function validerCycle(d: {
  parcelleId: unknown;
  cultureId: unknown;
  date_plantation: unknown;
  date_recolte?: unknown;
}): string | null {
  if (!entierPositif(d.parcelleId)) return "Choisissez une parcelle.";
  if (!entierPositif(d.cultureId)) return "Choisissez une culture.";
  if (!dateValide(d.date_plantation)) return "Entrez une date de plantation valide.";

  const recolte = d.date_recolte;
  if (recolte !== undefined && recolte !== null && recolte !== "") {
    if (!dateValide(recolte)) return "Entrez une date de récolte valide.";
    if (new Date(recolte as string) < new Date(d.date_plantation as string)) {
      return "La date de récolte ne peut pas être avant la date de plantation.";
    }
  }
  return null;
}

export function validerReleve(d: {
  cycleCultureId: unknown;
  date: unknown;
  observation: unknown;
  stade_croissance: unknown;
}): string | null {
  if (!entierPositif(d.cycleCultureId)) return "Choisissez un cycle.";
  if (!dateValide(d.date)) return "Entrez une date valide.";
  if (!texteValide(d.observation) || d.observation.trim().length < 2) {
    return "Écrivez une observation (au moins 2 caractères).";
  }
  if (d.observation.trim().length > 1000) {
    return "L'observation est trop longue (1000 caractères maximum).";
  }
  if (!texteValide(d.stade_croissance) || !STADES.includes(d.stade_croissance)) {
    return "Choisissez un stade de croissance dans la liste.";
  }
  return null;
}