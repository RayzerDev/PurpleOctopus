const {MessageEmbed} = require('discord.js')

module.exports = {
	name: 'guildMemberAdd',
	once: true,
	async execute(member, client) {
        const channel_enter = await client.channels.fetch(client.config.Discord.IDSalonServer.Atterissage);
        const user = await client.users.fetch(member.id);
        const embed_enter = new MessageEmbed()
            .setTitle("Arrivée d'un nouveau membre !")
            .setColor(0x60D15B)
            .setDescription(`Bienvenue sur le serveur, ${member.user.username} !`)
            .setThumbnail(user.displayAvatarURL({dynamic:true}));
        channel_enter.send({embeds: [embed_enter]});
    
        console.log(`${client.Func.LogDate()}L'utilisateur, ${member.user.username} a rejoint le serveur !`.green)
	},
};