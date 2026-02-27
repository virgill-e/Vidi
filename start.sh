#!/bin/sh

echo "⏳ Attente de la base de données PostgreSQL..."

# On utilise npx pour appeler drizzle-kit et tester la connexion
# On boucle jusqu'à ce que la base réponde
until npx drizzle-kit push --force > /dev/null 2>&1; do
  echo "... la base n'est pas encore prête, nouvelle tentative dans 2s ..."
  sleep 2
done

echo "✅ Base de données synchronisée avec succès !"

echo "🚀 Démarrage de l'application sur le port $PORT..."
node .output/server/index.mjs
