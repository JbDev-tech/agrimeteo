//pour la lecture d'une seule parcelle

import { NextResponse } from 'next/server'
import {prisma}  from '../../../../lib/prisma'

export async function GET(REQUEST :Request ,{params} : {params :Promise<{id : string}>}){
    try{
        const {id} = await params
        const parcelle = await prisma.parcelle.findUnique({
            where:{id : Number(id)}
        })
        return NextResponse.json(parcelle)

    }catch(error){
        console.error(error)
       return NextResponse.json({error:"Erreur lors de la recupération de la parcelle"},{status:500})
    }
}

//Pour modifier une parcelle

export  async function PUT(REQUEST:Request,{params}:{params :Promise<{id : string}>}) {
    try{

        const {id} = await params
        const body = await REQUEST.json()
        const parcelle = await prisma.parcelle.update({
            where : { id : Number(id)},
            data:{
                nom : body.nom,
                latitude : body.latitude,
                longitude: body.longitude,
                superficie: body.superficie
            } 
        })
         return NextResponse.json(parcelle)

    }catch(error){
        console.error(error)
        return NextResponse.json({error:"Erreur lors de la modification du parcelle"},{status:500})
    }
}

// Pour supprimer une parcelle 

export async function DELETE(REQUEST:Request , {params}:{params :Promise<{id : string}>}){
    try{

        const {id} = await params
        const parcelle = await prisma.parcelle.delete({
            where : {id :Number(id)}
        })
        return NextResponse.json(parcelle)

    }catch(error){
        console.error(error)
        return NextResponse.json({error:("erreur  lors de la suppression de la parcelle")},{status:500})
    }
}