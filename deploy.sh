#!/usr/bin/env bash
# deploy.sh
# Parameters
#     Aucun. A lancer depuis la racine du depot (Git Bash), avec l'alias SSH
#     "monserveur" configure.
# What it does
#     Envoie le dernier commit (pas les fichiers non commites) au serveur,
#     y construit l'image etiquetee avec le hash du commit, la pousse dans le
#     registre local, puis relance le job Nomad avec cette etiquette. Nomad
#     revient tout seul a la version precedente si le bot ne demarre pas.
# Output
#     Messages de Docker et de Nomad ; code de sortie non nul en cas d'echec.
set -euo pipefail

tag=$(git rev-parse --short HEAD)
image="localhost:5000/purple-octopus:$tag"

if ! git diff --quiet HEAD --; then
  echo "Attention : des modifications non commitees ne seront pas deployees."
fi

echo "Construction de $image sur le serveur..."
git archive --format=tar HEAD | ssh monserveur "docker build -q -t $image - && docker push -q $image"

echo "Lancement du job Nomad..."
ssh monserveur "NOMAD_TOKEN=\$(cat ~/.nomad-token) /usr/local/bin/nomad job run -var image_tag=$tag -" \
  < nomad/purple-octopus.nomad.hcl
