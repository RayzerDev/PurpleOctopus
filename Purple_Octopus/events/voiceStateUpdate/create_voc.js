const { ChannelType, Events, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState, client) {
        if (newState.channelId !== client.config.Discord.IDSalonServer.CreateVoc) return;

        const vocal_name = `Vocal de ${newState.member.user.username}`;
        const channel = await newState.guild.channels.create({
            name: vocal_name,
            type: ChannelType.GuildVoice,
            parent: client.config.Discord.IDCategorie.Vocal,
            permissionOverwrites: [{
                id: newState.id,
                deny: [PermissionFlagsBits.ViewChannel],
            }]
        });

        await client.database.query('INSERT INTO ' + client.config.MySQL.tables.VocalChannel + ' VALUES(?, ?)',
            [channel.id, newState.member.id]);
        await newState.setChannel(channel);
        console.log(`${client.Func.LogDate()}Un nouveau Vocal a été créé par ${newState.member.user.username} !`.cyan);
        client.Func.SendLog('Vocals Manager', '#00FFFF', `Le salon ${vocal_name} a été créé !`);
	},
};
