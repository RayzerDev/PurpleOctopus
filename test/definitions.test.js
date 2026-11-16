// Verifie que chaque commande, bouton et menu se charge avec discord.js 14 et
// que les definitions de commandes sont acceptables par Discord (toJSON).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', 'Purple_Octopus');

function modules(dir) {
    return fs.readdirSync(path.join(root, dir)).flatMap(folder =>
        fs.readdirSync(path.join(root, dir, folder)).filter(f => f.endsWith('.js'))
            .map(f => ({ file: `${dir}/${folder}/${f}`, mod: require(path.join(root, dir, folder, f)) })));
}

test('Les commandes ont un nom unique, une description et un execute', () => {
    const names = new Set();
    for (const { file, mod } of modules('commands')) {
        const json = mod.data.toJSON();
        assert.match(json.name, /^[a-z0-9_-]{1,32}$/, file);
        assert.ok(json.description.length >= 1 && json.description.length <= 100, `${file} : description de 1 a 100 caracteres`);
        assert.equal(typeof mod.execute, 'function', file);
        assert.ok(!names.has(json.name), `${file} : nom en double`);
        names.add(json.name);
    }
    assert.ok(names.has('help') && names.has('mute') && names.has('ticket_panel'));
});

test('Chaque customId utilise par une commande a son bouton', () => {
    const buttons = new Set(modules('buttons').map(({ mod }) => mod.name));
    for (const id of ['check_role_coc', 'ticket_open', 'ticket_close']) assert.ok(buttons.has(id), id);
});

test('Les evenements se chargent et ont un nom', () => {
    for (const { file, mod } of modules('events')) {
        if (typeof mod.execute !== 'function') continue;
        assert.equal(typeof mod.name, 'string', file);
        assert.notEqual(mod.name, 'ready', `${file} : utiliser Events.ClientReady`);
    }
});
