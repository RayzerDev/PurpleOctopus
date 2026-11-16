const { Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (directory, client) => {
    client.selectmenus = new Collection();
    const selectmenusfoldersPath = path.join(directory, 'selectmenus');
    const selectmenusfolders = fs.readdirSync(selectmenusfoldersPath);

    for (selectmenusfolder of selectmenusfolders){
        const selectmenusPath = path.join(selectmenusfoldersPath, selectmenusfolder);
        const selectmenuFiles = fs.readdirSync(selectmenusPath).filter(file => file.endsWith('.js'));

        for (const file of selectmenuFiles) {

            const filePath = path.join(selectmenusPath, file);
            const selectmenu = require(filePath);
            client.selectmenus.set(selectmenu.name, selectmenu);

        }
    }
}