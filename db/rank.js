// db/rank.js
const fs = require('fs');
const path = './db/ranks.json';

// Ensure file exists
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

let ranks = JSON.parse(fs.readFileSync(path));

function getUser(id) {
    if (!ranks[id]) ranks[id] = { level: 1, xp: 0 };
    return ranks[id];
}

function addXP(id, amount = 10) {
    let user = getUser(id);
    user.xp += amount;
    while (user.xp >= user.level * 100) {
        user.xp -= user.level * 100;
        user.level++;
    }
    save();
    return user;
}

function getRank(id) {
    return getUser(id);
}

function save() {
    fs.writeFileSync(path, JSON.stringify(ranks, null, 2));
}

module.exports = {
    addXP,
    getRank
};
