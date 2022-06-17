const { SlashCommandBuilder } = require('@discordjs/builders');
const { exec } = require('node:child_process')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop_bot')
		.setDescription('Permets de stopper le bot'),
		
	async execute(interaction, client) {
        const sql = 'SELECT * FROM ' + client.config.MySQL.tables.User + ' WHERE id_user = ? AND admin_lvl = 3'
        
        client.database.query(sql,[interaction.member.id], function(err,rslt){
            rslt.forEach(user => {
                exec('pm2 stop 0', (err, output) => {
                    if (err) {
                        return interaction.reply({
                            content : "Erreur dans le l'arrêt : " + err, 
                            ephemeral: true
                        });
                    
                    }
                    return interaction.reply({
                        content : output, 
                        ephemeral: true
                    });
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