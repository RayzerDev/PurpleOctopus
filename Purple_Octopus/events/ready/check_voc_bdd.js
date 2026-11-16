const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        const table = client.config.MySQL.tables.VocalChannel;
        const [rows] = await client.database.query('SELECT * FROM ' + table);

        for (const voc of rows) {
            const channel = client.channels.resolve(voc.id_channel);
            if (!channel || channel.members.size !== 0) continue;
            const name_chan = channel.name;
            await channel.delete();
            await client.database.query('DELETE FROM ' + table + ' WHERE id_channel = ?', [voc.id_channel]);
            console.log(`${client.Func.LogDate()}Le salon ${name_chan} a été supprimé`.cyan);
            client.Func.SendLog('Vocals Manager', '#00FFFF', `Le salon ${name_chan} a été supprimé`);
        }
        console.log(`${client.Func.LogDate()}Vérification des channels vocaux terminée !`.inverse);
	},
};
