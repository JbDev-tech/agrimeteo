//Création de l'api pour Culture

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


//POST
export async function POST(REQUEST:Request) {
    try{
        const body = await REQUEST.json()
        const culture =  await prisma.culture.create(
        
        {data:{
            nom : body.nom,
            type : body.type

        }
    })
        return NextResponse.json(culture,{status:200})
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la création de la culture "} ,{status:500})
    }
}

//GET

export async function GET(REQUEST:Request) {
    

    try{
        const culture = await prisma.culture.findMany()
        return NextResponse.json(culture,{status:200})
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la récupération de la liste de culture "}, {status: 500})
    }
}

