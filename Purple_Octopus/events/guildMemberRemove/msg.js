const {MessageEmbed} = require('discord.js')

module.exports = {
	name: 'guildMemberRemove',
	once: true,
	async execute(member, client) {
        console.log(`${client.Func.LogDate()}L'utilisateur, ${member.user.username} nous a quitté.`.red)

        const channel_enter = await client.channels.fetch(client.config.Discord.IDSalonServer.Atterissage);
        const user = await client.users.fetch(member.id);
        const embed_exit = new MessageEmbed()
            .setTitle("Triste...")
            .setColor(0xFA5656)
            .setDescription(`${member.user.username} nous a quitté..`)
            .setThumbnail(user.displayAvatarURL({dynamic:true}));
    
        channel_enter.send({embeds: [embed_exit]})
    
        .catch(err => {
            console.log(`Erreur: ${err}`.underline.red)
        });
	},
};