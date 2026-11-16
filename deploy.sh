#!/usr/bin/env bash
# deploy.sh
# Parameters
#     Aucun. Lance par le workflow Deploy sur le runner "purple-prod" (serveur
#     ideapad), a la racine du depot. NOMAD_TOKEN vient du fichier .env du runner.
# What it does
#     Construit l'image du bot etiquetee avec le hash du commit, la pousse dans
#     le registre local, puis relance le job Nomad avec cette etiquette. La
#     commande nomad attend la fin du deploiement ; Nomad revient tout seul a
#     la version precedente si le bot ne demarre pas.
# Output
#     Messages de Docker et de Nomad ; code de sortie non nul en cas d'echec.
set -euo pipefail

tag=$(git rev-parse --short HEAD)
image="localhost:5000/purple-octopus:$tag"

docker build -t "$image" .
docker push "$image"
/usr/local/bin/nomad job run -var "image_tag=$tag" nomad/purple-octopus.nomad.hcl
