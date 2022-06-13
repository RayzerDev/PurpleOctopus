module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	async execute(oldState,newState,client) {
        if (newState.channelId === client.config.Discord.IDSalonServer.CreateVoc){
            newState.guild.channels.create(`Vocal de ${newState.member.user.username}`,{
                type:'GUILD_VOICE',
                parent: client.config.Discord.IDCategorie.Vocal,
                permissionOverwrites: [{ 
                    id: newState.id,
                    deny: ['VIEW_CHANNEL'],
                }]
            })
    
            .then((channel) => {
                client.database.query('INSERT INTO ' + client.config.MySQL.tables.VocalChannel + ` VALUES(${channel.id},${newState.member.id})`)
                newState.setChannel(channel)
                console.log(`${client.Func.LogDate()}Un nouveau Vocal a été créé par ${newState.member.user.username} !`.cyan)
                
            })
        }
	},
};