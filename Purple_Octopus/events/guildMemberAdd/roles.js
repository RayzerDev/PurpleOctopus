const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member, client) {
        await member.roles.add(client.config.Discord.IDRoleServer.Base)
            .then(mbr => console.log(`${client.Func.LogDate()}Les rôles de base ont été attribué à ${mbr.user.username} !`.green))
            .catch(err => console.log(`${client.Func.LogDate()}Erreur d'attribution : ${err}`.underline.red));
	},
};
