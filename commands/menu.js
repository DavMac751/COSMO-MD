module.exports = {
  name: 'menu',
  description: 'Shows COSMO🤡 bot command categories and help menu',
  async execute(sock, m, args) {
    const text = `
*🤡 COSMO-MD v3.0.0 🤡*

📖 *General Commands*
• .menu - Show this menu
• .alive - Bot status
• .allcmds - List all commands

🧠 *AI & Search*
• .ask [text] - Chat with AI
• .ask -v [text] - AI voice reply
• .google [query] - Google search

🎮 *Games*
• .guess - Guess the number
• .trivia - Trivia question
• .wall - What’s behind the wall

🎬 *Media Download*
• .song [name] - MP3 downloader
• .video [name] - MP4 downloader
• .movie [name] - Movie search/download
• .imgdl [keyword] - Download image

🧰 *Utilities*
• .weather [city] - Weather lookup
• .rank - Show your level
• .block [@user] - Block user (DM/Group)
• .unblock [@user] - Unblock user

🖼️ *Fun Images*
• .sticker (image reply) - Convert to sticker
• .fancyimg [text] - Fancy text image
• .txt2img [text] - Text to image

⚙️ *Admin*
• .adminpanel - Show admin tools
• .on [command] - Enable a command
• .off [command] - Disable a command

*Prefix:* `.`
*Owner:* YOU
    `.trim();

    await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m });
  }
};
