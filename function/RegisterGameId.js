/*
Parameters
    client : le client Discord (base de donnees et config).
    userId : identifiant Discord du membre.
    column : 'id_coc' ou 'id_cr'.
    gameId : identifiant du joueur, deja valide.
What it does
    Enregistre l'identifiant de jeu du membre : met a jour sa ligne si elle
    existe, sinon la cree. Le nom de colonne vient du code, jamais de
    l'utilisateur.
Output
    'updated' ou 'created'.
*/
const COLUMNS = new Set(['id_coc', 'id_cr']);

module.exports = async (client, userId, column, gameId) => {
    if (!COLUMNS.has(column)) throw new Error(`colonne inconnue : ${column}`);
    const table = client.config.MySQL.tables.User;
    const [result] = await client.database.query(`UPDATE ${table} SET ${column} = ? WHERE id_user = ?`, [gameId, userId]);
    if (result.affectedRows > 0) return 'updated';
    await client.database.query(`INSERT INTO ${table} (id_user, ${column}) VALUES(?, ?)`, [userId, gameId]);
    return 'created';
};
