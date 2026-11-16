const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (directory, client) => {
    // Prise en compte de toutes les commandes
    const commands = [];
    client.commands = new Collection();
    const commandsfoldersPath = path.join(directory, 'commands');
    const commandsfolders = fs.readdirSync(commandsfoldersPath);

    for (commandsfolder of commandsfolders){
        const commandsPath = path.join(commandsfoldersPath, commandsfolder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        }
    }

    // Enregistrement des commandes à Discord
    const rest = new REST({ version: '9' }).setToken(client.config.Discord.IDToken.PurpleOctopus);
    rest.put(Routes.applicationCommands(client.config.Discord.BotID.PurpleOctopus), { body: commands })
        .then(() => console.log(`${client.Func.LogDate()}Les commandes ont été mis à jour !`.inverse))
        .catch(console.error);
}