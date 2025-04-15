// commands/alive.js
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "alive",
  description: "Bot status check",
  execute: async (sock, msg) => {
    const imagePath = path.join(__dirname, "../public/main.jpg");
    const buffer = fs.readFileSync(imagePath);

    await sock.sendMessage(msg.key.remoteJid, {
      image: buffer,
      caption: `*🤖 COSMO-MD is Alive and Working!*\n\n- Prefix: \`.\`\n- Version: 3.0.0\n- Developer: Jack (DavMac751)\n- Type \`.menu\` to view all commands.`,
    });
  },
};
