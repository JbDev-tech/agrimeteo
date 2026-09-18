import {prisma} from '../lib/prisma'

export default async function Home() {
      const parcelles = await prisma.parcelle.findMany()
        console.log(parcelles)

        return(
          <div>
            <h1>Liste des parcelles</h1>
            <p>le nombre de parcelles trouvés est de {parcelles.length}</p>
            <ul>
              {parcelles.map((parcelle:any)=>(
                <li key= {parcelle.id}>
                  {parcelle.nom} de longitude {parcelle.longitude} et de latitude {parcelle.latitude}
                </li>
              ))}
            </ul>
          </div>
        )
    }
