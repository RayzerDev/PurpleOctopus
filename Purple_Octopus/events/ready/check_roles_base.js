const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const guild_night_club = client.guilds.resolve(client.config.Discord.IDGuild.NightClub);
		const mbrs = await guild_night_club.members.fetch();

		for (const mbr of mbrs.values()) {
			if (mbr.user.bot) continue;
			for (const role of client.config.Discord.IDRoleServer.Base) {
				if (mbr.roles.resolve(role)) continue;
				const role_name = guild_night_club.roles.resolve(role)?.name ?? role;
				await mbr.roles.add(role)
					.then(() => console.log(`${client.Func.LogDate()}Le rôle ${role_name} a été réattribué à ${mbr.user.username} !`.green))
					.catch(err => console.log(`${client.Func.LogDate()}Erreur d'attribution : ${err}`.underline.red));
			}
		}
		console.log(`${client.Func.LogDate()}Vérification des rôles de base terminée !`.inverse);
	},
};
