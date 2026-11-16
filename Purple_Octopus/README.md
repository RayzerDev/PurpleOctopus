# Purple_Octopus
BOT sous l'API Discord.JS, déployé avec NodeJS !

Plusieurs fonctionnalités ne sont pas encore déployée !

## Déploiement (serveur ideapad, Nomad)

- `Dockerfile` (racine du dépôt) : image Node 22 avec `Purple_Octopus/`, `function/` et les dépendances.
- `nomad/purple-octopus.nomad.hcl` : job du bot et de sa base MariaDB.
- `db/schema.sql` : structure de la base, sans données. Le fichier réellement monté est `/opt/purple-octopus/init.sql` sur le serveur ; MariaDB ne le lit qu'à la création de la base.
- Secrets, jamais dans le dépôt :
  - jetons du bot : `/opt/purple-octopus/config.json` sur le serveur, monté en lecture seule ;
  - mots de passe MariaDB : variable Nomad `nomad/jobs/purple-octopus` (`MARIADB_ROOT_PASSWORD`, `MARIADB_PASSWORD`).

Pour déployer le dernier commit : `./deploy.sh` depuis Git Bash, à la racine du dépôt.
