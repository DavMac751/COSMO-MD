module.exports = {
  name: "kick",
  desc: "Remove a member from group",
  category: "👮 Group Moderation",
  usage: ".kick @user",
  async exec(m, sock) {
    if (!m.isGroup) return m.reply("❌ This command only works in groups.");
    if (!m.isAdmin) return m.reply("🚫 You need to be an admin.");
    if (!m.mentionedJid[0]) return m.reply("❗ Mention a user to kick.");

    await sock.groupParticipantsUpdate(m.chat, [m.mentionedJid[0]], "remove");
  }
};
