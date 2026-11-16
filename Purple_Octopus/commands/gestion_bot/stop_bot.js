const { MessageFlags, SlashCommandBuilder } = require('discord.js');
const isAdmin = require('../../../function/IsAdmin');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop_bot')
		.setDescription('Permets de stopper le bot'),

	async execute(interaction, client) {
        if (!await isAdmin(client, interaction.user.id)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de faire ça !", flags: MessageFlags.Ephemeral });
        }

        await interaction.reply({
            content: 'Arrêt du bot en cours ... Il reviendra au prochain redémarrage du serveur ou déploiement.',
            flags: MessageFlags.Ephemeral
        });
        console.log(`${client.Func.LogDate()}Arrêt demandé par ${interaction.user.username}`.yellow);
        // Déconnexion de Discord sans quitter le processus : sinon Nomad relancerait le bot aussitôt.
        await client.destroy();
        setInterval(() => {}, 1 << 30);
	},
};
