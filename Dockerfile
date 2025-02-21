# Utilise une image de base légère avec Node.js
FROM node:20.15-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port 80 directement
EXPOSE 80

# Démarrer l'application sur le port 80
CMD ["npm", "run", "start", "--", "-p", "80"]