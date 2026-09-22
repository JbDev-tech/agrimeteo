import { CultureForm } from "@/components/CulturesForm"
import { prisma } from "@/lib/prisma"

export default async function ModifierCulturePage({params}:{params : Promise<{id :string}>}) {
    const {id} = await params
    const culture = await prisma.culture.findUnique(
        {
        where : {id : Number(id)}
    })
    return(
        <div>
            <h1>Modifier une culture</h1>
            <CultureForm culture={culture}/>
        </div>
    )

}