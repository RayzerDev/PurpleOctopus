const fs = require('node:fs');
const path = require('node:path');

module.exports = (directory, client) => {

    const eventsFoldersPath = path.join(directory, 'events');
    const eventFolders = fs.readdirSync(eventsFoldersPath);

    for (const eventfolder of eventFolders) {
        const eventsPath = path.join(eventsFoldersPath, eventfolder);
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (typeof event.execute !== 'function') continue;
            // Une erreur dans un événement est écrite dans les logs, sans arrêter le bot.
            const run = async (...args) => {
                try {
                    await event.execute(...args, client);
                } catch (err) {
                    console.error(`${client.Func.LogDate()}Erreur dans ${eventfolder}/${file} :`, err);
                }
            };
            if (event.once) {
                client.once(event.name, run);
            } else {
                client.on(event.name, run);
            }
        }
    }
};
