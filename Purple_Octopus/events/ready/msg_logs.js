const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        const channel_logs = client.channels.cache.find(x => x.id == client.config.Discord.IDSalonServer.Logs)
        const Embed = new MessageEmbed()
            .setColor('#4FAB4F')
            .setTitle('Information de PurpleOctopus')
            .setDescription('Le bot vient de redémarrer !')
            .setTimestamp()
        channel_logs.send({embeds: [Embed]})
    
        console.log(`${client.Func.LogDate()}Bot lancé !`.inverse);
	},
};