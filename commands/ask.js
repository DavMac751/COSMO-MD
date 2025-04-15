const axios = require('axios');

module.exports = {
  name: 'ask',
  description: 'ChatGPT-style AI response',
  category: 'ai',
  async execute(sock, m, args, command, prefix) {
    const input = args.join(' ').trim();
    if (!input) return m.reply(`🤖 Please ask a question!\nUsage: \`${prefix}ask How are you?\``);

    try {
      m.reply('💭 Thinking...');
      
      const response = await axios.post('https://api.affiliateplus.xyz/api/chatgpt', {
        message: input,
        lang: 'en'
      });

      const answer = response.data?.message || "I couldn't come up with a response.";
      m.reply(`💬 ${answer}`);
    } catch (err) {
      console.error('ChatGPT Error:', err);
      m.reply('❌ Sorry, something went wrong with the AI response.');
    }
  }
};
