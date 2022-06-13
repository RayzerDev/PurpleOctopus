module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        client.database.query('SELECT * FROM ' + client.config.MySQL.tables.VocalChannel, function(err,rslt){
    
            rslt.forEach(voc => {
                if(client.channels.resolve(voc.id_channel)){
                    let channel = client.channels.resolve(voc.id_channel)
                    if(channel.members.size === 0 ){
                        const name_chan = channel.name
                        channel.delete()
                            .then(client.database.query('DELETE FROM ' + client.config.MySQL.tables.VocalChannel + ' WHERE id_channel = ?', [voc.id_channel]), 
                            console.log(`${client.Func.LogDate()}Le channel ${name_chan} a bien été supprimé`.cyan))
                    }
                }
            })
        })
        console.log(`${client.Func.LogDate()}Vérification des channels vocaux terminée !`.inverse)
	},
};    
    
