'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

type MeteoData = {
  main: {
    temp: number
    humidity: number
  }
  weather: {
    description: string
  }[]
}

export default function DetailParcellePage() {
  const params = useParams()
  const [meteo, setMeteo] = useState<MeteoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return

    setLoading(true)
    setError(null)

    fetch(`/api/meteo/${params.id}`)
      .then(async (res) => {
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors du chargement de la météo')
        }

        setMeteo(data)
      })
      .catch((err) => {
        setError(err.message || 'Une erreur est survenue')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [params.id])

  if (loading) {
    return (
      <div>
        <h1>Détail parcelle</h1>
        <p>Chargement de la météo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Détail parcelle</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Détail parcelle</h1>

      {meteo && (
        <div>
          <p>Température : {meteo.main.temp}°C</p>
          <p>Météo : {meteo.weather[0].description}</p>
          <p>Humidité : {meteo.main.humidity}%</p>
        </div>
      )}
    </div>
  )
}