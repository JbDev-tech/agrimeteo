//Ajouter ou crée (POST)

import {prisma} from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(REQUEST:Request) {
    try{
        const body = await REQUEST.json()
        const parcelle = await prisma.parcelle.create({
            data:{
                nom : body.nom,
                latitude : body.latitude,
                longitude : body.longitude,
                superficie : body.superficie
            }
        })
         return NextResponse.json({parcelle}, {status: 201})
    }catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erreur lors de la création de la parcelle" }, { status: 500 })
    }
}


//Maintenant GET pour la lecture 


export async function GET(REQUEST:Request) {
    try{
        const parcelles = await prisma.parcelle.findMany()
        return NextResponse.json(parcelles) 
    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la récupération des parcelles"},{status:500})
    }
}