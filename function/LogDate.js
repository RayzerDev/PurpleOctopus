/*
Parameters
    Aucun.
What it does
    Formate la date et l'heure courantes (format francais) pour prefixer les logs.
Output
    Une chaine du type "||16/11/2026-17:31:08|| ".
*/
module.exports = () => {
    const date = new Date().toLocaleString('fr-FR').replace(', ', '-');
    return `||${date}|| `;
};
