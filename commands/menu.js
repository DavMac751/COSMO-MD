// commands/menu.js
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "menu",
  description: "Displays the bot's menu",
  execute: async (sock, msg, args) => {
    const imagePath = path.join(__dirname, "../public/menu.jpg");
    const buffer = fs.readFileSync(imagePath);

    await sock.sendMessage(msg.key.remoteJid, {
      image: buffer,
      caption: `*🤡 COSMO-MD BOT MENU 🤡*\n\n1. .alive\n2. .google <query>\n3. .ask <question>\n4. .play <song>\n5. .movie <title>\n6. .mp4 <url>\n7. .img <search>\n8. .games\n9. .rank\n10. .block <@user>\n11. .unblock <@user>\n...and more!`,
    });
  },
};
