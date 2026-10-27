type DonneesParcelle = {
  nom: unknown
  latitude: unknown
  longitude: unknown
  superficie: unknown
}

function estNombre(valeur: unknown) {
  return valeur !== '' && valeur !== null && valeur !== undefined && Number.isFinite(Number(valeur))
}

export function validerParcelle(donnees: DonneesParcelle): string | null {
  const nom = String(donnees.nom ?? '').trim()

  if (nom.length < 2) return 'Le nom doit contenir au moins 2 caractères'
  if (nom.length > 100) return 'Le nom est trop long (100 caractères maximum)'

  if (!estNombre(donnees.latitude) || Number(donnees.latitude) < -90 || Number(donnees.latitude) > 90) {
    return 'La latitude doit être un nombre entre -90 et 90'
  }

  if (!estNombre(donnees.longitude) || Number(donnees.longitude) < -180 || Number(donnees.longitude) > 180) {
    return 'La longitude doit être un nombre entre -180 et 180'
  }

  if (!estNombre(donnees.superficie) || Number(donnees.superficie) <= 0) {
    return 'La superficie doit être un nombre supérieur à 0'
  }

  return null
}