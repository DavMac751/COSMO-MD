module.exports = {
  botName: 'COSMO🤡',
  ownerName: 'Jack',
  ownerNumber: ['2547XXXXXXX@s.whatsapp.net'], // Replace with your actual WhatsApp ID
  prefix: '.',
  sessionName: 'cosmosession',
  emojis: {
    success: '✅',
    error: '❌',
    bot: '🤖',
    warning: '⚠️',
    game: '🎮',
    music: '🎵',
    admin: '🛡️'
  },
  messages: {
    alive: '🤡 *COSMO Bot is up and running!*',
    success: '✅ Done!',
    adminOnly: '🛡️ This command is for admins only!',
    ownerOnly: '👑 Only my master can use this!',
    error: '❌ Oops! Something went wrong.',
    welcome: '👋 Welcome to the group!',
    goodbye: '👋 Bye bye!'
  },
  adminCommands: ['block', 'unblock', 'kick', 'add', 'promote', 'demote'],
  gameCommands: ['guessnumber', 'trivia', 'behindwall']
};
