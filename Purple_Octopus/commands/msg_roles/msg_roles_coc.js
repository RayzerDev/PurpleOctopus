const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, SlashCommandBuilder } = require('discord.js');
const isAdmin = require('../../../function/IsAdmin');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('msg_roles_coc')
		.setDescription('Permets de publier le message pour récupérer son rôle Clash Of Clans !'),

	async execute(interaction, client) {
        if (!await isAdmin(client, interaction.user.id)) {
            return interaction.reply({ content: 'Vous ne pouvez utiliser cette commande', flags: MessageFlags.Ephemeral });
        }

        const cocEmbed = new EmbedBuilder()
            .setTitle('Le Clan Golazo sur Clash Of CLans ')
            .setDescription(`Appuyez sur le bouton "Ajouter le rôle" afin de vérifier que vous êtes bien dans le clan, pour vous donner le rôle coc ! \n
            Si vous n'êtes pas enregsitré dans la base de donnée, faîtes la commande /coc_register avec votre ID Clash Of Clans pour pouvoir vosu associer avec le seveur ! \n
            Si vous n'êtes pas dans le clan, cliquez sur le lien du Clan pour pouvoir rejoindre celui-ci !`)
            .setColor(0xDC143C)
            .setThumbnail('https://api-assets.clashofclans.com/badges/512/jkRzaPicUqoJ0KtXxOioRDMT7sVoB0sMd6KY0AIQYKs.png');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('check_role_coc')
                    .setLabel('Ajouter le rôle')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://link.clashofclans.com/fr?action=OpenClanProfile&tag=2CV2P82C')
                    .setLabel('Lien du Clan')
            );

        await interaction.channel.send({ embeds: [cocEmbed], components: [row] });
        return interaction.reply({ content: 'Le message a bien été publié !', flags: MessageFlags.Ephemeral });
	},
};
