const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	// once: false : l'ancien "once: true" n'accueillait que le premier arrivant après chaque démarrage.
	once: false,
	async execute(member, client) {
        const channel_enter = await client.channels.fetch(client.config.Discord.IDSalonServer.Atterissage);

        const embed_enter = new EmbedBuilder()
            .setTitle("Arrivée d'un nouveau membre !")
            .setColor(0x60D15B)
            .setDescription(`Bienvenue sur le serveur, ${member.user.username} !`)
            .setThumbnail(member.user.displayAvatarURL());
        await channel_enter.send({ embeds: [embed_enter] });

        console.log(`${client.Func.LogDate()}L'utilisateur, ${member.user.username} a rejoint le serveur !`.green);
	},
};
