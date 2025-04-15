// COSMO🤡 - index.js (FULL BUNDLE)

const { Boom } = require('@hapi/boom');
const fs = require('fs');
const pino = require('pino');
const figlet = require('figlet');
const readline = require('readline');
const axios = require('axios');
const { exec } = require('child_process');
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { addXP, getRank } = require('./lib/rank');

const prefix = '.';
const emoji = '🤡';

console.log(figlet.textSync('COSMO BOT'));

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;
    const msg = m.message.conversation || m.message.extendedTextMessage?.text;
    const sender = m.key.remoteJid;

    if (!msg.startsWith(prefix)) return;

    const command = msg.slice(1).trim().split(/\s+/)[0].toLowerCase();
    const args = msg.trim().split(/\s+/).slice(1);
    const reply = (text) => sock.sendMessage(sender, { text }, { quoted: m });

    // XP System
    const userRank = addXP(sender);
    if (userRank.levelUp) reply(`🎉 Congrats! You leveled up to *Level ${userRank.level}*`);

    // COMMAND HANDLER
    switch (command) {
      case 'menu':
        reply(`${emoji} *COSMO🤡 MENU* ${emoji}\n
1. .ask <question>\n2. .google <query>\n3. .trivia\n4. .guess\n5. .behindwall\n6. .mp3 <url>\n7. .mp4 <url>\n8. .imgdl <url>\n9. .movie <title>\n10. .rank`);
        break;

      case 'ask':
        const q = args.join(' ');
        if (!q) return reply('Ask me something...');
        const askRes = await axios.post('https://api.popcat.xyz/chatgpt', { msg: q });
        reply(`💬 *Cosmo says:*\n${askRes.data.response}`);
        break;

      case 'google':
        const gquery = args.join(' ');
        if (!gquery) return reply('Provide a search term.');
        const googleRes = await axios.get(`https://api.popcat.xyz/google?q=${encodeURIComponent(gquery)}`);
        const result = googleRes.data.results.slice(0, 3).map((r, i) => `${i + 1}. ${r.title}\n${r.link}\n`).join('\n');
        reply(`🔍 *Top Results:*\n${result}`);
        break;

      case 'trivia':
        reply(`🎲 Trivia: What’s the capital of Kenya?\nA. Nairobi\nB. Mombasa\nC. Kisumu\n(Type .a, .b, .c)`);
        break;

      case 'guess':
        reply('🎯 I’m thinking of a number between 1 and 5. Guess using .1, .2, etc.');
        break;

      case 'behindwall':
        reply(`🧱 What’s behind the wall?\n1. Treasure\n2. Snake\n3. Key\n4. Ghost\nType .1 .2 etc.`);
        break;

      case 'mp3':
        const mp3url = args[0];
        if (!mp3url) return reply('Send a valid YouTube URL.');
        reply(`⬇️ Downloading MP3 from: ${mp3url}`);
        break;

      case 'mp4':
        const mp4url = args[0];
        if (!mp4url) return reply('Send a valid YouTube URL.');
        reply(`⬇️ Downloading MP4 from: ${mp4url}`);
        break;

      case 'imgdl':
        const imgurl = args[0];
        if (!imgurl) return reply('Send a valid image URL.');
        reply(`📷 Downloading image: ${imgurl}`);
        break;

      case 'movie':
        const title = args.join(' ');
        if (!title) return reply('Send a movie name.');
        reply(`🎬 Searching for: ${title}`);
        break;

      case 'rank':
        const r = getRank(sender);
        reply(`🏅 Your Level: *${r.level}*\nXP: ${r.xp}`);
        break;

      case 'block':
        if (!m.key.fromMe) return reply('Only owner can use this.');
        const toBlock = m.message.extendedTextMessage?.contextInfo?.participant;
        if (toBlock) {
          await sock.updateBlockStatus(toBlock, 'block');
          reply(`✅ Blocked ${toBlock}`);
        } else {
          reply('Reply to someone to block.');
        }
        break;

      case 'alive':
        reply(`${emoji} *COSMO🤡 ALIVE* ${emoji}\nI’m online and ready!`);
        break;
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect.error).output.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log('Logged out. Scan again.');
        process.exit();
      } else {
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('COSMO🤡 is online.');
    }
  });
}

connectToWhatsApp();
