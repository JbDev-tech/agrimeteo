'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

type MeteoData = {
  main: { temp: number; humidity: number }
  weather: { description: string }[]
}

type Conseil = {
  titre: string
  message: string
  type: 'alerte' | 'arrosage' | 'culture' | 'info'
}

type Prevision = {
  date: string
  tempMin: number
  tempMax: number
  pluie: number
  probaPluie: number
  description: string
}

const couleurs: Record<Conseil['type'], string> = {
  alerte: 'border-red-500 bg-red-50',
  arrosage: 'border-blue-500 bg-blue-50',
  culture: 'border-green-500 bg-green-50',
  info: 'border-gray-400 bg-gray-50',
}

function formaterJour(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function DetailParcellePage() {
  const params = useParams()
  const [meteo, setMeteo] = useState<MeteoData | null>(null)
  const [conseils, setConseils] = useState<Conseil[]>([])
  const [previsions, setPrevisions] = useState<Prevision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return

    setLoading(true)
    setError(null)

    Promise.all([
      fetch(`/api/meteo/${params.id}`),
      fetch(`/api/conseils/${params.id}`),
      fetch(`/api/previsions/${params.id}`),
    ])
      .then(async ([resMeteo, resConseils, resPrevisions]) => {
        const dataMeteo = await resMeteo.json()
        const dataConseils = await resConseils.json()
        const dataPrevisions = await resPrevisions.json()

        if (!resMeteo.ok) {
          throw new Error(dataMeteo.error || 'Erreur lors du chargement de la météo')
        }
        if (!resConseils.ok) {
          throw new Error(dataConseils.error || 'Erreur lors du chargement des conseils')
        }
        if (!resPrevisions.ok) {
          throw new Error(dataPrevisions.error || 'Erreur lors du chargement des prévisions')
        }

        setMeteo(dataMeteo)
        setConseils(dataConseils)
        setPrevisions(dataPrevisions)
      })
      .catch((err) => setError(err.message || 'Une erreur est survenue'))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Détail parcelle</h1>
        <p>Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Détail parcelle</h1>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Détail parcelle</h1>

      {meteo && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Météo actuelle</h2>
          <p>Température : {meteo.main.temp}°C</p>
          <p>Météo : {meteo.weather[0].description}</p>
          <p>Humidité : {meteo.main.humidity}%</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Prévisions sur 5 jours</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {previsions.map((p) => (
          <div key={p.date} className="border rounded p-2 text-sm text-center">
            <p className="font-semibold capitalize">{formaterJour(p.date)}</p>
            <p>{p.tempMin}° / {p.tempMax}°</p>
            <p>Pluie : {p.probaPluie}%</p>
            <p>{p.pluie} mm</p>
            <p className="text-gray-600">{p.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Conseils du jour</h2>
      <div className="space-y-3">
        {conseils.map((c, i) => (
          <div key={i} className={`border-l-4 p-3 rounded ${couleurs[c.type]}`}>
            <p className="font-semibold">{c.titre}</p>
            <p>{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}