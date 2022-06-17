const { SlashCommandBuilder } = require('@discordjs/builders');
const { exec } = require('node:child_process')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart_bot')
		.setDescription('Permets de redémarrer le bot'),
		
	async execute(interaction, client) {
        const sql = 'SELECT * FROM ' + client.config.MySQL.tables.User + ' WHERE id_user = ? AND admin_lvl = 3'
        
        client.database.query(sql,[interaction.member.id], function(err,rslt){
            rslt.forEach(user => {
                interaction.reply({
                    content : "Redémarrage en cours du bot ...", 
                    ephemeral: true
                });
                
                exec('pm2 restart 0', (err, output) => {
                    if (err) {
                        return interaction.reply({
                            content : "Erreur dans le le redémarrage : " + err, 
                            ephemeral: true
                        });
                    }
                })
            })

            if (rslt[0] == undefined){
                return interaction.reply({
                    content : "Vous n'avez pas la permission de faire ça !", 
                    ephemeral: true
                });
            }
        })	
	},
};