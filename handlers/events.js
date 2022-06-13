const fs = require('node:fs');
const path = require('node:path');

module.exports = (directory,client) => {
    const eventsFoldersPath = path.join(directory, 'events');
    const eventFolders = fs.readdirSync(eventsFoldersPath);


    for (const eventfolder of eventFolders){
        const eventsPath = path.join(eventsFoldersPath, eventfolder);
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}