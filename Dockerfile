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

# On a besoin de ces fichiers pour que drizzle-kit puisse faire le push au démarrage
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/drizzle.config.ts ./
COPY --from=builder /src/server/database ./server/database
COPY --from=builder /src/.output ./.output
COPY --from=builder /src/start.sh ./start.sh

# Installation de drizzle-kit et des drivers dans l'image finale
RUN npm install drizzle-kit postgres better-sqlite3

# Permissions pour le script
RUN chmod +x start.sh

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# On utilise le script de démarrage au lieu de lancer node directement
CMD ["./start.sh"]
