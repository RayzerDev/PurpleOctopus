// Discord
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates
	]
});

// Config
client.config = require('./config.json');

// Function
client.Func = {};
client.Func.LogDate = require('../function/LogDate');
client.Func.ConnecttoBDD = require('../function/ConnectBDD');
client.Func.SendLog = (title, color, description) => require('../function/SendLog')(client, title, color, description);
client.Func.ClashApi = require('../function/ClashApi');

// Une erreur imprevue est ecrite dans les logs au lieu d'arreter le bot.
process.on('unhandledRejection', err => console.error(`${client.Func.LogDate()}Erreur non gérée :`, err));
client.on('error', err => console.error(`${client.Func.LogDate()}Erreur Discord :`, err));

// Connexion à la base de donnée (avant les handlers : les événements "ready" l'utilisent)
client.database = client.Func.ConnecttoBDD(client.config.MySQL.host,
	client.config.MySQL.port,
	client.config.MySQL.user,
	client.config.MySQL.password,
	client.config.MySQL.database,
	client);

// Handlers
client.handlers = {};
client.handlers.commands = require('./handlers/commands');
client.handlers.commands(__dirname, client);

client.handlers.events = require('./handlers/events');
client.handlers.events(__dirname, client);

client.handlers.buttons = require('./handlers/buttons');
client.handlers.buttons(__dirname, client);

client.handlers.selectmenus = require('./handlers/selectmenus');
client.handlers.selectmenus(__dirname, client);

// Arrêt propre quand Nomad stoppe le conteneur
process.on('SIGTERM', async () => {
	await client.destroy();
	await client.database.end().catch(() => {});
	process.exit(0);
});

client.login(client.config.Discord.IDToken.PurpleOctopus);
