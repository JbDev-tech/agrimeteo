// Maintenant on attaque PUT ET DELETE et  GET pour la lecture

import { prisma } from "@/lib/prisma"
import {  NextResponse } from "next/server"

//GET

export async function GET(REQUEST:Request, {params} : {params : Promise<{id : string}>}) {
    try{
        const {id} = await params
        const culture = await prisma.culture.findUnique({
            where : {id : Number(id)}
        })
        return NextResponse.json(culture)

    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de l'affichage des cultures"},{status:500})
    }
}

//PUT pour modifier 

export async function PUT(REQUEST:Request,{params}:{params : Promise<{id : string}>}) {
    try{
        const {id} = await params
        const body = await REQUEST.json()
        const culture = await prisma.culture.update({
            where : {id : Number(id)},
            data: {
                nom : body.nom,
                type : body.type
            }
        })
        return NextResponse.json(culture,{status:200})
        
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la modification "},{status:500})
    }
    
}

//DELETE pour supprimer

export async function DELETE(REQUEST:Request,{params} : {params : Promise<{id : string}>}) {
    try{
        const {id} = await params
        const culture = await prisma.culture.delete({
            where : {id : Number(id)}
        })
        return NextResponse.json(culture, {status:200})
    }catch(error){
        console.error(error)
         return NextResponse.json({error :"Erreur lors de la suppression de la culture "},{status:500})
    }

}