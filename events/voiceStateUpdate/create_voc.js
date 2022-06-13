module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	async execute(oldState,newState,client) {
        if (newState.channelId === client.config.Discord.IDSalonServer.CreateVoc){
            const vocal_name =`Vocal de ${newState.member.user.username}`
            newState.guild.channels.create(vocal_name,{
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
                const channel = client.channels.cache.find(x => x.id == client.config.Discord.IDSalonServer.Logs)
                const Embed = new MessageEmbed()
                    .setColor('#00FFFF')
                    .setTitle('Vocals Manager')
                    .setDescription(`Le salon ${vocal_name} a été créé !`)
                    .setTimestamp()
                channel.send({embeds: [Embed]})
            })
        }
	},
};