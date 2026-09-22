//GET pour la récupération d'une seule relevé

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(REQUEST:Request, {params} : {params : Promise<{id :string}>}) {
    try{
        const {id} = await params
        const releve = await prisma.releve.findUnique({
            where : {id : Number(id)}
        })

        return NextResponse.json(releve)
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Error lors de la l'affichage du relevé"},{status:500})
    }
}

//PUT pour la modification 'une seule releve

export async function PUT(REQUEST:Request, {params} : {params : Promise<{id : string}>}) {
    try{
        const body = await REQUEST.json()
        const {id} = await params
        const releve = await prisma.releve.update({
            where : {id : Number(id)},
            data:{
                date : new Date(body.date),
                observation : body.observation,
                stade_croissance : body.stade_croissance,
                cycleCultureId  : body.cycleCultureId 
            }
        })
        return NextResponse.json(releve)
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la modification"},{status:500})
    }
}

//delete pour la suppression

export async function DELETE(REQUEST:Request, {params} : {params : Promise<{id : string}>}) {
    try{
        const {id} = await params
        const releve = await prisma.releve.delete({
            where : {id : Number(id)}
        })
        return NextResponse.json(releve)
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Error lors de la suppression"},{status:500})
    }
}