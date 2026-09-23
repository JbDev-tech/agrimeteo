'use client'

import { Releve, CycleCulture } from "@/app/generated/prisma/client";
import { useState, useEffect } from "react";

export function RelevesForm({ releve }: { releve?: Releve }) {
    const [cycleCultures, setCycleCultures] = useState<CycleCulture[]>([])
    const [cycleCultureId, setCycleCultureId] = useState('')
    const [date, setDate] = useState('')
    const [observation, setObservation] = useState('')
    const [stade_croissance, setStadeCroissance] = useState('')

    useEffect(() => {
        fetch('/api/cycleCultures')
            .then(res => res.json())
            .then(data => setCycleCultures(data))
    }, [])

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()

        const url = releve ? `/api/releves/${releve.id}` : `/api/releves`
        const method = releve ? 'PUT' : 'POST'

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date,
                observation,
                stade_croissance,
                cycleCultureId: Number(cycleCultureId)
            })
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <select value={cycleCultureId} onChange={(e) => setCycleCultureId(e.target.value)}>
                    <option value="">-- Choisir un cycle --</option>
                    {cycleCultures.map((cycleCulture) => (
                        <option key={cycleCulture.id} value={cycleCulture.id}>
                            Cycle #{cycleCulture.id}
                        </option>
                    ))}
                </select>

                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <select value={stade_croissance} onChange={(e) => setStadeCroissance(e.target.value)}>
                    <option value="">-- Stade de croissance --</option>
                    <option value="germination">Germination</option>
                    <option value="croissance vegetative">Croissance végétative</option>
                    <option value="floraison">Floraison</option>
                    <option value="fructification">Fructification</option>
                    <option value="maturation">Maturation</option>
                    <option value="recolte">Récolte</option>
                </select>

                <textarea
                    placeholder="Observation"
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                />

                <button type="submit">Enregistrer</button>
            </form>
        </div>
    )
}
