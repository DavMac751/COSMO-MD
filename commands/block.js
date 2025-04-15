// commands/block.js

module.exports = {
  name: "block",
  description: "Block a user by their number in DM.",
  execute: async (sock, msg, args) => {
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith("@g.us");
    const fromMe = msg.key.fromMe;

    if (isGroup) {
      return await sock.sendMessage(sender, {
        text: "🚫 This command only works in private DM.",
      });
    }

    if (!fromMe) {
      return await sock.sendMessage(sender, {
        text: "⚠️ Only the bot owner can use this command.",
      });
    }

    const number = args[0];
    if (!number || !number.match(/^\d{7,15}$/)) {
      return await sock.sendMessage(sender, {
        text: "📥 Please provide a valid phone number.\n\nExample: `.block 254712345678`",
      });
    }

    const jid = number + "@s.whatsapp.net";
    try {
      await sock.updateBlockStatus(jid, "block");
      await sock.sendMessage(sender, {
        text: `✅ Blocked @${number}`,
        mentions: [jid],
      });
    } catch (e) {
      console.error(e);
      await sock.sendMessage(sender, {
        text: "❌ Failed to block the number.",
      });
    }
  },
};
