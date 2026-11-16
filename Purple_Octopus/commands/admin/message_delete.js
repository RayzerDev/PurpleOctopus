const { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription("Supprime jusqu'à 99 messages")
		// Discord masque aussi la commande aux membres sans ce droit.
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false)
		.addIntegerOption(option =>
			option.setName('nombre_messages')
				.setDescription('Nombre de messages à supprimer')
				.setMinValue(1)
				.setMaxValue(99)
				.setRequired(true)),

	async execute(interaction, client) {
		if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({
			content: "Vous n'avez pas les permissions pour faire ça !",
			flags: MessageFlags.Ephemeral
		});
		const nmb_msg = interaction.options.getInteger('nombre_messages');

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		try {
			const deleted = await interaction.channel.bulkDelete(nmb_msg, true);
			return interaction.editReply(`${deleted.size} messages ont été supprimés !`);
		} catch (error) {
			console.error(error);
			return interaction.editReply("Erreur dans l'execution de la commande, réessayez plus tard !");
		}
	},
};
