# Image du bot Purple Octopus. Construite et deployee par deploy.sh.
FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
# --ignore-scripts : aucun script d'installation de dependance n'est execute.
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY function/ ./function/
COPY Purple_Octopus/ ./Purple_Octopus/
# config.json (jetons) n'est pas dans l'image : Nomad le monte en lecture seule.
USER node
CMD ["node", "Purple_Octopus/index.js"]
