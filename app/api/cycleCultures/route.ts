// POST


import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(REQUEST:Request) {
    try{
        const body = await REQUEST.json()
        const cycleCultures = await prisma.cycleCulture.create({
            data:{
                date_plantation : new Date(body.date_plantation),
                date_recolte : body.date_recolte ? new Date(body.date_recolte) : null,
                parcelleId : body.parcelleId,
                cultureId : body.cultureId

            }
        })
        return NextResponse.json(cycleCultures)
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la création des cycles de cultures "},{status:500})
    }
}

//GET 

export async function GET(REQUEST:Request) {
    try{
        const cycleCultures = await prisma.cycleCulture.findMany()
        return NextResponse.json(cycleCultures,{status:201})
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de l'affichage des cycle de culture"},{status:500})
    }
}