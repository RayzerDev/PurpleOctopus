const {MessageEmbed} = require('discord.js')

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
        if (interaction.isCommand()){	
            const command = client.commands.get(interaction.commandName);
            if (command) {
    
                try {
                    console.log(`${client.Func.LogDate()}La commande ${interaction.commandName} a été executée par ${interaction.member.user.username}`.blue)
                    await command.execute(interaction, client);
                    const channel_logs = client.channels.cache.find(x => x.id == client.config.Discord.IDSalonServer.Logs)
                    const Embed = new MessageEmbed()
                        .setColor('#4682B4')
                        .setTitle('Commands Manager')
                        .setDescription(`La commande ${interaction.commandName} a été executée par ${interaction.member.user.username}`)
                        .setTimestamp()
                    channel_logs.send({embeds: [Embed]})
                } 
                
                catch (error) {
                    console.error(error);
                    await interaction.reply({ content: "La commande que vous avez essayé de rentrer n'a pas pu s'exécuter !", ephemeral: true });
                }
            }
        }
	},
};