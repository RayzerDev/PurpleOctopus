// Discord
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
	intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

// Config
client.config = require('./config.json');

// Function
client.Func = {}
client.Func.LogDate = require('../function/LogDate')
client.Func.ConnecttoBDD = require('../function/ConnectBDD') 

// Handlers 
client.handlers = {}
client.handlers.commands = require('./handlers/commands')
client.handlers.commands(__dirname, client)

client.handlers.events = require('./handlers/events')
client.handlers.events(__dirname, client)

client.handlers.buttons = require('./handlers/buttons')
client.handlers.buttons(__dirname, client)

client.handlers.selectmenus = require('./handlers/selectmenus')
client.handlers.selectmenus(__dirname, client)

// Connexion à la base de donnée
client.database = client.Func.ConnecttoBDD(client.config.MySQL.host,
    client.config.MySQL.port,
    client.config.MySQL.user,
    client.config.MySQL.password,
    client.config.MySQL.database,
    client)

client.login(client.config.Discord.IDToken.PurpleOctopus)