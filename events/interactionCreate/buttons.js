const {MessageEmbed} = require('discord.js')
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
        if (interaction.isButton()){	
            const button = client.buttons.get(interaction.customId);
            if (button) {
    
                try {
                    console.log(`${client.Func.LogDate()}Le bouton ${button.name} a été executée par ${interaction.member.user.username}`.blue)
                    await button.execute(interaction, client);
                    const channel_logs = client.channels.cache.find(x => x.id == client.config.Discord.IDSalonServer.Logs)
                    const Embed = new MessageEmbed()
                        .setColor('#4682B4')
                        .setTitle('Buttons Manager')
                        .setDescription(`Le bouton ${button.name} a été executée par ${interaction.member.user.username}`)
                        .setTimestamp()
                    channel_logs.send({embeds: [Embed]})
                } 
                
                catch (error) {
                    console.error(error);
                    await interaction.reply({ content: "Le bouton avec lequel vous avez essayé d'intéragir n'a pas pu répondre.", ephemeral: true });
                }
            }
        }
	},
};