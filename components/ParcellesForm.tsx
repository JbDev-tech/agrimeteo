'use client'

import { Parcelle } from "@/app/generated/prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { validerParcelle } from "@/lib/validation"

type Lieu = { label: string; lat: number; lon: number }

export function ParcellesForm({ parcelle }: { parcelle?: Parcelle }) {
  const router = useRouter()
  const [nom, setNom] = useState(parcelle?.nom || '')
  const [superficie, setSuperficie] = useState(parcelle?.superficie?.toString() || '')
  const [latitude, setLatitude] = useState(parcelle?.latitude?.toString() || '')
  const [longitude, setLongitude] = useState(parcelle?.longitude?.toString() || '')
  const [lieu, setLieu] = useState(parcelle ? 'Position enregistrée' : '')
  const [recherche, setRecherche] = useState('')
  const [resultats, setResultats] = useState<Lieu[]>([])
  const [rechercheEnCours, setRechercheEnCours] = useState(false)
  const [gpsEnCours, setGpsEnCours] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function utiliserMaPosition() {
    setError(null)
    if (!navigator.geolocation) {
      setError("Votre appareil ne permet pas la géolocalisation")
      return
    }
    setGpsEnCours(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(5))
        setLongitude(pos.coords.longitude.toFixed(5))
        setLieu('Ma position actuelle')
        setResultats([])
        setGpsEnCours(false)
      },
      () => {
        setError("Position introuvable. Autorisez la localisation ou cherchez le nom d'un lieu.")
        setGpsEnCours(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function chercher() {
    setError(null)
    const q = recherche.trim()
    if (q.length < 2) {
      setError('Tapez au moins 2 lettres')
      return
    }
    setRechercheEnCours(true)
    try {
      const res = await fetch(`/api/geocodage?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Recherche impossible')
      setResultats(data)
      if (data.length === 0) {
        setError("Aucun lieu trouvé. Essayez un autre nom ou ajoutez le pays (ex : Kpalimé, TG)")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recherche impossible')
    } finally {
      setRechercheEnCours(false)
    }
  }

  function choisir(l: Lieu) {
    setLatitude(l.lat.toString())
    setLongitude(l.lon.toString())
    setLieu(l.label)
    setResultats([])
    setRecherche('')
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setError(null)

    if (!latitude || !longitude) {
      setError("Indiquez l'emplacement de la parcelle : utilisez votre position ou cherchez un lieu")
      return
    }

    const messageErreur = validerParcelle({ nom, latitude, longitude, superficie })
    if (messageErreur) {
      setError(messageErreur)
      return
    }

    setLoading(true)
    try {
      const url = parcelle ? `/api/parcelles/${parcelle.id}` : `/api/parcelles`
      const method = parcelle ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
          superficie: Number(superficie),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement")

      router.push('/parcelles')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium">Nom de la parcelle</label>
        <input
          type="text"
          className="w-full rounded border p-2"
          placeholder="Ex : Champ de maïs"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Superficie (hectares)</label>
        <input
          type="number"
          step="any"
          className="w-full rounded border p-2"
          placeholder="Ex : 2.5"
          value={superficie}
          onChange={(e) => setSuperficie(e.target.value)}
        />
      </div>

      <div className="space-y-2 rounded border p-3">
        <p className="text-sm font-medium">Où se trouve la parcelle ?</p>

        <button
          type="button"
          onClick={utiliserMaPosition}
          disabled={gpsEnCours}
          className="w-full rounded border border-green-600 px-3 py-2 text-green-700 disabled:opacity-50"
        >
          {gpsEnCours ? 'Recherche de votre position...' : '📍 Utiliser ma position'}
        </button>

        <p className="text-center text-xs text-gray-500">ou</p>

        <div className="flex gap-2">
          <input
            type="text"
            className="min-w-0 flex-1 rounded border p-2"
            placeholder="Village ou ville (ex : Kpalimé, TG)"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                chercher()
              }
            }}
          />
          <button
            type="button"
            onClick={chercher}
            disabled={rechercheEnCours}
            className="rounded bg-gray-800 px-3 py-2 text-white disabled:opacity-50"
          >
            {rechercheEnCours ? '...' : 'Chercher'}
          </button>
        </div>

        {resultats.length > 0 && (
          <ul className="rounded border">
            {resultats.map((l, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => choisir(l)}
                  className="w-full px-3 py-2 text-left hover:bg-green-50"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {latitude && longitude && (
          <p className="rounded bg-green-50 p-2 text-sm text-green-800">
            ✅ {lieu}
            <span className="block text-xs text-gray-500">
              ({Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)})
            </span>
          </p>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  )
}