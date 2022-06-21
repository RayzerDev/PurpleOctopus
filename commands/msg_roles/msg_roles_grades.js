const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageSelectMenu, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('msg_roles_grades')
		.setDescription('Permets de publier le message pour récupérer les rôles grades !'),
		
	async execute(interaction, client) {
        const sql = 'SELECT * FROM ' + client.config.MySQL.tables.User + ' WHERE id_user = ? AND admin_lvl = 3'
        
        client.database.query(sql,[interaction.member.id], function(err,rslt){
            if(rslt[0]){
                let l_options = []

                client.database.query("SELECT * FROM t_roles_grades", function(err,rslt){
                    rslt.forEach(grade => {
                        l_options.push({
                        
                            emoji: grade.emoji,
                            label: grade.name,
                            description: grade.description,
                            value: grade.id_role,
                            
                        })
                    })
        
                    const cocEmbed = new MessageEmbed()
                        .setTitle('Roles grades')
                        .setDescription(`Selectionnez depuis le menu en dessous les rôles que vous voulez ajouter, ou retirer \n
                        A noter que si vous selectionnez un rôle que vous avez déjà, celui-ci vous sera retiré`)
                        .setColor(0x3e5bc5)
                        .setThumbnail(`https://cdn.discordapp.com/emojis/988738678396428318.gif`)
        
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('roles_grades')
                            .setPlaceholder("C'est ici pour voir les rôles dispos !")
                            .setMinValues(1)
                            .addOptions(l_options),
                    );
                    interaction.channel.send({
                        embeds : [cocEmbed],
                        components:[row]
                    });
                    
                    return interaction.reply({
                        content : "Le message a bien été publié !", 
                        ephemeral: true
                    });
                })
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

