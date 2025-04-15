const { ownerNumber } = require('../config');

module.exports = {
  name: 'adminpanel',
  description: 'Admin Control Panel for the bot owner',
  category: 'owner',

  async execute(message, sock) {
    const sender = message.key.remoteJid;
    const isOwner = message.key.participant === ownerNumber || sender === ownerNumber;

    if (!isOwner) {
      return sock.sendMessage(sender, { text: 'Only the bot owner can access this panel.' }, { quoted: message });
    }

    const panelText = `
*🤡 COSMO Admin Panel 🤡*
━━━━━━━━━━━━━━━
⚙️ *Bot Status:* Online
📦 *Commands Loaded:* Auto
🔐 *Owner:* ${ownerNumber}
📊 *Uptime:* ${Math.floor(process.uptime() / 60)} mins
🛠️ *Features:*
- Block/Unblock Users
- Toggle Features
- Monitor Logs
- Update Sessions
━━━━━━━━━━━━━━━
Type a command to begin: 
- .block <number>
- .unblock <number>
- .commands
- .restart (coming soon)
`;

    await sock.sendMessage(sender, { text: panelText }, { quoted: message });
  }
};
