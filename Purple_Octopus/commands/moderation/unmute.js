const { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription("Rend la parole à un membre muet")
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false)
		.addUserOption(option => option.setName('membre').setDescription('Le membre à qui rendre la parole').setRequired(true)),

	async execute(interaction, client) {
		if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
			return interaction.reply({ content: "Vous n'avez pas les permissions pour faire ça !", flags: MessageFlags.Ephemeral });
		}
		const target = interaction.options.getMember('membre');
		if (!target) return interaction.reply({ content: "Ce membre n'est pas sur le serveur.", flags: MessageFlags.Ephemeral });
		if (!target.isCommunicationDisabled()) {
			return interaction.reply({ content: "Ce membre n'est pas muet.", flags: MessageFlags.Ephemeral });
		}

		await target.timeout(null, `Fin de sanction (par ${interaction.user.username})`);
		const description = `${target.user.username} peut de nouveau parler.\nPar : ${interaction.user.username}`;
		console.log(`${client.Func.LogDate()}${description.replaceAll('\n', ' | ')}`.yellow);
		client.Func.SendLog('Sanctions', '#60D15B', description, client.config.Discord.IDSalonServer.Sanctions);
		return interaction.reply({ content: `${target} peut de nouveau parler.`, flags: MessageFlags.Ephemeral });
	},
};
