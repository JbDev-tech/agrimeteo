# To-do détaillée — AgriMétéo v2

*Chaque tâche = une notion à apprendre + un petit bout de code à écrire toi-même.*

---

## ✅ Déjà fait
- [x] Projet Next.js créé
- [x] Prisma installé et configuré (adapter MariaDB)
- [x] Schéma complet écrit (Parcelle, Culture, CycleCulture, Relevé, Meteo, Conseil)
- [x] Migration effectuée (tables visibles dans Prisma Studio)
- [x] `lib/prisma.ts` (connexion centralisée)
- [x] Route `POST /api/parcelles` (créer une parcelle) — testée avec succès dans Postman

---

## 1. CRUD Parcelle (en cours)

- [x] **GET `/api/parcelles`** — lister toutes les parcelles (`prisma.parcelle.findMany()`)
- [ ] **GET `/api/parcelles/[id]`** — récupérer une seule parcelle (`prisma.parcelle.findUnique()`), notion à apprendre : les routes dynamiques Next.js (dossier `[id]`)
- [ ] **PUT `/api/parcelles/[id]`** — modifier une parcelle (`prisma.parcelle.update()`)
- [ ] **DELETE `/api/parcelles/[id]`** — supprimer une parcelle (`prisma.parcelle.delete()`)
- [ ] Tester les 4 routes dans Postman avant de passer à l'interface
- [ ] **Formulaire React** : page `app/parcelles/page.tsx` avec liste des parcelles (fetch GET) + bouton supprimer
- [ ] **Formulaire d'ajout** : `app/parcelles/ajouter/page.tsx`, avec `useState` par champ + `fetch` en POST vers l'API
- [ ] **Formulaire de modification** : réutiliser la même logique, pré-remplie avec les données existantes
- [ ] Commit Git : `"CRUD Parcelle complet"`

---

## 2. CRUD Culture + CycleCulture

- [ ] Routes `POST`/`GET`/`PUT`/`DELETE` pour `Culture` (nom, type — table simple, sans relation entrante)
- [ ] Routes pour `CycleCulture` : créer un cycle = choisir une parcelle existante + une culture existante + une date de plantation
- [ ] Notion à apprendre : requêtes Prisma avec relations (`include`) pour afficher, par exemple, le nom de la culture ET le nom de la parcelle sur un même cycle
- [ ] Interface : formulaire de "plantation" (sélectionner parcelle + culture dans des `<select>`, remplis depuis la base)
- [ ] Affichage des cycles actifs par parcelle
- [ ] Commit Git : `"CRUD Culture et CycleCulture"`

---

## 3. CRUD Relevé

- [ ] Routes `POST`/`GET`/`PUT`/`DELETE` pour `Relevé`, liées à un `cycleCultureId`
- [ ] Champ `stade_croissance` : liste déroulante fixe (germination, croissance végétative, floraison, fructification, maturation, récolte) plutôt que texte libre
- [ ] Interface : formulaire d'ajout de relevé pour un cycle donné
- [ ] Affichage de l'historique des relevés, trié par date
- [ ] Commit Git : `"CRUD Relevé + historique"`

---

## 4. Intégration météo (API externe)

- [ ] Créer un compte OpenWeatherMap (gratuit), récupérer une clé API
- [ ] Stocker la clé dans `.env` (ex : `OPENWEATHER_API_KEY`), vérifier qu'elle n'est pas commit sur GitHub
- [ ] Notion à apprendre : appel `fetch` vers une API externe depuis une route Next.js
- [ ] Route `GET /api/meteo/[parcelleId]` : récupère lat/long de la parcelle en base, puis interroge OpenWeatherMap
- [ ] Afficher la météo actuelle + prévisions sur la page de détail d'une parcelle
- [ ] (Optionnel) Sauvegarder un instantané dans la table `Meteo`
- [ ] Commit Git : `"Intégration météo OpenWeatherMap"`

---

## 5. Logique des conseils agricoles

- [ ] Écrire une fonction pure `genererConseils(donneesMeteo)` qui applique les règles (if/else)
- [ ] Notion à apprendre : séparer la "logique métier" de la route API qui l'utilise
- [ ] Appeler cette fonction juste après avoir récupéré la météo d'une parcelle
- [ ] Sauvegarder le(s) conseil(s) généré(s) dans la table `Conseil`
- [ ] Afficher les conseils sur la page de la parcelle
- [ ] Commit Git : `"Génération automatique des conseils agricoles"`

---

## 6. Carte des parcelles

- [ ] `npm install react-leaflet leaflet`
- [ ] Notion à apprendre : composants "client-only" dans Next.js App Router (`'use client'`)
- [ ] Afficher une carte avec un marqueur par parcelle
- [ ] Clic sur un marqueur → affiche le nom de la parcelle (popup)
- [ ] Commit Git : `"Carte des parcelles avec react-leaflet"`

---

## 7. Finitions UI + gestion des erreurs

- [ ] Mise en page cohérente avec Tailwind sur toutes les pages
- [ ] Messages d'erreur clairs si un formulaire est mal rempli
- [ ] Page "parcelle introuvable" si un id n'existe pas
- [ ] État de chargement ("Chargement...") pendant les appels API
- [ ] Commit Git : `"Finitions UI et gestion des erreurs"`

---

## 8. Déploiement en production

- [ ] Créer une base MySQL hébergée (PlanetScale ou Railway)
- [ ] Migrer le schéma vers cette base de prod (`npx prisma migrate deploy`)
- [ ] Créer un compte Vercel, connecter le repo GitHub
- [ ] Configurer les variables d'environnement sur Vercel
- [ ] Déployer et tester l'app en ligne de bout en bout
- [ ] Mettre à jour le README GitHub avec le lien de démo en ligne
- [ ] Commit Git final : `"Déploiement production"`

---

## Rappel méthode
1. Écris le code toi-même à partir des indices donnés.
2. Bloque → montre le code + l'erreur exacte.
3. Teste avec Postman avant de construire l'interface, à chaque nouvelle route.
4. Commit dès qu'une case est cochée.