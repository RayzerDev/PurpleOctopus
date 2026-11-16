// Tests des fonctions partagees du bot (node --test). Aucune connexion a
// Discord ni a la base : la base et fetch sont remplaces par des doublures.
const test = require('node:test');
const assert = require('node:assert/strict');

const cooldown = require('../function/Cooldown');
const registerGameId = require('../function/RegisterGameId');
const isAdmin = require('../function/IsAdmin');
const clashApi = require('../function/ClashApi');
const tickets = require('../function/Tickets');

function fakeClient(answers) {
    const calls = [];
    return {
        calls,
        config: { MySQL: { tables: { User: 't_user', Ticket: 't_ticket' } } },
        database: { query: async (sql, params) => { calls.push({ sql, params }); return answers.shift(); } },
    };
}

test('Cooldown : la premiere demande passe, la suivante attend, puis repasse', () => {
    assert.equal(cooldown('t', 'u1', 10, 1000), 0);
    assert.equal(cooldown('t', 'u1', 10, 4000), 7);
    assert.equal(cooldown('t', 'u2', 10, 4000), 0, 'un autre membre n\'est pas bloque');
    assert.equal(cooldown('t', 'u1', 10, 11001), 0);
});

test('RegisterGameId met a jour une ligne existante', async () => {
    const client = fakeClient([[{ affectedRows: 1 }]]);
    assert.equal(await registerGameId(client, '42', 'id_cr', '#ABC'), 'updated');
    assert.equal(client.calls.length, 1);
    assert.deepEqual(client.calls[0].params, ['#ABC', '42']);
});

test('RegisterGameId cree la ligne si le membre est inconnu', async () => {
    const client = fakeClient([[{ affectedRows: 0 }], [{ affectedRows: 1 }]]);
    assert.equal(await registerGameId(client, '42', 'id_coc', '#ABC'), 'created');
    assert.match(client.calls[1].sql, /^INSERT INTO t_user \(id_user, id_coc\)/);
    assert.deepEqual(client.calls[1].params, ['42', '#ABC']);
});

test('RegisterGameId refuse une colonne inconnue (pas d\'injection SQL par le nom)', async () => {
    const client = fakeClient([]);
    await assert.rejects(registerGameId(client, '42', 'id_cr = 1; DROP TABLE t_user; --', '#A'));
    assert.equal(client.calls.length, 0);
});

test('IsAdmin passe l\'identifiant en parametre', async () => {
    const client = fakeClient([[[{ 1: 1 }]], [[]]]);
    assert.equal(await isAdmin(client, '1 OR 1=1'), true);
    assert.equal(await isAdmin(client, '7'), false);
    assert.deepEqual(client.calls[0].params, ['1 OR 1=1']);
    assert.doesNotMatch(client.calls[0].sql, /1 OR 1=1/);
});

test('ClashApi encode le tag et lit la reponse entiere', async (t) => {
    let seen;
    t.mock.method(global, 'fetch', async (url, options) => {
        seen = { url, options };
        return { status: 200, json: async () => ({ tag: '#2PP' }) };
    });
    const res = await clashApi('api.clashroyale.com', '/upcomingchests', '#2PP', 'Bearer x');
    assert.equal(seen.url, 'https://api.clashroyale.com/v1/players/%232PP/upcomingchests');
    assert.equal(seen.options.headers.Authorization, 'Bearer x');
    assert.deepEqual(res, { status: 200, data: { tag: '#2PP' } });
});

test('ClashApi renvoie data null si la reponse n\'est pas du JSON', async (t) => {
    t.mock.method(global, 'fetch', async () => ({ status: 502, json: async () => { throw new SyntaxError('bad'); } }));
    assert.deepEqual(await clashApi('api.clashofclans.com', '', '#2PP', 'x'), { status: 502, data: null });
});

test('Nom de salon de ticket valide pour Discord', () => {
    assert.equal(tickets.channelName('Élodie_42 !!'), 'ticket-elodie-42');
    assert.equal(tickets.channelName('✨✨'), 'ticket-membre');
    assert.ok(tickets.channelName('a'.repeat(200)).length <= 90);
});

test('Seuls l\'auteur, l\'equipe ou un gestionnaire de salons ferment un ticket', () => {
    const member = (id, roles = [], manage = false) => ({
        id,
        roles: { cache: new Map(roles.map(r => [r, true])) },
        permissions: { has: () => manage },
    });
    assert.equal(tickets.canClose(member('auteur'), 'auteur', ['modo']), true);
    assert.equal(tickets.canClose(member('x', ['modo']), 'auteur', ['modo']), true);
    assert.equal(tickets.canClose(member('x', [], true), 'auteur', ['modo']), true);
    assert.equal(tickets.canClose(member('x'), 'auteur', ['modo']), false);
});
