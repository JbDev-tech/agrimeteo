'use client'
import { Parcelle } from "@/app/generated/prisma/client";
import { useState } from "react";


export  function ParcellesForm({parcelle} : {parcelle?: Parcelle}){

    
    const [nom, setNom] = useState(parcelle?.nom || '')
    const [latitude, setLatitude] = useState(parcelle?.latitude?.toString() || '')
    const [longitude, setLongitude] = useState(parcelle?.longitude?.toString() || '')
    const [superficie, setSuperficie] = useState(parcelle?.superficie?.toString() || '')


    async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    const url = parcelle ?`/api/parcelles/${parcelle.id}`:`/api/parcelles`
    const method = parcelle ? 'PUT' : 'POST'

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nom, 
            latitude : Number(latitude), 
            longitude: Number(longitude), 
            superficie: Number(superficie)
        })
    })
}

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" 
                placeholder="Nom de la parcelle " 
                value={nom} 
                onChange={(e) => setNom(e.target.value)} />

                <input type="number" 
                placeholder="Mettre la superficie"
                value={superficie}
                onChange={(e)=>setSuperficie(e.target.value)}
                />

                <input type="number"
                placeholder="Placer la longitude"
                value={longitude}
                onChange={(e)=>(setLongitude(e.target.value))} />

                <input type="number"
                placeholder="Placer la latitude"
                value={latitude}
                onChange={(e)=>(setLatitude(e.target.value))} />

                <button type="submit">Enrégistrer</button>
            </form>

            
        </div>
    )
}