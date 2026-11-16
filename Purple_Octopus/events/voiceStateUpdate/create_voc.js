const { ChannelType, Events, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState, client) {
        if (newState.channelId !== client.config.Discord.IDSalonServer.CreateVoc) return;

        const vocal_name = `Vocal de ${newState.member.user.username}`;
        const options = {
            name: vocal_name,
            type: ChannelType.GuildVoice,
            parent: client.config.Discord.IDCategorie.Vocal,
        };
        // Le créateur gère son salon : nom, nombre de places, déplacement des membres.
        // (Avant : ViewChannel lui était refusé, il ne voyait pas son propre salon.)
        const ownerRights = [{
            id: newState.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect,
                PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers],
        }];
        const channel = await newState.guild.channels.create({ ...options, permissionOverwrites: ownerRights })
            .catch(err => {
                // Le bot n'a pas le droit de déléguer ces permissions : salon créé sans elles.
                console.error(`${client.Func.LogDate()}Droits du créateur refusés (${err.message}), salon créé sans`.red);
                return newState.guild.channels.create(options);
            });

        await client.database.query('INSERT INTO ' + client.config.MySQL.tables.VocalChannel + ' VALUES(?, ?)',
            [channel.id, newState.member.id]);
        await newState.setChannel(channel);
        console.log(`${client.Func.LogDate()}Un nouveau Vocal a été créé par ${newState.member.user.username} !`.cyan);
        client.Func.SendLog('Vocals Manager', '#00FFFF', `Le salon ${vocal_name} a été créé !`);
	},
};
