/*
Parameters
    key : identifiant de l'action (ex. 'cr_chests').
    userId : identifiant Discord du membre.
    seconds : duree du delai.
    now : horloge en millisecondes (pour les tests).
What it does
    Limite la frequence d'une action par membre (protege les API Clash et
    le bot contre le spam). La premiere demande passe et arme le delai.
Output
    0 si l'action est permise, sinon le nombre de secondes a attendre.
*/
const lastUse = new Map();

module.exports = (key, userId, seconds, now = Date.now()) => {
    const id = `${key}:${userId}`;
    if (lastUse.has(id)) {
        const elapsed = (now - lastUse.get(id)) / 1000;
        if (elapsed < seconds) return Math.ceil(seconds - elapsed);
    }
    lastUse.set(id, now);
    // Nettoyage simple pour que la table ne grossisse pas indefiniment.
    if (lastUse.size > 5000) {
        for (const [k, t] of lastUse) if (now - t > 3600000) lastUse.delete(k);
    }
    return 0;
};
