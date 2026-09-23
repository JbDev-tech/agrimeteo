'use client'

import { Releve } from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";

export function RelevesList(){

    const[releves,SetReleves] = useState<Releve[]>([])

    useEffect(()=>{
        fetch(`/api/releves/`)
        .then(res=>res.json())
        .then(data=>SetReleves(data))
    })

    async function handleDelete(id:number) {
        await fetch(`/api/releves/${id}`, {method:'DELETE'})
        SetReleves(releves.filter((releves)=>releves.id!==id))
    }

    return(
        <div>
            <ul>
                {releves.map((releve)=>(
                    <li key={releve.id}>
                        {releve.observation}
                        <button onClick={()=>handleDelete(releve.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}