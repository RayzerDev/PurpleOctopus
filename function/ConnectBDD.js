const mysql = require('mysql');
const colours = require('colour');

/*
Parameters
    host, port, user, password, database : acces a la base MySQL/MariaDB.
    client : le client Discord (pour LogDate).
What it does
    Cree un pool de connexions au lieu d'une connexion unique. Le pool remplace
    tout seul une connexion coupee (ECONNRESET, redemarrage de MariaDB) au lieu
    de faire planter le bot. Verifie l'acces a la base au demarrage.
Output
    Le pool, qui s'utilise comme l'ancienne connexion : pool.query(sql, [params], callback).
*/
module.exports = (host, port, user, password, database, client) =>{

    const pool = mysql.createPool({
        host: host,
        port: port,
        user: user,
        password: password,
        database: database,
        connectionLimit: 5
    });

    pool.query('SELECT 1', function(err) {
        if (err) {
            console.error(`${client.Func.LogDate()}Base de données injoignable : ${err.message}`.red);
            return;
        }
        console.log(`${client.Func.LogDate()}Connecté à la base de données MySQL !`.inverse);
    })

    return pool
}
