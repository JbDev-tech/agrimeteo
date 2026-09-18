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
    return(
        <div>
            <ul>
                {parcelles.map((parcelle)=>(
                    <li key={parcelle.id}>
                        {parcelle.nom} - {parcelle.superficie} ha 
                    </li>
                ))}
            </ul>
        </div>
    )
}