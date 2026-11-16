const { MessageFlags, SlashCommandBuilder } = require('discord.js');
const registerGameId = require('../../../function/RegisterGameId');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cr_register')
		.setDescription("Permets d'enregistrer dans la base de donnée son ID Clash Royale pour la commande /cr_chests")
        .addStringOption(option =>
			option.setName('id_clash_royale')
				.setDescription('Votre Id Clash Royale (#12345678)')
				.setRequired(true)),

	async execute(interaction, client) {
        const id_cr = interaction.options.getString('id_clash_royale').trim().toUpperCase();
        if (!/^#[0-9A-Z]{3,12}$/.test(id_cr)) return interaction.reply({
            content: "Executez la commande de cette manière : '/cr_register #12345678' !",
            flags: MessageFlags.Ephemeral
        });

        const status = await registerGameId(client, interaction.user.id, 'id_cr', id_cr);
        if (status === 'updated') {
            console.log(`${client.Func.LogDate()}L'ID Clash Royale de ${interaction.user.username} a été mis à jour !`.green);
            return interaction.reply({
                content: "Votre ID Clash Royale a bien été enregistré ! Executez la commande '/cr_chests' pour voir vos futurs coffres !",
                flags: MessageFlags.Ephemeral
            });
        }
        console.log(`${client.Func.LogDate()}Le joueur ${interaction.user.username} ainsi que son ID Clash Royale a bien été enregistré !`.green);
        return interaction.reply({
            content: "Vous êtes enregistré dans la BDD ainsi que votre ID Clash Royale ! Executez la commande '/cr_chests' pour voir vos futurs coffres !",
            flags: MessageFlags.Ephemeral
        });
	},
};
