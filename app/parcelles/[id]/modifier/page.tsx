import { notFound } from "next/navigation"
import { ParcellesForm } from "@/components/ParcellesForm"
import { exigerUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ModifierParcellePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await exigerUser()
  const { id } = await params

  const parcelle = await prisma.parcelle.findFirst({
    where: { id: Number(id), userId: user.id },
  })
  if (!parcelle) notFound()

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Modifier la parcelle</h1>
      <ParcellesForm parcelle={parcelle} />
    </div>
  )
}