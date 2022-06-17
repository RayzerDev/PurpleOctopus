const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Permets de savoir si le bot est opérationel !'),
		
	async execute(interaction, client) {
		await interaction.reply({
			content : 'Je suis opérationel !', 
			ephemeral: true
		});
	},
};