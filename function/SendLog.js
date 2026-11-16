const { EmbedBuilder } = require('discord.js');

/*
Parameters
    client : le client Discord.
    title, color, description : contenu de l'embed.
What it does
    Envoie un embed dans le salon de logs du serveur. Une erreur d'envoi
    (salon absent, permissions) est seulement ecrite dans la console.
Output
    Une promesse resolue dans tous les cas.
*/
module.exports = async (client, title, color, description) => {
    try {
        const channel = await client.channels.fetch(client.config.Discord.IDSalonServer.Logs);
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
        await channel.send({ embeds: [embed] });
    } catch (err) {
        console.error(`${client.Func.LogDate()}Log Discord impossible : ${err.message}`.red);
    }
};
