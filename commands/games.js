// commands/games.js
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "games",
  description: "Game center",
  execute: async (sock, msg) => {
    const imagePath = path.join(__dirname, "../public/games.jpg");
    const buffer = fs.readFileSync(imagePath);

    await sock.sendMessage(msg.key.remoteJid, {
      image: buffer,
      caption: `🎮 *COSMO GAMES ZONE*\n\nChoose a game to play:\n\n1. *Number Guessing* → \`.guess\`\n2. *Trivia* → \`.trivia\`\n3. *What's Behind the Wall* → \`.wallgame\`\n\nNew games added frequently!`,
    });
  },
};
