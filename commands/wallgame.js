// commands/wallgame.js

const walls = {
  1: "🎁 You found a *Gift Box*! Lucky you!",
  2: "💣 Oops! It was a *trap bomb*! You lost 10 XP.",
  3: "🐱 Aww! A cute *kitten* popped out!",
  4: "👻 Boo! A *ghost* scared you away!",
  5: "🍕 You found a slice of *pizza*! 🍴",
  6: "🪙 Jackpot! You found *100 XP coins*!",
  7: "😴 Just an *empty wall*... Try again!",
};

module.exports = {
  name: "wallgame",
  description: "Guess what's behind the wall!",
  execute: async (sock, msg, args) => {
    const options = Object.keys(walls);
    const selected = options[Math.floor(Math.random() * options.length)];
    const result = walls[selected];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧱 *What's Behind The Wall?*\n\nYou picked wall *#${selected}*.\n\n${result}`,
    });
  },
};
