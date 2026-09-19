# AgriMétéo

Application web de suivi de cultures agricoles, intégrant la météo et des conseils automatisés pour les agriculteurs.

## Fonctionnalités

- **Gestion des parcelles** : ajout, modification, suppression, avec géolocalisation (latitude/longitude)
- **Gestion des cultures** : suivi via des cycles de plantation (`CycleCulture`), liant une culture à une parcelle sur une période donnée
- **Suivi de croissance** : relevés datés avec stade de développement (germination, floraison, récolte, etc.)
- **Météo** *(à venir)* : météo actuelle et prévisions par parcelle, via API externe
- **Conseils agricoles** *(à venir)* : recommandations automatiques générées à partir des données météo
- **Carte interactive** *(à venir)* : visualisation des parcelles géolocalisées

## Stack technique

- **Frontend** : Next.js (App Router), React, Tailwind CSS
- **Backend** : API Routes Next.js
- **Base de données** : MySQL, avec Prisma ORM
- **Carte** : react-leaflet *(à venir)*
- **Déploiement** : Vercel *(à venir)*

## Modèle de données

Six entités principales : `Parcelle`, `Culture`, `CycleCulture`, `Relevé`, `Meteo`, `Conseil`.
Une culture est définie une seule fois et peut être plantée sur différentes parcelles ou périodes via un `CycleCulture`, qui relie `Parcelle` et `Culture`.

## Démarrer le projet en local

```bash
git clone https://github.com/JbDev-tech/agrimeteo.git
cd agrimeteo
npm install
```

Créer un fichier `.env` à la racine avec votre configuration MySQL :
```
DATABASE_URL="mysql://root:@localhost:3306/agrimeteo"
```

Puis lancer les migrations et le serveur de développement :
```bash
npx prisma migrate dev
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Statut du projet

En développement actif — voir `TODO.md` pour le détail des étapes réalisées et à venir.

## Auteur

[JbDev-tech](https://github.com/JbDev-tech)
