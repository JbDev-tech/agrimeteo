'use client'

import { Culture, CycleCulture, Parcelle } from "@/app/generated/prisma/client";
import { useState, useEffect } from "react";

export function CycleCultureForm({cycleCulture} : {cycleCulture?:CycleCulture}){
    const [parcelles,setParcelles] = useState<Parcelle[]>([])
    const [cultures,setCultures] = useState<Culture[]>([])
    const [cultureId,setCultureId] = useState('')
    const [parcelleId,setParcelleId] = useState('')
    const [date_plantation,setDate_plantation] = useState('')


    useEffect(()=>{
        fetch(`/api/parcelles`)
        .then(res=>res.json())
        .then(data =>setParcelles(data))
    },[])

    useEffect(()=>{
        fetch(`/api/cultures`)
        .then(res=>res.json())
        .then(data=>setCultures(data))
    },[])

    async function handleSubmit(e:React.SubmitEvent) {
        e.preventDefault()

        const url = cycleCulture?`/api/cycleCultures/${cycleCulture.id}` : `/api/cycleCultures`
        const method = cycleCulture? 'PUT':'POST'

        await fetch(url,{
            method:method,
            headers: {'Content-Type':'application/json' }, 
            body:JSON.stringify({
                date_plantation,
                parcelleId : Number(parcelleId),
                cultureId : Number(cultureId)
            })
        })
    }
    return (
    <div>
        <form onSubmit={handleSubmit}>
            <select value={parcelleId} onChange={(e) => setParcelleId(e.target.value)}>
                <option value="">-- Choisir une parcelle --</option>
                {parcelles.map((parcelle) => (
                    <option key={parcelle.id} value={parcelle.id}>{parcelle.nom}</option>
                ))}
            </select>

            <select value={cultureId} onChange={(e) => setCultureId(e.target.value)}>
                <option value="">-- Choisir une culture --</option>
                {cultures.map((culture) => (
                    <option key={culture.id} value={culture.id}>{culture.nom}</option>
                ))}
            </select>

            <input type="date" value={date_plantation} onChange={(e) => setDate_plantation(e.target.value)} />

            <button type="submit">Enregistrer</button>
        </form>
    </div>
)
}