const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const tickets = require('../../../function/Tickets');

module.exports = {
	name: 'ticket_open',
	cooldown: 30,

	async execute(interaction, client) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const existing = await tickets.findOpen(client, interaction.user.id);
        if (existing) {
            return interaction.editReply(`Vous avez déjà un ticket ouvert : ${existing}`);
        }

        const channel = await tickets.open(interaction, client);
        const staff = Object.values(client.config.Discord.IDRoleServer.Admin).map(id => `<@&${id}>`).join(' ');
        const embed = new EmbedBuilder()
            .setTitle('Ticket ouvert')
            .setDescription(`Bonjour ${interaction.user}, expliquez votre demande ici : l'équipe vous répondra dès que possible.\nCliquez sur « Fermer » quand c'est réglé.`)
            .setColor(0x60D15B);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_close')
                .setLabel('Fermer')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Danger)
        );
        await channel.send({ content: staff, embeds: [embed], components: [row] });

        console.log(`${client.Func.LogDate()}Ticket ouvert par ${interaction.user.username}`.cyan);
        client.Func.SendLog('Tickets Manager', '#60D15B', `Ticket ${channel} ouvert par ${interaction.user.username}`);
        return interaction.editReply(`Votre ticket est ouvert : ${channel}`);
	},
};
