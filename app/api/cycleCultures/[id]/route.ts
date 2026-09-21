import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//GET pour l'affichage d'un seule cycle de culture 
export async function  GET (REQUEST:Request,{params}: {params : Promise<{id : string}>}) {
    try{
        const {id} = await params
        const cycleCulture = await prisma.cycleCulture.findUnique({
            where : {id : Number(id)}
        })
        return NextResponse.json(cycleCulture)

    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la récupération du cycle de culture "},{status:500})
    }
}

//PUT pour la modification 

export async function PUT(REQUEST:Request,{params} : {params : Promise<{id : string}>}) {
    try{
        const {id} = await params
        const body = await REQUEST.json()
        const cycleCulture = await prisma.cycleCulture.update({
            where : {id : Number(id)},
            data:{
                date_plantation : new Date(body.date_plantation) ,
                date_recolte : body.date_recolte? new Date(body.date_recolte) : null

            }
        })
        return NextResponse.json(cycleCulture)
        
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la modification"},{status:500})
    }
}

//DELETE pour la suppression 

export async function DELETE(REQUEST:Request, {params} : {params : Promise<{id : string}>} ) {
    try{
        const {id} = await params
        const cycleCulture = await prisma.cycleCulture.delete({
            where : {id : Number(id)}
        })
        return NextResponse.json(cycleCulture)
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la modification "},{status:500})
    }
}