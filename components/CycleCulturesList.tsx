'use client'

import { CycleCulture } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

type Cycle = CycleCulture & {
  parcelle: { nom: string }
  culture: { nom: string }
}

function formaterDate(date: string | Date) {
  return new Date(date).toLocaleDateString('fr-FR')
}

export function CycleCultureList() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cycleCultures')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement')
        setCycles(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    if (!window.confirm('Supprimer ce cycle et tous ses relevés ?')) return

    const res = await fetch(`/api/cycleCultures/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Suppression impossible')
      return
    }
    setError(null)
    setCycles(cycles.filter((cycle) => cycle.id !== id))
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}

      {cycles.length === 0 && !error && (
        <p className="text-gray-500">Aucun cycle pour l&apos;instant.</p>
      )}

      <ul className="space-y-2">
        {cycles.map((cycle) => (
          <li key={cycle.id} className="rounded border bg-white p-3">
            <p className="font-medium">
              {cycle.culture.nom} sur {cycle.parcelle.nom}
            </p>
            <p className="text-sm text-gray-600">
              Plantée le {formaterDate(cycle.date_plantation)}
              {cycle.date_recolte
                ? ` - récolte le ${formaterDate(cycle.date_recolte)}`
                : ' - en cours'}
            </p>
            <button
              onClick={() => handleDelete(cycle.id)}
              className="mt-2 text-sm text-red-600 underline"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}