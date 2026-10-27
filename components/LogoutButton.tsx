'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="text-white underline bg-green-400  p-2 rounded-full hover:text-red-400 hover:bg-red-300">
      Déconnexion
    </button>
  )
}