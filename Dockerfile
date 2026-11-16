# Image du bot Purple Octopus. Construite et deployee par deploy.sh.
FROM node:26-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
# --ignore-scripts : aucun script d'installation de dependance n'est execute.
# Ensuite : correctifs Alpine (apk upgrade) et suppression de npm, inutile au
# demarrage du bot et dont les dependances embarquees ont des failles connues.
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force \
    && apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY function/ ./function/
COPY Purple_Octopus/ ./Purple_Octopus/
# config.json (jetons) n'est pas dans l'image : Nomad le monte en lecture seule.
USER node
CMD ["node", "Purple_Octopus/index.js"]
