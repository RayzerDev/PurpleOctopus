const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	// once: false : l'ancien "once: true" ne signalait que le premier départ après chaque démarrage.
	once: false,
	async execute(member, client) {
        console.log(`${client.Func.LogDate()}L'utilisateur, ${member.user.username} nous a quitté.`.red);

        const channel_enter = await client.channels.fetch(client.config.Discord.IDSalonServer.Atterissage);
        const embed_exit = new EmbedBuilder()
            .setTitle('Triste...')
            .setColor(0xFA5656)
            .setDescription(`${member.user.username} nous a quitté..`)
            .setThumbnail(member.user.displayAvatarURL());

        await channel_enter.send({ embeds: [embed_exit] });
	},
};
