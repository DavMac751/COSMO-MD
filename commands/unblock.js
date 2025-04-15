// commands/unblock.js

module.exports = {
  name: "unblock",
  description: "Unblock a user by their number in DM.",
  execute: async (sock, msg, args) => {
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith("@g.us");
    const fromMe = msg.key.fromMe;

    if (isGroup) {
      return await sock.sendMessage(sender, {
        text: "🚫 This command only works in DM (private chat).",
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
        text: "📥 Please provide a valid phone number.\n\nExample: `.unblock 254712345678`",
      });
    }

    const jid = number + "@s.whatsapp.net";
    try {
      await sock.updateBlockStatus(jid, "unblock");
      await sock.sendMessage(sender, {
        text: `✅ Unblocked @${number}`,
        mentions: [jid],
      });
    } catch (e) {
      console.error(e);
      await sock.sendMessage(sender, {
        text: "❌ Failed to unblock the number.",
      });
    }
  },
};
