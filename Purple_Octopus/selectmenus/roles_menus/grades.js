const { MessageFlags } = require('discord.js');

module.exports = {
	name: 'roles_grades',

	async execute(interaction, client) {
        // Seuls les rôles déclarés dans t_roles_grades peuvent être ajoutés ou retirés.
        const [grades] = await client.database.query('SELECT id_role FROM t_roles_grades');
        const allowed = new Set(grades.map(grade => String(grade.id_role)));

        for (const role of interaction.values) {
            if (!allowed.has(role)) continue;
            if (interaction.member.roles.resolve(role)) {
                await interaction.member.roles.remove(role);
            } else {
                await interaction.member.roles.add(role);
            }
        }

        return interaction.reply({
            content: 'Vos grades ont bien été mis à jour',
            flags: MessageFlags.Ephemeral
        });
    }
};
