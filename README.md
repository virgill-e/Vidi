# 💰 Vidi Ledger

Vidi Ledger est une application de gestion de dépenses.

## 🚀 Technologies utilisées

L'application repose sur une stack technique de pointe :

- **Framework** : [Nuxt 4](https://nuxt.com/) (Vue.js 3)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com/) pour une interface fluide et responsive.
- **Base de données** : 
  - [Drizzle ORM](https://orm.drizzle.team/) pour la gestion du schéma et des requêtes.
  - **SQLite** : Utilisé par défaut pour le développement local (simplicité).
  - **PostgreSQL** : Supporté pour la production et le déploiement Docker.
- **Authentification** : [Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils) avec hachage de mots de passe via **Bcrypt**.
- **Conteneurisation** : Docker & Docker Compose.

---

## 🛠️ Installation et Exécution

### 1. Prérequis
- Node.js (v20+)
- npm ou bun
- Docker (optionnel, pour le mode production)

### 2. Configuration (`.env`)
Créez un fichier `.env` à la racine (ou modifiez l'existant) :

```bash
# Type de base de données : "sqlite" ou "postgres"
DB_TYPE=sqlite
DATABASE_URL=sqlite.db

# Secret pour la session (minimum 32 caractères)
NUXT_SESSION_PASSWORD=votre_secret_tres_long_et_securise
```

### 3. Exécution en mode Développement (Terminal)

```bash
# Installation des dépendances
npm install

# Lancer les migrations (création des tables)
npm run db:push

# Lancer le serveur de développement
npm run dev
```
L'application sera disponible sur `http://localhost:3000`.

---

## 🐳 Exécution via Docker

Docker permet de lancer l'application avec une base de données **PostgreSQL** isolée.

### 1. Lancer l'environnement complète
```bash
docker-compose up -d
```

### 2. Initialiser la base de données (uniquement la première fois)
Une fois les conteneurs lancés, vous devez créer les tables dans le conteneur PostgreSQL :
```bash
docker-compose exec app npm run db:push
```

### 3. Arrêter l'environnement
```bash
docker-compose down
```

---

## 🏗️ Structure du Projet

- `/app` : Code frontend (Pages, Composants, Assets).
- `/server` : Code backend (API, Base de données, Utils).
- `drizzle.config.ts` : Configuration de l'ORM.
- `docker-compose.yml` : Orchestration des services.

---

## 🔐 Sécurité
- Les mots de passe sont hachés avec **Bcrypt**.
- La session est sécurisée via des cookies chiffrés.
- Les accès aux APIs sont protégés par un middleware d'authentification.
