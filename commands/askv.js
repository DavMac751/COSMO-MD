const axios = require('axios');
const { textToSpeech } = require('../lib/tts'); // Make sure you have this helper function
const fs = require('fs');

module.exports = {
  name: 'askv',
  description: 'ChatGPT-style AI response with voice',
  category: 'ai',
  async execute(sock, m, args, command, prefix) {
    const input = args.join(' ').trim();
    if (!input) return m.reply(`🗣️ Please ask something!\nUsage: \`${prefix}ask -v Tell me a joke\``);

    try {
      m.reply('🎧 Thinking...');

      const response = await axios.post('https://api.affiliateplus.xyz/api/chatgpt', {
        message: input,
        lang: 'en'
      });

      const text = response.data?.message || "I don't have a response.";
      const audioPath = await textToSpeech(text, 'en'); // Save audio locally

      const audioBuffer = fs.readFileSync(audioPath);
      await sock.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: m });

      fs.unlinkSync(audioPath); // Delete after sending
    } catch (err) {
      console.error(err);
      m.reply('❌ Error generating voice response.');
    }
  }
};
