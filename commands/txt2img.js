const axios = require("axios");

module.exports = {
  name: "txt2img",
  desc: "Generate stylish image from text",
  category: "🎨 Image Tools",
  usage: ".txt2img <your text>",
  async exec(m, sock, args) {
    if (!args[0]) return m.reply("📝 Please provide some text.");
    const text = args.join(" ");
    
    let url = `https://www6.flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=runner-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${encodeURIComponent(text)}`;
    
    await sock.sendMessage(m.chat, { image: { url }, caption: `🖼️ Here is your fancy image, *${text}*` }, { quoted: m });
  }
};
