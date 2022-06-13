const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription("Supprime jusqu'à 99 messages")
		.addIntegerOption(option => 
			option.setName('nombre_messages')
				.setDescription('Nombre de messages à supprimer')
				.setRequired(true)),

	async execute(interaction, client) {
		if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ 
			content: "Vous n'avez pas les permissions pour faire ça !",
			ephemeral: true 
		});
		const nmb_msg = interaction.options.getInteger('nombre_messages');

		if (nmb_msg < 1 || nmb_msg > 99) {
			return interaction.reply({ content: 'Vous devez insérer un nombre entre 1 et 99', ephemeral: true });
		}
		await interaction.channel.bulkDelete(nmb_msg, true).catch(error => {
			console.error(error);
			return interaction.reply({ 
				content: "Erreur dans l'execution de la commande, réessayez plus tard !", 
				ephemeral: true 
			});
		});

		return interaction.reply({ 
			content: `${nmb_msg} messages ont été supprimés !`, 
			ephemeral: true 
		});
	},
};