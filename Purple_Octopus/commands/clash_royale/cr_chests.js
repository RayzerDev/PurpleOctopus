const { EmbedBuilder, MessageFlags, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cr_chests')
		.setDescription('Si vous êtes enregistré, vous pourrez visualiser vos prochains coffres Clash Royale.'),

	async execute(interaction, client) {
		const sql = 'SELECT id_cr FROM ' + client.config.MySQL.tables.User + " WHERE id_user = ? AND id_cr IS NOT NULL AND id_cr != 'NULL' LIMIT 1";
		const [rows] = await client.database.query(sql, [interaction.user.id]);
		if (rows.length === 0) {
			return interaction.reply({
				content: 'Vous devez effectuer la commande /cr_register pour pouvoir vous enregistrer dans la Base de Donnée, et consulter votre profil CR !',
				flags: MessageFlags.Ephemeral
			});
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const { status, data } = await client.Func.ClashApi('api.clashroyale.com', '/upcomingchests', rows[0].id_cr, client.config.TokenClashRoyale)
			.catch(() => ({ status: 0, data: null }));

		if (status === 404) {
			return interaction.editReply("Vous devez enregistrer un autre ID Clash Royale puisque celui-ci n'existe pas !");
		}
		if (status !== 200 || !Array.isArray(data?.items)) {
			return interaction.editReply('Erreur avec cette commande, retentez plus tard ...');
		}

		const emojis = client.emojis.cache;
		const l_fields = data.items.slice(0, 25).map(chest => {
			const chest_name = chest.name.replaceAll(' ', '_');
			const emoji = emojis.find(e => e.name === chest_name);
			const value = emoji ? `<:${chest_name}:${emoji.id}>` : chest.name;
			const name = chest.index === 0 ? 'Prochain coffre' : `${chest.index + 1}ème coffres`;
			return { name, value, inline: true };
		});

		const ChestsEmbed = new EmbedBuilder()
			.setTitle('Clash Royale : Coffres à venir !')
			.setDescription('Vous verrez en dessous les coffres que vous allez pouvoir obtenir à vos prochaines victoires !')
			.setColor(0x3e5bc5)
			.addFields(...l_fields)
			.setThumbnail('https://play-lh.googleusercontent.com/rIvZQ_H3hfmexC8vurmLczLtMNBFtxCEdmb2NwkSPz2ZuJJ5nRPD0HbSJ7YTyFGdADQ');

		return interaction.editReply({ embeds: [ChestsEmbed] });
	},
};
