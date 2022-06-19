const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const https = require('https');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cr_chests')
		.setDescription('Si vous êtes enregistré, vous pourrez visualiser vos prochains coffres Clash Royale.'),
		
	async execute(interaction, client) {
		const emojis = client.emojis.cache
		const sql = "SELECT * FROM " + client.config.MySQL.tables.User + " WHERE id_user = ? AND id_cr != 'NULL'"
		client.database.query(sql,[interaction.member.id], function(err,rslt){
            rslt.forEach(user => {
				let rslt_json 

				const options = {
				hostname: 'api.clashroyale.com',
				path: `/v1/players/${user.id_cr.replace('#', '%23')}/upcomingchests`,
				method: 'GET',
				headers: {
					'Authorization': client.config.TokenClashRoyale
					}
				};

				const req = https.get(options, (res) => {
					res.setEncoding('utf8');
					res.on('data', (chunk) => {
						rslt_json = JSON.parse(chunk)
						let l_fields = []

						if (rslt_json.reason == 'notFound'){
							return interaction.reply({
								content : "Vous devez enregistrer un autre ID Clash Royale puisque celui-ci n'existe pas !", 
								ephemeral: true
							});
						}
						rslt_json.items.forEach(chest => {
							const chest_name = chest.name.replaceAll(' ', '_')
							let chest_id
							emojis.forEach(emoji => {
								if (emoji.name == chest_name){
									chest_id = emoji.id
								}
							})
							if (chest.index == 0)	l_fields.push({name: 'Prochain coffre', value: `<:${chest_name}:${chest_id}>`, inline: true})
							else l_fields.push({name: `${(chest.index + 1 ).toString()}ème coffres`, value: `<:${chest_name}:${chest_id}>`, inline: true})
						});

						const ChestsEmbed = new MessageEmbed()
							.setTitle('Clash Royale : Coffres à venir !')
							.setDescription(`Vous verrez en dessous les coffres que vous allez pouvoir obtenir à vos prochaines victoires !`)
							.setColor(0x3e5bc5)
							.addFields(l_fields)
							.setThumbnail(`https://play-lh.googleusercontent.com/rIvZQ_H3hfmexC8vurmLczLtMNBFtxCEdmb2NwkSPz2ZuJJ5nRPD0HbSJ7YTyFGdADQ`)

						interaction.reply({
							embeds : [ChestsEmbed],
							ephemeral: true
						});
					});
					
				});

				req.on('error', (e) => {
					return interaction.reply({
						content : 'Erreur avec cette commande, retentez plus tard ...', 
						ephemeral: true
					});
				});

				req.end();


            })

			if (rslt[0] == undefined) {
				return interaction.reply({
					content : 'Vous devez effectuer la commande /cr_register pour pouvoir vous enregistrer dans la Base de Donnée, et consulter votre profil CR !', 
					ephemeral: true
				});
			}	
        })
	},
};