module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute(member, client) {
        member.roles.add(client.config.Discord.IDRoleServer.Base)

        .then(mbr => {
            console.log(`${client.Func.LogDate()}Les rôles de base ont été attribué à ${mbr.user.username} !`.green)
        }).catch(err => {
            console.log(`${client.Func.LogDate()}Erreur d'attribution : ${err}`.underline.red)
        });
	},
};