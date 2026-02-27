#!/bin/sh

# On attend un tout petit peu pour que postgres soit totalement prêt à recevoir des commandes
echo "Attente de la base de données..."
sleep 2

# On pousse le schéma vers la base de données
echo "Exécution de db:push..."
npx drizzle-kit push

# On lance l'application Nuxt
echo "Démarrage de l'application..."
node .output/server/index.mjs
