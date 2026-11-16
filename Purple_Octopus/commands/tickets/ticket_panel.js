const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, SlashCommandBuilder } = require('discord.js');
const isAdmin = require('../../../function/IsAdmin');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket_panel')
		.setDescription("Publie le message qui permet d'ouvrir un ticket (les tickets seront créés dans cette catégorie)")
		.setDMPermission(false),

	async execute(interaction, client) {
        if (!await isAdmin(client, interaction.user.id)) {
            return interaction.reply({ content: 'Vous ne pouvez utiliser cette commande', flags: MessageFlags.Ephemeral });
        }

        const embed = new EmbedBuilder()
            .setTitle("Besoin d'aide ?")
            .setDescription("Cliquez sur le bouton en dessous pour ouvrir un ticket : un salon privé avec l'équipe du serveur sera créé pour vous.")
            .setColor(0x3e5bc5);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_open')
                .setLabel('Ouvrir un ticket')
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        return interaction.reply({ content: 'Le message a bien été publié !', flags: MessageFlags.Ephemeral });
	},
};
