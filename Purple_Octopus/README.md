# Purple_Octopus
BOT sous l'API Discord.JS, déployé avec NodeJS !

Plusieurs fonctionnalités ne sont pas encore déployée !

## Fonctionnalités

- `/help` : liste les commandes que le membre peut utiliser.
- **Tickets** : `/ticket_panel` (admin) publie un bouton « Ouvrir un ticket ». Il crée un salon privé (auteur, rôles Administrateur et Modérateur) dans la catégorie du panneau, avec un bouton « Fermer ». Un ticket ouvert par membre, enregistré dans `t_ticket`.
- **Modération** : `/mute membre minutes [raison]` et `/unmute membre` utilisent l'exclusion temporaire de Discord. Ils sont réservés aux membres qui peuvent modérer, et laissent une trace dans le salon Sanctions. `/delete` efface jusqu'à 99 messages.
- **Salons vocaux** : rejoindre le salon « créer un vocal » crée un salon dont le créateur gère le nom, les places et les membres. Le salon est supprimé quand il est vide.
- **Rôles** : `/msg_roles_grades` (menu des grades de `t_roles_grades`) et `/msg_roles_coc` (rôle du clan Clash of Clans).
- **Clash** : `/coc_register`, `/cr_register`, `/cr_chests`, limités à une demande toutes les 10 s par membre.
- Admin (`admin_lvl` 3) : `/restart_bot`, `/stop_bot`.

Tests : `npm test`.

## Déploiement (serveur ideapad, Nomad)

- `Dockerfile` (racine du dépôt) : image Node 22 avec `Purple_Octopus/`, `function/` et les dépendances.
- `nomad/purple-octopus.nomad.hcl` : job du bot et de sa base MariaDB.
- `db/schema.sql` : structure de la base, sans données. Le fichier réellement monté est `/opt/purple-octopus/init.sql` sur le serveur ; MariaDB ne le lit qu'à la création de la base.
- Secrets, jamais dans le dépôt :
  - jetons du bot : `/opt/purple-octopus/config.json` sur le serveur, monté en lecture seule ;
  - mots de passe MariaDB : variable Nomad `nomad/jobs/purple-octopus` (`MARIADB_ROOT_PASSWORD`, `MARIADB_PASSWORD`).

Déploiement automatique : chaque push sur `master` lance le workflow `Deploy`. Il vérifie la syntaxe sur GitHub, puis lance `deploy.sh` sur le runner `purple-prod` du serveur : construction de l'image, puis job Nomad. On peut aussi le relancer à la main depuis l'onglet Actions (« Run workflow »).
