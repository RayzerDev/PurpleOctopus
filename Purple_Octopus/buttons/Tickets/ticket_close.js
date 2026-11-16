const { MessageFlags } = require('discord.js');
const tickets = require('../../../function/Tickets');

module.exports = {
	name: 'ticket_close',

	async execute(interaction, client) {
        const table = client.config.MySQL.tables.Ticket;
        const [rows] = await client.database.query('SELECT id_ticket, id_author FROM ' + table + ' WHERE id_salon = ?', [interaction.channelId]);
        if (rows.length === 0) {
            return interaction.reply({ content: "Ce salon n'est pas un ticket ouvert.", flags: MessageFlags.Ephemeral });
        }
        const staffRoles = Object.values(client.config.Discord.IDRoleServer.Admin);
        if (!tickets.canClose(interaction.member, rows[0].id_author, staffRoles)) {
            return interaction.reply({ content: "Seuls l'auteur du ticket et l'équipe peuvent le fermer.", flags: MessageFlags.Ephemeral });
        }

        await interaction.reply('Ticket fermé : le salon sera supprimé dans 5 secondes.');
        await client.database.query('DELETE FROM ' + table + ' WHERE id_ticket = ?', [rows[0].id_ticket]);
        const name = interaction.channel.name;
        console.log(`${client.Func.LogDate()}Ticket ${name} fermé par ${interaction.user.username}`.cyan);
        client.Func.SendLog('Tickets Manager', '#FA5656', `Ticket ${name} fermé par ${interaction.user.username}`);

        setTimeout(() => {
            interaction.channel.delete().catch(err => console.error(`${client.Func.LogDate()}Suppression du ticket ${name} impossible :`, err));
        }, 5000);
	},
};
