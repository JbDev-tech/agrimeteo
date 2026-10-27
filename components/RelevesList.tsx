'use client'

import { Releve } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

export function RelevesList() {
  const [releves, setReleves] = useState<Releve[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/releves')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement')
        setReleves(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    if (!window.confirm('Supprimer ce relevé ?')) return

    const res = await fetch(`/api/releves/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Suppression impossible')
      return
    }
    setError(null)
    setReleves(releves.filter((releve) => releve.id !== id))
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}

      {releves.length === 0 && !error && (
        <p className="text-gray-500">Aucun relevé pour l&apos;instant.</p>
      )}

      <ul className="space-y-2">
        {releves.map((releve) => (
          <li key={releve.id} className="rounded border bg-white p-3">
            <p className="font-medium">
              {new Date(releve.date).toLocaleDateString('fr-FR')} - {releve.stade_croissance}
            </p>
            <p className="text-sm text-gray-600">{releve.observation}</p>
            <button
              onClick={() => handleDelete(releve.id)}
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