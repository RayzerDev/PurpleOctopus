const { EmbedBuilder, MessageFlags, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Liste les commandes du bot'),

	async execute(interaction, client) {
		// Seules les commandes que le membre a le droit d'utiliser sont listées.
		const lines = [...client.commands.values()]
			.filter(cmd => {
				const needed = cmd.data.default_member_permissions;
				return !needed || interaction.memberPermissions?.has(BigInt(needed));
			})
			.map(cmd => `**/${cmd.data.name}** : ${cmd.data.description}`)
			.sort();

		const embed = new EmbedBuilder()
			.setTitle('Commandes de Purple Octopus')
			.setDescription(lines.join('\n'))
			.setColor(0x3e5bc5);
		return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
	},
};
