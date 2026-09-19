'use client'
import { useState } from "react";


export  function ParcellesForm(){

    const [nom ,setNom] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [superficie, setSuperficie] = useState('')


    async function handleSubmit(e: React.SubmitEvent) {
  e.preventDefault()

  await fetch('/api/parcelles', {
    method: 'POST',
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