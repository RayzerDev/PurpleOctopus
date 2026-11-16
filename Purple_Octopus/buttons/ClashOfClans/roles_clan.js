const { MessageFlags } = require('discord.js');

module.exports = {
	name: 'check_role_coc',

	async execute(interaction, client) {
        const sql = 'SELECT id_coc FROM ' + client.config.MySQL.tables.User + " WHERE id_user = ? AND id_coc IS NOT NULL AND id_coc != 'NULL' LIMIT 1";
        const [rows] = await client.database.query(sql, [interaction.user.id]);
        if (rows.length === 0) {
            return interaction.reply({
                content: 'Vous devez effectuer la commande /coc_register pour pouvoir vous enregistrer dans la Base de Donnée, et obtenir le rôle coc !',
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const { status, data } = await client.Func.ClashApi('api.clashofclans.com', '', rows[0].id_coc, client.config.TokenClashOfClan)
            .catch(() => ({ status: 0, data: null }));

        if (status === 404) {
            return interaction.editReply("Vous devez enregistrer un autre ID Clash Of Clans puisque celui-ci n'existe pas !");
        }
        if (status !== 200 || !data) {
            return interaction.editReply('Erreur avec cette commande, retentez plus tard ...');
        }
        if (data.clan?.tag !== client.config.ClashOfClans.id_clan) {
            return interaction.editReply('Vous ne faîtes pas parti du clan !');
        }

        for (const role of client.config.ClashOfClans.roles_clan) {
            if (!interaction.member.roles.resolve(role)) {
                await interaction.member.roles.add(role);
            }
        }
        return interaction.editReply('Vos rôles ont bien été mis à jour !');
	},
};
