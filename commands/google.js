// commands/google.js
const axios = require("axios");

module.exports = {
  name: "google",
  description: "Search something on Google.",
  execute: async (sock, msg, args) => {
    const query = args.join(" ");
    if (!query) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "🔍 Please provide something to search.\nExample: `.google cat facts`",
      });
    }

    try {
      const url = `https://api.popcat.xyz/google?q=${encodeURIComponent(query)}`;
      const res = await axios.get(url);
      const results = res.data.slice(0, 3); // limit results

      let response = `🌐 *Google Search Results for:* _${query}_\n\n`;
      results.forEach((r, i) => {
        response += `*${i + 1}. ${r.title}*\n_${r.desc}_\n🔗 ${r.link}\n\n`;
      });

      await sock.sendMessage(msg.key.remoteJid, { text: response });
    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Failed to fetch results. Try again later.",
      });
    }
  },
};
