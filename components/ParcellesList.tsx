'use client'

import { Parcelle } from "@/app/generated/prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"

export function ParcellesList() {
  const [parcelles, setParcelles] = useState<Parcelle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/parcelles')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement')
        setParcelles(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    if (!window.confirm('Supprimer cette parcelle et tout son historique (cycles, relevés, conseils) ?')) return

    const res = await fetch(`/api/parcelles/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Suppression impossible')
      return
    }
    setError(null)
    setParcelles(parcelles.filter((parcelle) => parcelle.id !== id))
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}

      {parcelles.length === 0 && !error && (
        <p className="text-gray-500">Aucune parcelle pour l&apos;instant. Ajoutez la première.</p>
      )}

      <ul className="space-y-2">
        {parcelles.map((parcelle) => (
          <li
            key={parcelle.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border bg-white p-3"
          >
            <div>
              <p className="font-medium">{parcelle.nom}</p>
              <p className="text-sm text-gray-600">{parcelle.superficie} ha</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/parcelles/${parcelle.id}`} className="text-green-700 underline">
                Voir
              </Link>
              <Link href={`/parcelles/${parcelle.id}/modifier`} className="text-blue-700 underline">
                Modifier
              </Link>
              <button onClick={() => handleDelete(parcelle.id)} className="text-red-600 underline">
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}