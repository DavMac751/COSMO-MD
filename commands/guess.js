// commands/guess.js
module.exports = {
  name: "guess",
  description: "Guess a number between 1 and 10",
  execute: async (sock, msg, args) => {
    const guess = parseInt(args[0]);
    const target = Math.floor(Math.random() * 10) + 1;

    if (!guess || guess < 1 || guess > 10) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🎯 Guess a number between 1 and 10!\n\nExample: `.guess 4`",
      });
      return;
    }

    if (guess === target) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🎉 Congratulations! You guessed right! The number was ${target}.`,
      });
    } else {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Oops! You guessed ${guess}, but the number was ${target}. Try again!`,
      });
    }
  },
};
