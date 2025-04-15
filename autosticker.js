const fs = require('fs');
const toggleFile = './db/autosticker.json';

// Make sure toggle file exists
if (!fs.existsSync(toggleFile)) fs.writeFileSync(toggleFile, '{}');
let toggleData = JSON.parse(fs.readFileSync(toggleFile));

function saveToggle() {
  fs.writeFileSync(toggleFile, JSON.stringify(toggleData, null, 2));
}

module.exports = {
  name: 'autosticker',
  description: 'Toggle auto image-to-sticker feature on or off',
  async execute(sock, m, args) {
    const jid = m.key.remoteJid;
    const command = args[0]?.toLowerCase();

    if (!command || !['on', 'off'].includes(command)) {
      return sock.sendMessage(jid, { text: `Usage:\n.autosticker on\n.autosticker off` }, { quoted: m });
    }

    toggleData[jid] = command === 'on';
    saveToggle();

    await sock.sendMessage(jid, { text: `Auto Sticker is now *${command.toUpperCase()}*.` }, { quoted: m });
  },
  toggleStatus(jid) {
    return toggleData[jid] ?? false;
  }
};
