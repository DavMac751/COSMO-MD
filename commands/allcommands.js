module.exports = {
  name: 'allcmds',
  description: 'Lists all available commands from all command files',
  async execute(sock, m, args, commands) {
    let cmdList = '*🤖 COSMO-MD: All Commands 🤖*\n\n';

    for (let cmd of commands) {
      cmdList += `• .${cmd.name} - ${cmd.description || 'No description'}\n`;
    }

    await sock.sendMessage(m.key.remoteJid, { text: cmdList }, { quoted: m });
  }
};
