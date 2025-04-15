const axios = require('axios');

module.exports = {
  name: 'mp3',
  description: 'Download MP3 from YouTube',
  category: 'media',
  async execute(sock, m, args, command, prefix) {
    const query = args.join(' ');
    if (!query) return m.reply(`🎶 Please provide a song name.\nUsage: \`${prefix}mp3 perfect ed sheeran\``);

    try {
      const fakeUrl = `https://example.com/fake-mp3/${encodeURIComponent(query)}.mp3`;

      const caption = `
🎵 *Title:* ${query}
⬇️ *Download MP3:* ${fakeUrl}
⚠️ Note: This is a simulated link. Real downloading can be added using RapidAPI or yt-dlp server.
      `.trim();

      await sock.sendMessage(m.chat, {
        text: caption,
      }, { quoted: m });

    } catch (e) {
      console.error(e);
      m.reply('❌ Error while fetching MP3 download link.');
    }
  }
};
