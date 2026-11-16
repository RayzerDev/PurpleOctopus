const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            console.log(`${client.Func.LogDate()}La commande ${interaction.commandName} a été executée par ${interaction.user.username}`.blue);
            await command.execute(interaction, client);
            client.Func.SendLog('Commands Manager', '#4682B4', `La commande ${interaction.commandName} a été executée par ${interaction.user.username}`);
        } catch (error) {
            console.error(error);
            const answer = { content: "La commande que vous avez essayé de rentrer n'a pas pu s'exécuter !", flags: MessageFlags.Ephemeral };
            await (interaction.replied || interaction.deferred ? interaction.followUp(answer) : interaction.reply(answer)).catch(() => {});
        }
	},
};
