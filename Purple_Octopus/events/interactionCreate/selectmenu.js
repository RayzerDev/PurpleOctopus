const {MessageEmbed} = require('discord.js')
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
        if (interaction.isSelectMenu()){
            const selectmenu = client.selectmenus.get(interaction.customId);
            if (selectmenu) {
    
                try {
                    console.log(`${client.Func.LogDate()}Le menu ${selectmenu.name} a été utilisé par ${interaction.member.user.username}`.blue)
                    await selectmenu.execute(interaction, client);
                    const channel_logs = client.channels.cache.find(x => x.id == client.config.Discord.IDSalonServer.Logs)
                    const Embed = new MessageEmbed()
                        .setColor('#4682B4')
                        .setTitle('Select Menus Manager')
                        .setDescription(`Le menu ${selectmenu.name} a été utilisé par ${interaction.member.user.username}`)
                        .setTimestamp()
                    channel_logs.send({embeds: [Embed]})
                } 
                
                catch (error) {
                    console.error(error);
                    await interaction.reply({ content: "Le menu avec lequel vous avez essayé d'intéragir n'a pas pu répondre.", ephemeral: true });
                }
            }
        }
	},
};