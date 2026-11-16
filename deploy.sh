#!/usr/bin/env bash
# deploy.sh
# Parameters
#     Aucun. Lance par le workflow Deploy sur le runner "purple-prod" (serveur
#     ideapad), a la racine du depot. NOMAD_TOKEN vient du fichier .env du runner.
# What it does
#     Construit l'image du bot avec la derniere image Node 26 (--pull, pour
#     recuperer ses correctifs de securite), l'etiquette avec le hash du commit
#     et la date, la pousse dans le registre local, puis relance le job Nomad
#     avec cette etiquette. La commande nomad attend la fin du deploiement ;
#     Nomad revient tout seul a la version precedente si le bot ne demarre pas.
# Output
#     Messages de Docker et de Nomad ; code de sortie non nul en cas d'echec.
set -euo pipefail

# La date dans l'etiquette force un redeploiement lors des reconstructions
# hebdomadaires, meme sans nouveau commit.
tag="$(git rev-parse --short HEAD)-$(date +%Y%m%d%H%M)"
image="localhost:5000/purple-octopus:$tag"

docker build --pull -t "$image" .
docker push "$image"
/usr/local/bin/nomad job run -var "image_tag=$tag" nomad/purple-octopus.nomad.hcl

# Garde les 3 images les plus recentes sur le serveur (retour arriere possible).
docker images localhost:5000/purple-octopus --format '{{.Tag}}' | tail -n +4 \
  | xargs -r -I{} docker image rm "localhost:5000/purple-octopus:{}" >/dev/null || true
