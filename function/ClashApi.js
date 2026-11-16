/*
Parameters
    host : 'api.clashofclans.com' ou 'api.clashroyale.com'.
    path : chemin apres /v1/players/{tag} (ex. '/upcomingchests'), ou ''.
    tag : identifiant du joueur, avec le '#'.
    token : valeur de l'en-tete Authorization (depuis config.json).
What it does
    Interroge l'API Supercell pour un joueur, avec un delai maximal de 10 s.
    Lit la reponse en entier avant de la decoder (l'ancien code decodait le
    premier morceau recu et plantait sur les reponses longues).
Output
    { status, data } : le code HTTP et le JSON decode (null si illisible).
*/
module.exports = async (host, path, tag, token) => {
    const url = `https://${host}/v1/players/${encodeURIComponent(tag)}${path}`;
    const res = await fetch(url, {
        headers: { Authorization: token, Accept: 'application/json' },
        signal: AbortSignal.timeout(10000)
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
};
