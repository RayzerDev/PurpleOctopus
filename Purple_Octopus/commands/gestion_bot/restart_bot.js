const { MessageFlags, SlashCommandBuilder } = require('discord.js');
const isAdmin = require('../../../function/IsAdmin');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart_bot')
		.setDescription('Permets de redémarrer le bot'),

	async execute(interaction, client) {
        if (!await isAdmin(client, interaction.user.id)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de faire ça !", flags: MessageFlags.Ephemeral });
        }

        await interaction.reply({ content: 'Redémarrage en cours du bot ...', flags: MessageFlags.Ephemeral });
        console.log(`${client.Func.LogDate()}Redémarrage demandé par ${interaction.user.username}`.yellow);
        // Le bot s'arrête ; Nomad le relance tout seul quelques secondes plus tard.
        await client.destroy();
        process.exit(0);
	},
};
