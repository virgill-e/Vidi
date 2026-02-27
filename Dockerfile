# Étape de construction
FROM node:20-slim AS builder

WORKDIR /src

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build
COPY . .
RUN npm run build

# Étape d'exécution
FROM node:20-slim

WORKDIR /app

# On a besoin des fichiers sources de la DB pour drizzle-kit push
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/drizzle.config.ts ./
COPY --from=builder /src/server/database ./server/database
COPY --from=builder /src/.output ./.output

# Installation des outils nécessaires pour le runtime
RUN npm install drizzle-kit postgres better-sqlite3

ENV HOST=0.0.0.0
ENV PORT=3018
ENV NODE_ENV=production

EXPOSE 3018

# On lance la commande start:prod définie dans package.json
# Elle fait : push des tables PUIS démarrage de l'app
CMD ["npm", "run", "start:prod"]
