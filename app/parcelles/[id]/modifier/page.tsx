import { ParcellesForm } from "@/components/ParcellesForm"
import { prisma } from "@/lib/prisma"

export default async function ModifierParcellePage({ params }: { params: Promise<{ id: string }> }){
    
    const {id} = await params
    const parcelle = await prisma.parcelle.findUnique(
        {
            where: {id :Number(id)}
        }
    )

    return(
        <div>
            <h1>Modifier la parcelle</h1>
            <ParcellesForm parcelle = {parcelle}/>
        </div>
    )

}