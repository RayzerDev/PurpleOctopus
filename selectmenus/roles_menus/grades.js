
module.exports = {
	name: 'roles_grades',

	async execute(interaction, client) {
        for(role of interaction.values) {		    
            if (interaction.member.roles.resolve(role)){
                interaction.member.roles.remove(role);
            }
            else{
		if (interaction.member.id != "690177619228229688"){
                    interaction.member.roles.add(role);
		}
            }
        }

        return interaction.reply({
            content:"Vos grades ont bien été mis à jour",
            ephemeral:true
        })
    }
}
