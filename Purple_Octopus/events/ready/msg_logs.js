const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        await client.Func.SendLog('Information de PurpleOctopus', '#4FAB4F', 'Le bot vient de redémarrer !');
        console.log(`${client.Func.LogDate()}Bot lancé !`.inverse);
	},
};
