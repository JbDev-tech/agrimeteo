'use client'

import { Parcelle } from "@/app/generated/prisma/client"
import { useState,useEffect } from "react"

export function ParcellesList(){

    const [parcelles, setParcelles] = useState<Parcelle[]>([])
    useEffect(()=>{
        fetch('/api/parcelles')
        .then(res => res.json())
        .then(data => setParcelles(data))
    },[])

    async function handleDelete(id:number) {
         await fetch(`/api/parcelles/${id}`, {method: 'DELETE'})
         setParcelles(parcelles.filter((parcelle)=>parcelle.id !== id))
    }
    return(
        <div>
            <ul>
                {parcelles.map((parcelle)=>(
                    <li key={parcelle.id}>
                        {parcelle.nom} - {parcelle.superficie}ha   
                        <button onClick={()=>handleDelete(parcelle.id)}> Supprimer </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}