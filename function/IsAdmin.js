/*
Parameters
    client : le client Discord (base de donnees et config).
    userId : identifiant Discord du membre.
What it does
    Verifie dans la table des utilisateurs que le membre a le niveau
    d'administration 3 (le plus haut).
Output
    true ou false.
*/
module.exports = async (client, userId) => {
    const sql = 'SELECT 1 FROM ' + client.config.MySQL.tables.User + ' WHERE id_user = ? AND admin_lvl = 3 LIMIT 1';
    const [rows] = await client.database.query(sql, [userId]);
    return rows.length > 0;
};
