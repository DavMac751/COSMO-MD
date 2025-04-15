const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: 'image',
  description: 'Search and download images',
  category: 'media',
  async execute(sock, m, args, command, prefix) {
    const query = args.join(' ');
    if (!query) return m.reply(`📸 Please provide a search term.\nUsage: \`${prefix}image cute cat\``);

    try {
      const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;

      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const imageLinks = [];

      $('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.startsWith('http')) {
          imageLinks.push(src);
        }
      });

      if (imageLinks.length === 0) return m.reply('😢 No images found.');

      await sock.sendMessage(m.chat, {
        image: { url: imageLinks[0] },
        caption: `🖼️ Result for: *${query}*`
      }, { quoted: m });

    } catch (e) {
      console.error(e);
      m.reply('❌ Failed to fetch images. Try again later.');
    }
  }
};
