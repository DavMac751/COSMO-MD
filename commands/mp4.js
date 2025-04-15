const axios = require('axios');

module.exports = {
  name: 'mp4',
  description: 'Download MP4 video from YouTube',
  category: 'media',
  async execute(sock, m, args, command, prefix) {
    const query = args.join(' ');
    if (!query) return m.reply(`🎬 Please provide a video name.\nUsage: \`${prefix}mp4 how to make pizza\``);

    try {
      const fakeVideoLink = `https://example.com/fake-mp4/${encodeURIComponent(query)}.mp4`;

      const caption = `
🎞️ *Video Title:* ${query}
📥 *Download MP4:* ${fakeVideoLink}
⚠️ Note: This is a demo. Real video download support can be added later.
      `.trim();

      await sock.sendMessage(m.chat, {
        text: caption
      }, { quoted: m });

    } catch (e) {
      console.error(e);
      m.reply('❌ Error while fetching MP4 download link.');
    }
  }
};
