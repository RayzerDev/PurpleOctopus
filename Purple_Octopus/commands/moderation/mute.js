const { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription("Rend un membre muet pour une durée donnée (exclusion temporaire de Discord)")
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false)
		.addUserOption(option => option.setName('membre').setDescription('Le membre à rendre muet').setRequired(true))
		.addIntegerOption(option => option.setName('minutes').setDescription('Durée en minutes (28 jours au plus)')
			.setMinValue(1).setMaxValue(40320).setRequired(true))
		.addStringOption(option => option.setName('raison').setDescription('Raison de la sanction').setMaxLength(400)),

	async execute(interaction, client) {
		if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
			return interaction.reply({ content: "Vous n'avez pas les permissions pour faire ça !", flags: MessageFlags.Ephemeral });
		}
		const target = interaction.options.getMember('membre');
		const minutes = interaction.options.getInteger('minutes');
		const reason = interaction.options.getString('raison') ?? 'Aucune raison donnée';

		if (!target) return interaction.reply({ content: "Ce membre n'est pas sur le serveur.", flags: MessageFlags.Ephemeral });
		if (target.id === interaction.user.id || target.user.bot) {
			return interaction.reply({ content: 'Impossible de rendre muet ce compte.', flags: MessageFlags.Ephemeral });
		}
		// moderatable : le bot est au-dessus du membre ; on vérifie aussi la hiérarchie de l'auteur.
		const isOwner = interaction.guild.ownerId === interaction.user.id;
		if (!target.moderatable || (!isOwner && interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)) {
			return interaction.reply({ content: 'Ce membre a un rôle trop élevé pour être rendu muet.', flags: MessageFlags.Ephemeral });
		}

		await target.timeout(minutes * 60 * 1000, `${reason} (par ${interaction.user.username})`);
		await target.send(`Vous avez été rendu muet sur ${interaction.guild.name} pendant ${minutes} min. Raison : ${reason}`).catch(() => {});

		const description = `${target.user.username} est muet pendant ${minutes} min.\nRaison : ${reason}\nPar : ${interaction.user.username}`;
		console.log(`${client.Func.LogDate()}${description.replaceAll('\n', ' | ')}`.yellow);
		client.Func.SendLog('Sanctions', '#FA5656', description, client.config.Discord.IDSalonServer.Sanctions);
		return interaction.reply({ content: `${target} est muet pendant ${minutes} min.`, flags: MessageFlags.Ephemeral });
	},
};
