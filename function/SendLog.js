const { EmbedBuilder } = require('discord.js');

/*
Parameters
    client : le client Discord.
    title, color, description : contenu de l'embed.
    channelId : salon cible (par defaut le salon de logs du serveur).
What it does
    Envoie un embed dans un salon du serveur. Une erreur d'envoi (salon
    absent, permissions) est seulement ecrite dans la console.
Output
    Une promesse resolue dans tous les cas.
*/
module.exports = async (client, title, color, description, channelId = client.config.Discord.IDSalonServer.Logs) => {
    try {
        const channel = await client.channels.fetch(channelId);
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
