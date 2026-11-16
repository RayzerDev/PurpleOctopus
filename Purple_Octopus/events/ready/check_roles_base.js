
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		const guild_night_club = client.guilds.resolve(client.config.Discord.IDGuild.NightClub)
		
		guild_night_club.members.fetch().then(mbrs => {
			mbrs.forEach(mbr => {
				if (mbr.user.bot) return;
				for (role of client.config.Discord.IDRoleServer.Base){
					if (!mbr.roles.resolve(role)){
						const role_name = guild_night_club.roles.resolve(role).name
						mbr.roles.add(role)        
							.then(mbr => {
							console.log(`${client.Func.LogDate()}Le rôle ${role_name} a été réattribué à ${mbr.user.username} !`.green)
						})
	
						.catch(err => {
							console.log(`${client.Func.LogDate()}Erreur d'attribution : ${err}`.underline.red)
						});
					}
				}
			})
		})
		console.log(`${client.Func.LogDate()}Vérification des rôles de base terminée !`.inverse)
	},
};