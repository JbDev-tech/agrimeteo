import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
//POST pour la création 
export async function POST(REQUEST:Request) {
    try{
        const body = await REQUEST.json()
        const releves = await prisma.releve.create({
            data:{
                date : new Date(body.date),
                observation : body.observation,
                stade_croissance : body.stade_croissance,
                cycleCultureId  : body.cycleCultureId 
            }
        })
        return NextResponse.json(releves,{status:201})
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la création des relevés"},{status:500})
    }
}

//GET pour voir les relevés
export async function GET(REQUEST:Request) {
    try{
        const releves = await prisma.releve.findMany()
        return NextResponse.json(releves)
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la récupération des relevés"},{status:500})
    }
}