const mysql = require('mysql2');
require('colour');

/*
Parameters
    host, port, user, password, database : acces a la base MySQL/MariaDB.
    client : le client Discord (pour LogDate).
What it does
    Cree un pool de connexions (mysql2). Le pool remplace tout seul une
    connexion coupee (ECONNRESET, redemarrage de MariaDB) au lieu de faire
    planter le bot. Verifie l'acces a la base au demarrage.
Output
    Le pool en version promesses : const [rows] = await pool.query(sql, [params]).
*/
module.exports = (host, port, user, password, database, client) => {
    const pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        connectionLimit: 5,
        enableKeepAlive: true
    }).promise();

    pool.query('SELECT 1')
        .then(() => console.log(`${client.Func.LogDate()}Connecté à la base de données MySQL !`.inverse))
        .catch(err => console.error(`${client.Func.LogDate()}Base de données injoignable : ${err.message}`.red));

    return pool;
};
