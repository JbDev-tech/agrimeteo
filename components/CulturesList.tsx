'use client'

import { Culture } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

export function CultureList() {
  const [cultures, setCultures] = useState<Culture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cultures')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement')
        setCultures(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    const res = await fetch(`/api/cultures/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Suppression impossible')
      return
    }
    setError(null)
    setCultures(cultures.filter((culture) => culture.id !== id))
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}

      {cultures.length === 0 && !error && (
        <p className="text-gray-500">Aucune culture pour l&apos;instant.</p>
      )}

      <ul>
        {cultures.map((culture) => (
          <li key={culture.id}>
            {culture.nom} - {culture.type}
            <button onClick={() => handleDelete(culture.id)}> Supprimer </button>
          </li>
        ))}
      </ul>
    </div>
  )
}