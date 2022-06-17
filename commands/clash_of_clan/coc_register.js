const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coc_register')
		.setDescription("Permets d'enregistrer dans la base de donnée son ID Clash of clans")
        .addStringOption(option => 
			option.setName('id_clash_of_clans')
				.setDescription('Votre Id Clash Of Clans (#12345678)')
				.setRequired(true)),

	async execute(interaction, client) {
        const id_coc = interaction.options.getString('id_clash_of_clans');
        if (id_coc[0] != '#' || id_coc.length > 10) return interaction.reply({
            content : "Executez la commande de cette manière : '/coc_register #123456789' !", 
            ephemeral: true
        });

        const sql = 'SELECT * FROM ' + client.config.MySQL.tables.User + ' WHERE id_user = ' + interaction.member.id
        
        client.database.query(sql, function(err,rslt){

            rslt.forEach(user => {
                var sql = "UPDATE " + client.config.MySQL.tables.User + " SET id_coc = ? WHERE id_user = ?"
                client.database.query(sql, [id_coc, user.id_user])

                console.log(`${client.Func.LogDate()}L'ID Clash Of Clans de ${interaction.member.user.username} a été mis à jour !`.green)
                return interaction.reply({
                    content : "Votre ID Clash Of Clans a bien été enregistré et mis à jour !", 
                    ephemeral: true
                });

            })

            if (rslt[0] == undefined){
                var sql = "INSERT INTO " + client.config.MySQL.tables.User + " (id_user, id_coc) VALUES(?,?)"
                client.database.query(sql, [interaction.member.id, id_coc])
                console.log(`${client.Func.LogDate()}Le joueur ${interaction.member.user.username} ainsi que son ID Clash Of Clans a bien été enregistré !`.green)
                return interaction.reply({
                    content : "Vous êtes enregistré dans la BDD avec votre ID Clash Of Clans !", 
                    ephemeral: true
                });
            }
        })	
	},
};