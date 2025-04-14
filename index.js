const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys'); const P = require('pino'); const fs = require('fs'); const express = require('express'); const app = express();

const menuImage = 'https://i.postimg.cc/vHdnnJy3/1000104730.jpg'; const aliveImage = 'https://i.postimg.cc/vHdnnJy3/1000104730.jpg'; const gamesImage = 'https://i.postimg.cc/HsP5vB7y/images-3.jpg';

async function startBot() { const { state, saveCreds } = await useMultiFileAuthState('./session'); const { version } = await fetchLatestBaileysVersion();

const conn = makeWASocket({ version, printQRInTerminal: true, auth: state, logger: P({ level: 'silent' }), });

conn.ev.on('creds.update', saveCreds);

conn.ev.on('messages.upsert', async ({ messages }) => { const msg = messages[0]; if (!msg.message || msg.key.fromMe) return;

const from = msg.key.remoteJid;
const type = Object.keys(msg.message)[0];
const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
if (!body.startsWith('.')) return;

const args = body.slice(1).trim().split(/ +/);
const command = args.shift().toLowerCase();

if (command === 'menu') {
  await conn.sendMessage(from, {
    image: { url: menuImage },
    caption: '🎪 *COSMO🤡 Menu*\n\nType `.games` to see fun games\nType `.google` to search Google\nType `.mp3` to download songs\nType `.movie` for movie search/download\nAnd much more!'
  }, { quoted: msg });
} else if (command === 'alive') {
  await conn.sendMessage(from, {
    image: { url: aliveImage },
    caption: '🤡 *COSMO is Alive and Ready!*\n\nTry `.menu` or `.ask Hello`'
  }, { quoted: msg });
} else if (command === 'games') {
  await conn.sendMessage(from, {
    image: { url: gamesImage },
    caption: '🎮 *COSMO Game Zone!*\n\n1. `.guess` - Guess the number\n2. `.trivia` - Trivia challenge\n3. `.wall` - What\'s behind the wall?\n\nLet\'s goooo!'
  }, { quoted: msg });
}

}); }

startBot();

app.get('/', (req, res) => res.send('🤡 COSMO Bot is running!')); app.listen(process.env.PORT || 3000, () => console.log('Server running...'));

