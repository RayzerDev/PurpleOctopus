const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('msg_roles_coc')
		.setDescription('Permets de publier le message pour récupérer son rôle Clash Of Clans !'),
		
	async execute(interaction, client) {
        const sql = 'SELECT * FROM ' + client.config.MySQL.tables.User + ' WHERE id_user = ? AND admin_lvl = 3'
        
        client.database.query(sql,[interaction.member.id], function(err,rslt){
            if(rslt[0]){
                const cocEmbed = new MessageEmbed()
                    .setTitle('Le Clan Golazo sur Clash Of CLans ')
                    .setDescription(`Appuyez sur le bouton "Ajouter le rôle" afin de vérifier que vous êtes bien dans le clan, pour vous donner le rôle coc ! \n
                    Si vous n'êtes pas enregsitré dans la base de donnée, faîtes la commande /coc_register avec votre ID Clash Of Clans pour pouvoir vosu associer avec le seveur ! \n
                    Si vous n'êtes pas dans le clan, cliquez sur le lien du Clan pour pouvoir rejoindre celui-ci !`)
                    .setColor(0xDC143C)
                    .setThumbnail(`https://api-assets.clashofclans.com/badges/512/jkRzaPicUqoJ0KtXxOioRDMT7sVoB0sMd6KY0AIQYKs.png`)
                
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('check_role_coc')
                            .setLabel('Ajouter le rôle')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setStyle('LINK')
                            .setURL('https://link.clashofclans.com/fr?action=OpenClanProfile&tag=2CV2P82C')
                            .setLabel('Lien du Clan')
                    );
            
                interaction.channel.send({
                    embeds : [cocEmbed],
                    components:[row]
                });
                return interaction.reply({
                    content : "Le message a bien été publié !", 
                    ephemeral: true
                });
            }
            else{
                return interaction.reply({
                    content : "Vous ne pouvez utiliser cette commande", 
                    ephemeral: true
                });
            }
        })
	},
};

