const { MessageType, Mimetype } = require('@whiskeysockets/baileys');

module.exports = {
  name: "sticker",
  alias: ["s", "st"],
  desc: "Convert image to sticker",
  category: "🖼️ Image & Text",
  usage: ".sticker (reply to an image)",
  async exec(m, sock) {
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return sock.sendMessage(m.chat, {
        text: "📸 Please reply to an image with `.sticker` to convert it to a sticker.",
      }, { quoted: m });
    }

    let media = await sock.downloadMediaMessage(m.quoted);
    
    await sock.sendMessage(m.chat, {
      sticker: media,
    }, { quoted: m });
  }
};
