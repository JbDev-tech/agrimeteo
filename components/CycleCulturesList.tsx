'use client'

import { CycleCulture } from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";

export function CycleCultureList(){
    const [cycleCultures, setCycleCultures] = useState<CycleCulture[]>([])
    useEffect(()=>{
        fetch(`/api/cycleCultures/`)
        .then(res=>res.json())
        .then(data =>setCycleCultures(data))
    },[])

    async function handleDelete(id:number) {
        await fetch(`/api/cycleCultures/${id}`, {method:'DELETE'})
        setCycleCultures(cycleCultures.filter((cycleCulture)=>cycleCulture.id!==id))
    }

    return(
        <div>
            <ul>
                {cycleCultures.map((cycleCulture)=>(
                    <li key={cycleCulture.id}>
                        { new Date(cycleCulture.date_plantation).toLocaleDateString('fr-FR')}
                        <button onClick={()=>handleDelete(cycleCulture.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}