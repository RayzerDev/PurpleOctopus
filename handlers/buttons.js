const { Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (directory, client) => {
    client.buttons = new Collection();
    const buttonsfoldersPath = path.join(directory, 'buttons');
    const buttonsfolders = fs.readdirSync(buttonsfoldersPath);

    for (buttonsfolder of buttonsfolders){
        const buttonsPath = path.join(buttonsfoldersPath, buttonsfolder);
        const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

        for (const file of buttonFiles) {

            const filePath = path.join(buttonsPath, file);
            const button = require(filePath);
            client.buttons.set(button.name, button);

        }
    }
}