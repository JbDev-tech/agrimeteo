'use client'



import { Culture } from "@/app/generated/prisma/client";
import { useState } from "react";

export function CultureForm({culture} : {culture?:Culture}){

    const [nom,setNom] = useState(culture?.nom||'')
    const [type,setType] = useState(culture?.type||'')

    async function handleSubmit(e : React.SubmitEvent) {
        e.preventDefault()

        const url = culture? `/api/cultures/${culture.id}`:`/api/cultures`
        const method = culture? 'PUT':'POST'

        await fetch(url,{
            method:method,
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                nom,
                type
            })
        })
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text"
                placeholder="Veiller mettre le nom de la culture"
                value={nom}
                onChange={(e)=> setNom(e.target.value)}
                 />

                 <input type="text"
                 placeholder="Veillez mettre le type de la culture"
                 value={type}
                 onChange={(e)=> setType(e.target.value)}/>

                 <button type="submit">Enrégistrer</button>

            </form>
        </div>
    )
}