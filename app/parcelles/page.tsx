import Link from "next/link"
import { ParcellesList } from "@/components/ParcellesList"

export default function ParcellesPage() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes parcelles</h1>
        <Link href="/parcelles/ajouter" className="rounded bg-green-600 px-4 py-2 text-white">
          + Ajouter
        </Link>
      </div>
      <ParcellesList />
    </div>
  )
}