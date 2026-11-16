const { ActionRowBuilder, EmbedBuilder, MessageFlags, SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js');
const isAdmin = require('../../../function/IsAdmin');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('msg_roles_grades')
		.setDescription('Permets de publier le message pour récupérer les rôles grades !'),

	async execute(interaction, client) {
        if (!await isAdmin(client, interaction.user.id)) {
            return interaction.reply({ content: 'Vous ne pouvez utiliser cette commande', flags: MessageFlags.Ephemeral });
        }

        const [grades] = await client.database.query('SELECT * FROM t_roles_grades');
        if (grades.length === 0) {
            return interaction.reply({ content: "Aucun rôle grade n'est configuré dans la base.", flags: MessageFlags.Ephemeral });
        }
        const l_options = grades.slice(0, 25).map(grade => ({
            emoji: grade.emoji,
            label: grade.name,
            description: grade.description,
            value: grade.id_role,
        }));

        const gradesEmbed = new EmbedBuilder()
            .setTitle('Roles grades')
            .setDescription(`Selectionnez depuis le menu en dessous les rôles que vous voulez ajouter, ou retirer \n
            A noter que si vous selectionnez un rôle que vous avez déjà, celui-ci vous sera retiré`)
            .setColor(0x3e5bc5)
            .setThumbnail('https://cdn.discordapp.com/emojis/988738678396428318.gif');

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('roles_grades')
                    .setPlaceholder("C'est ici pour voir les rôles dispos !")
                    .setMinValues(1)
                    .addOptions(l_options),
            );

        await interaction.channel.send({ embeds: [gradesEmbed], components: [row] });
        return interaction.reply({ content: 'Le message a bien été publié !', flags: MessageFlags.Ephemeral });
	},
};
