'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'

const liens = [
  { href: '/dashboard', label: 'Tableau de bord', icone: '🏠' },
  { href: '/parcelles', label: 'Parcelles', icone: '🗺️' },
  { href: '/cultures', label: 'Cultures', icone: '🌽' },
  { href: '/cycles', label: 'Cycles', icone: '🔄' },
  { href: '/releves', label: 'Relevés', icone: '📝' },
]

export function Sidebar({ nom }: { nom: string }) {
  const pathname = usePathname()
  const estActif = (href: string) => pathname.startsWith(href)

  return (
    <>
      {/* Menu latéral (ordinateur) */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-white p-4 sticky top-0 h-screen">
        <a href="/dashboard" className="text-xl font-bold text-green-700 mb-6">🌾 Agrimétéo</a>

        <nav className="flex flex-col gap-1">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 ${
                estActif(l.href)
                  ? 'bg-green-100 font-semibold text-green-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {l.icone} {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t pt-4 text-sm">
          <p className="mb-2 font-medium">{nom}</p>
          < LogoutButton />
        </div>
      </aside>

      {/* Barre du bas (téléphone) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 flex justify-around border-t bg-white py-2">
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center text-xs ${
              estActif(l.href) ? 'font-semibold text-green-700' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">{l.icone}</span>
            {l.label.split(' ')[0]}
          </Link>
        ))}
      </nav>
    </>
  )
}