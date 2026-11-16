const {MessageEmbed} = require('discord.js')
const https = require('https');

module.exports = {
	name: 'check_role_coc',

	async execute(interaction, client) {
            const l_roles_coc = client.config.ClashOfClans.roles_clan
            const sql = "SELECT * FROM " + client.config.MySQL.tables.User + " WHERE id_user = ? AND id_coc != 'NULL'"
            client.database.query(sql,[interaction.member.id], function(err,rslt){
                rslt.forEach(user => {
                    let rslt_json 

                    const options = {
                    hostname: 'api.clashofclans.com',
                    path: `/v1/players/${user.id_coc.replace('#', '%23')}`,
                    method: 'GET',
                    headers: {
                        'Authorization': client.config.TokenClashOfClan
                        }
                    };
    
                    const req = https.get(options, (res) => {
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => {
                            rslt_json = JSON.parse(chunk)
    
                            if (rslt_json.reason == 'notFound'){
                                return interaction.reply({
                                    content : "Vous devez enregistrer un autre ID Clash Of Clans puisque celui-ci n'existe pas !", 
                                    ephemeral: true
                                });
                            }
                            if(rslt_json.clan.tag == client.config.ClashOfClans.id_clan){
                                for (role of l_roles_coc){
                                    if(!interaction.member.roles.resolve(role)){
                                        interaction.member.roles.add(role);
                                    }
                                }
                                return interaction.reply({
                                    content: "Vos rôles ont bien été mis à jour !",
                                    ephemeral: true}); 
                            }
                            else{
                                return interaction.reply({
                                    content:"Vous ne faîtes pas parti du clan !",
                                    ephemeral: true});
                            }
                        });
                        
                    });
    
                    req.on('error', (e) => {
                        console.log(e);
                        return interaction.reply({
                            content : 'Erreur avec cette commande, retentez plus tard ...', 
                            ephemeral: true
                        });
                    });
    
                    req.end();
    
                })
    
                if (rslt[0] == undefined) {
                    return interaction.reply({
                        content : 'Vous devez effectuer la commande /coc_register pour pouvoir vous enregistrer dans la Base de Donnée, et obtenir le rôle coc !', 
                        ephemeral: true
                    });
                }	
            })
	},
};
