const { Events } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState, client) {
        // Rien à supprimer si personne n'a quitté de salon.
        if (!oldState.channelId) return;

        const table = client.config.MySQL.tables.VocalChannel;
        const [rows] = await client.database.query('SELECT * FROM ' + table);

        for (const voc of rows) {
            const channel = client.channels.resolve(voc.id_channel);
            if (!channel || channel.members.size !== 0) continue;

            await channel.delete();
            await client.database.query('DELETE FROM ' + table + ' WHERE id_channel = ?', [voc.id_channel]);
            const author = client.users.cache.get(voc.id_author)?.username ?? 'un membre';
            console.log(`${client.Func.LogDate()}Le salon vocal de ${author} a été supprimé`.cyan);
            client.Func.SendLog('Vocals Manager', '#00FFFF', `Le salon Vocal de ${author} a été supprimé`);
        }
	},
};
