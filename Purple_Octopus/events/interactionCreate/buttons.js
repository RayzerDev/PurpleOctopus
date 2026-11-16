const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction, client) {
        if (!interaction.isButton()) return;
        const button = client.buttons.get(interaction.customId);
        if (!button) return;

        try {
            console.log(`${client.Func.LogDate()}Le bouton ${button.name} a été executée par ${interaction.user.username}`.blue);
            await button.execute(interaction, client);
            client.Func.SendLog('Buttons Manager', '#4682B4', `Le bouton ${button.name} a été executée par ${interaction.user.username}`);
        } catch (error) {
            console.error(error);
            const answer = { content: "Le bouton avec lequel vous avez essayé d'intéragir n'a pas pu répondre.", flags: MessageFlags.Ephemeral };
            await (interaction.replied || interaction.deferred ? interaction.followUp(answer) : interaction.reply(answer)).catch(() => {});
        }
	},
};
