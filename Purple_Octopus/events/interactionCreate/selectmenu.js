const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;
        const selectmenu = client.selectmenus.get(interaction.customId);
        if (!selectmenu) return;

        try {
            console.log(`${client.Func.LogDate()}Le menu ${selectmenu.name} a été utilisé par ${interaction.user.username}`.blue);
            await selectmenu.execute(interaction, client);
            client.Func.SendLog('Select Menus Manager', '#4682B4', `Le menu ${selectmenu.name} a été utilisé par ${interaction.user.username}`);
        } catch (error) {
            console.error(error);
            const answer = { content: "Le menu avec lequel vous avez essayé d'intéragir n'a pas pu répondre.", flags: MessageFlags.Ephemeral };
            await (interaction.replied || interaction.deferred ? interaction.followUp(answer) : interaction.reply(answer)).catch(() => {});
        }
	},
};
