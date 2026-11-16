# Job Nomad du bot et de sa base MariaDB (serveur ideapad). Lance par deploy.sh.
# Les mots de passe de la base ne sont pas ici : ils sont dans la variable Nomad
# nomad/jobs/purple-octopus (cles MARIADB_ROOT_PASSWORD et MARIADB_PASSWORD).
# Les jetons du bot sont dans /opt/purple-octopus/config.json sur le serveur.

variable "image_tag" {
  type    = string
  default = "latest"
}

job "purple-octopus" {
  datacenters = ["dc1"]
  type        = "service"

  group "bot" {
    count = 1

    network {
      mode = "bridge"
      dns {
        servers = ["1.1.1.1", "8.8.8.8"]
      }
      # Pas de port publie : le bot joint MariaDB par 127.0.0.1 dans le reseau
      # du groupe, et la sauvegarde passe par docker exec.
    }

    restart {
      attempts = 5
      interval = "5m"
      delay    = "15s"
      mode     = "delay"
    }

    update {
      max_parallel     = 1
      min_healthy_time = "10s"
      healthy_deadline = "3m"
      auto_revert      = true
    }

    ephemeral_disk {
      migrate = true
      size    = 500
    }

    task "db-mysql" {
      driver = "docker"
      config {
        image = "mariadb:10.11"
        volumes = [
          "/opt/purple-octopus/init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro",
          "/opt/purple-octopus/mysql-data:/var/lib/mysql"
        ]
        security_opt = ["no-new-privileges"]
        logging {
          type = "json-file"
          config {
            max-size = "10m"
            max-file = "3"
          }
        }
      }
      env {
        MARIADB_DATABASE = "discord_night_club"
        MARIADB_USER     = "bot_discord_purple"
      }
      template {
        destination = "secrets/db.env"
        env         = true
        data        = <<EOF
{{ with nomadVar "nomad/jobs/purple-octopus" }}
MARIADB_ROOT_PASSWORD={{ .MARIADB_ROOT_PASSWORD }}
MARIADB_PASSWORD={{ .MARIADB_PASSWORD }}
{{ end }}
EOF
      }
      resources {
        cpu    = 500
        memory = 256
      }
      service {
        name     = "purple-octopus-db"
        provider = "nomad"
      }
    }

    task "discord-bot" {
      driver = "docker"
      config {
        image = "localhost:5000/purple-octopus:${var.image_tag}"
        volumes = [
          "/opt/purple-octopus/config.json:/usr/src/app/Purple_Octopus/config.json:ro"
        ]
        # Le bot n'ecrit rien sur disque et n'a besoin d'aucun privilege.
        readonly_rootfs = true
        cap_drop        = ["all"]
        security_opt    = ["no-new-privileges"]
        logging {
          type = "json-file"
          config {
            max-size = "10m"
            max-file = "3"
          }
        }
      }
      resources {
        cpu        = 256
        memory     = 128
        memory_max = 256
      }
      service {
        name     = "purple-octopus"
        provider = "nomad"
      }
    }
  }
}
