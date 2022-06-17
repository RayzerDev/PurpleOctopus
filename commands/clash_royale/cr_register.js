const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cr_register')
		.setDescription("Permets d'enregistrer dans la base de donnée son ID Clash Royale pour la commande /cr_chests")
        .addStringOption(option => 
			option.setName('id_clash_royale')
				.setDescription('Votre Id Clash Royale (#12345678)')
				.setRequired(true)),

	async execute(interaction, client) {
        const id_cr = interaction.options.getString('id_clash_royale');
        if (id_cr[0] != '#' || id_cr.length > 10) return interaction.reply({
            content : "Executez la commande de cette manière : '/cr_register #12345678' !", 
            ephemeral: true
        });

        const sql = 'SELECT * FROM ' + client.config.MySQL.tables.User + ' WHERE id_user = ' + interaction.member.id
        
        client.database.query(sql, function(err,rslt){

            rslt.forEach(user => {
                var sql = "UPDATE " + client.config.MySQL.tables.User + " SET id_cr = ? WHERE id_user = ?"
                client.database.query(sql, [id_cr, user.id_user])

                console.log(`${client.Func.LogDate()}L'ID Clash Royale de ${interaction.member.user.username} a été mis à jour !`.green)
                return interaction.reply({
                    content : "Votre ID Clash Royale a bien été enregistré ! Executez la commande '/cr_chests' pour voir vos futurs coffres !", 
                    ephemeral: true
                });

            })

            if (rslt[0] == undefined){
                var sql = "INSERT INTO " + client.config.MySQL.tables.User + " (id_user, id_cr) VALUES(?,?)"
                client.database.query(sql, [interaction.member.id, id_cr])
                console.log(`${client.Func.LogDate()}Le joueur ${interaction.member.user.username} ainsi que son ID Clash Royale a bien été enregistré !`.green)
                return interaction.reply({
                    content : "Vous êtes enregistré dans la BDD ainsi que votre ID Clash Royale ! Executez la commande '/cr_chests' pour voir vos futurs coffres !", 
                    ephemeral: true
                });
            }
        })	
	},
};