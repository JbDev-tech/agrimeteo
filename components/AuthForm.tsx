'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const estInscription = mode === 'register'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, motDePasse }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue')

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-sm mx-auto space-y-3">
      <h1 className="text-2xl font-bold">
        {estInscription ? 'Créer un compte' : 'Connexion'}
      </h1>

      {estInscription && (
        <input
          className="border rounded p-2 w-full"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      )}
      <input
        className="border rounded p-2 w-full"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="border rounded p-2 w-full"
        type="password"
        placeholder="Mot de passe (8 caractères minimum)"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        required
      />

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white rounded p-2 w-full disabled:opacity-50"
      >
        {loading ? 'Patientez...' : estInscription ? "S'inscrire" : 'Se connecter'}
      </button>

      <p className="text-sm">
        {estInscription ? (
          <>Déjà un compte ? <Link href="/login" className="underline">Connexion</Link></>
        ) : (
          <>Pas de compte ? <Link href="/register" className="underline">Inscription</Link></>
        )}
      </p>
    </form>
  )
}