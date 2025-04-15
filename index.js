// index.js - Full COSMO🤡 Bot Setup

const express = require('express'); const { Boom } = require('@hapi/boom'); const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys'); const fs = require('fs'); const path = require('path'); const { addXP, getRank } = require('./db/rank'); const app = express(); const PORT = process.env.PORT || 3000;

// Load image paths from public const menuImage = './public/main.jpg'; const gamesImage = './public/games.jpg'; const logoImage = './public/logo.jpg';

// Middleware for static images app.use('/public', express.static('public'));

// WhatsApp Socket Setup async function startBot() { const { state, saveCreds } = await useMultiFileAuthState('auth'); const sock = makeWASocket({ auth: state, printQRInTerminal: true });

sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', ({ connection, lastDisconnect }) => { if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) { startBot(); } else if (connection === 'open') { console.log('COSMO🤡 Bot is online!'); } });

sock.ev.on('messages.upsert', async ({ messages, type }) => { if (!messages || !messages[0].message) return; const msg = messages[0]; const from = msg.key.remoteJid; const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''; const command = text.trim().split(' ')[0];

// XP & Rank
addXP(from);

// Command Handlers
switch (command) {
  case '.alive':
    await sock.sendMessage(from, { image: { url: menuImage }, caption: 'COSMO🤡 is alive and dancing!' });
    break;

  case '.menu':
    await sock.sendMessage(from, { image: { url: menuImage }, caption: '*COSMO🤡 COMMAND MENU*\n\n.menu\n.games\n.ask <query>\n.google <search>\n.mp3 <url>\n.mp4 <url>\n.movie <title>\n.block <user>\n.unblock <user>\n.rank\n.logo' });
    break;

  case '.games':
    await sock.sendMessage(from, { image: { url: gamesImage }, caption: '🎮 COSMO🤡 Game Zone!\n- Guess Number\n- What's Behind the Wall\n- Trivia Challenge' });
    break;

  case '.logo':
    await sock.sendMessage(from, { image: { url: logoImage }, caption: 'COSMO🤡 OFFICIAL LOGO' });
    break;

  case '.rank':
    const rank = getRank(from);
    await sock.sendMessage(from, { text: `🏆 Rank: Level ${rank.level}, XP: ${rank.xp}` });
    break;

  case '.ask': {
    const prompt = text.split(' ').slice(1).join(' ');
    if (!prompt) return sock.sendMessage(from, { text: 'Ask me something like `.ask What is AI?`' });
    const reply = `🤖 *COSMO🤡 says:* ${prompt} (mock response)`; // Replace with GPT logic if desired
    await sock.sendMessage(from, { text: reply });
    break;
  }

  case '.google': {
    const query = text.split(' ').slice(1).join(' ');
    if (!query) return sock.sendMessage(from, { text: 'Try: `.google What is quantum computing?`' });
    const searchLink = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await sock.sendMessage(from, { text: `🔍 Search result: ${searchLink}` });
    break;
  }

  case '.mp3': {
    await sock.sendMessage(from, { text: '🎵 Your MP3 is being processed... (mock)' });
    break;
  }

  case '.mp4': {
    await sock.sendMessage(from, { text: '🎬 Your MP4 is being processed... (mock)' });
    break;
  }

  case '.movie': {
    const movie = text.split(' ').slice(1).join(' ');
    if (!movie) return sock.sendMessage(from, { text: 'Type: `.movie Interstellar`' });
    await sock.sendMessage(from, { text: `🎥 Searching for movie: ${movie} (mock)` });
    break;
  }

  case '.block': {
    const jid = text.split(' ')[1];
    if (!jid) return sock.sendMessage(from, { text: 'Type: `.block 2547xxxxxxx@s.whatsapp.net`' });
    await sock.updateBlockStatus(jid, 'block');
    await sock.sendMessage(from, { text: `🚫 User blocked: ${jid}` });
    break;
  }

  case '.unblock': {
    const jid = text.split(' ')[1];
    if (!jid) return sock.sendMessage(from, { text: 'Type: `.unblock 2547xxxxxxx@s.whatsapp.net`' });
    await sock.updateBlockStatus(jid, 'unblock');
    await sock.sendMessage(from, { text: `✅ User unblocked: ${jid}` });
    break;
  }

  default:
    if (command.startsWith('.')) {
      await sock.sendMessage(from, { text: 'Unknown command. Use `.menu` to view available commands.' });
    }
    break;
}

}); }

startBot();

app.listen(PORT, () => console.log(COSMO🤡 Web server running on http://localhost:${PORT}));
