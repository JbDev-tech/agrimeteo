'use client'

import { Culture } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

export function CultureList(){

    const [cultures, setCultures] = useState<Culture[]>([])
    useEffect(()=>{
        fetch('/api/cultures')
        .then(res =>res.json())
        .then(data => setCultures(data))
    },[])

    async function handleDelete(id:number) {
        await fetch(`/api/cultures/${id}`,  {method:'DELETE'})
        setCultures(cultures.filter((culture)=>culture.id !== id))
    }

    return(
        <div>
            <ul>
                {cultures.map((culture)=>
                    (
                        <li key={culture.id}>
                            {culture.nom} - {culture.type}
                            <button onClick={()=>handleDelete(culture.id)}>Supprimer</button>
                        </li>
                    ))}
            </ul>
        </div>
    )
}
