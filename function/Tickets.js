const { ChannelType, PermissionFlagsBits } = require('discord.js');

/*
Parameters
    username : nom du membre qui ouvre le ticket.
What it does
    Fabrique un nom de salon Discord valide : minuscules, lettres et
    chiffres, tirets, 90 caracteres au plus.
Output
    Une chaine du type "ticket-pseudo".
*/
function channelName(username) {
    const slug = username.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
    return `ticket-${slug || 'membre'}`;
}

/*
Parameters
    client : le client Discord (base et config).
    userId : identifiant Discord du membre.
What it does
    Cherche le ticket ouvert du membre. Une ligne dont le salon n'existe plus
    (supprime a la main) est effacee.
Output
    Le salon du ticket ouvert, ou null.
*/
async function findOpen(client, userId) {
    const table = client.config.MySQL.tables.Ticket;
    const [rows] = await client.database.query('SELECT id_ticket, id_salon FROM ' + table + ' WHERE id_author = ?', [userId]);
    for (const row of rows) {
        const channel = await client.channels.fetch(row.id_salon).catch(() => null);
        if (channel) return channel;
        await client.database.query('DELETE FROM ' + table + ' WHERE id_ticket = ?', [row.id_ticket]);
    }
    return null;
}

/*
Parameters
    interaction : le clic sur le bouton "Ouvrir un ticket".
    client : le client Discord.
What it does
    Cree un salon prive dans la categorie du panneau : visible par l'auteur,
    les roles Administrateur et Moderateur, et le bot. L'enregistre dans
    t_ticket (en creant la ligne t_user si besoin, a cause de la cle etrangere).
Output
    Le salon cree.
*/
async function open(interaction, client) {
    const staff = Object.values(client.config.Discord.IDRoleServer.Admin);
    const allowMember = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles];

    const channel = await interaction.guild.channels.create({
        name: channelName(interaction.user.username),
        type: ChannelType.GuildText,
        parent: interaction.channel.parentId ?? undefined,
        topic: `Ticket de ${interaction.user.username}`,
        permissionOverwrites: [
            { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: allowMember },
            ...staff.map(id => ({ id, allow: [...allowMember, PermissionFlagsBits.ManageMessages] })),
            { id: client.user.id, allow: [...allowMember, PermissionFlagsBits.ManageChannels] },
        ],
    });

    await client.database.query('INSERT IGNORE INTO ' + client.config.MySQL.tables.User + ' (id_user) VALUES(?)', [interaction.user.id]);
    await client.database.query('INSERT INTO ' + client.config.MySQL.tables.Ticket + ' (id_salon, id_author) VALUES(?, ?)',
        [channel.id, interaction.user.id]);
    return channel;
}

/*
Parameters
    member : le membre qui clique sur "Fermer".
    authorId : auteur du ticket.
    staffRoles : identifiants des roles Administrateur et Moderateur.
What it does
    Dit si le membre peut fermer le ticket : son auteur, l'equipe, ou un
    membre qui peut gerer les salons.
Output
    true ou false.
*/
function canClose(member, authorId, staffRoles) {
    return member.id === authorId
        || staffRoles.some(role => member.roles.cache.has(role))
        || member.permissions.has(PermissionFlagsBits.ManageChannels);
}

module.exports = { channelName, findOpen, open, canClose };
