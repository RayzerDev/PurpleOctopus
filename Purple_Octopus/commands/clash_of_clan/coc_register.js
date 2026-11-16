const { MessageFlags, SlashCommandBuilder } = require('discord.js');
const registerGameId = require('../../../function/RegisterGameId');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coc_register')
		.setDescription("Permets d'enregistrer dans la base de donnée son ID Clash of clans")
        .addStringOption(option =>
			option.setName('id_clash_of_clans')
				.setDescription('Votre Id Clash Of Clans (#12345678)')
				.setRequired(true)),

	async execute(interaction, client) {
        const id_coc = interaction.options.getString('id_clash_of_clans').trim().toUpperCase();
        if (!/^#[0-9A-Z]{3,12}$/.test(id_coc)) return interaction.reply({
            content: "Executez la commande de cette manière : '/coc_register #123456789' !",
            flags: MessageFlags.Ephemeral
        });

        const status = await registerGameId(client, interaction.user.id, 'id_coc', id_coc);
        if (status === 'updated') {
            console.log(`${client.Func.LogDate()}L'ID Clash Of Clans de ${interaction.user.username} a été mis à jour !`.green);
            return interaction.reply({ content: 'Votre ID Clash Of Clans a bien été enregistré et mis à jour !', flags: MessageFlags.Ephemeral });
        }
        console.log(`${client.Func.LogDate()}Le joueur ${interaction.user.username} ainsi que son ID Clash Of Clans a bien été enregistré !`.green);
        return interaction.reply({ content: 'Vous êtes enregistré dans la BDD avec votre ID Clash Of Clans !', flags: MessageFlags.Ephemeral });
	},
};
