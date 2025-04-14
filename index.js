const express = require('express');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');
const app = express();

const PREFIX = '.';
const PORT = process.env.PORT || 3000;

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const body = (type === 'conversation')
      ? msg.message.conversation
      : (type === 'extendedTextMessage')
        ? msg.message.extendedTextMessage.text
        : '';

    if (!body.startsWith(PREFIX)) return;

    const args = body.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const send = (text) => sock.sendMessage(from, { text });

    // Games & Admins
    switch (command) {
      case 'adminpanel':
        send(`🤡 *COSMO Admin Panel* 🤡\n\n• .block @user\n• .kick @user\n• .rank\n• .ban @user`);
        break;

      case 'guess':
        const num = Math.floor(Math.random() * 10) + 1;
        send(`🎲 Guess a number (1-10). Reply with .pick [number]`);
        sock.ev.once('messages.upsert', async ({ messages }) => {
          const reply = messages[0];
          const choice = parseInt(reply.message.conversation?.split(" ")[1]);
          if (choice === num) send("Correct! You leveled up!");
          else send(`Wrong! It was ${num}`);
        });
        break;

      case 'trivia':
        send("❓ *Trivia:* What is the capital of Kenya?\nA. Nairobi\nB. Kisumu\nC. Mombasa");
        sock.ev.once('messages.upsert', async ({ messages }) => {
          const reply = messages[0];
          if (reply.message.conversation?.toLowerCase().includes('a')) send("Correct! Nairobi it is!");
          else send("Wrong answer.");
        });
        break;

      case 'wall':
        send("🧱 What's behind the wall?\nA. Cat\nB. Dog\nC. Treasure");
        sock.ev.once('messages.upsert', async ({ messages }) => {
          const reply = messages[0];
          if (reply.message.conversation?.toLowerCase().includes('c')) send("Treasure! You ranked up!");
          else send("Oops, try again!");
        });
        break;

      case 'block':
        if (msg.key.participant) {
          await sock.updateBlockStatus(msg.key.participant, "block");
          send("User blocked.");
        } else {
          send("Reply to a user to block them.");
        }
        break;

      case 'kick':
        if (msg.key.participant) {
          await sock.groupParticipantsUpdate(from, [msg.key.participant], 'remove');
          send("User kicked.");
        } else {
          send("Reply to a user to kick.");
        }
        break;

      case 'google':
        const gquery = args.join(" ");
        if (!gquery) return send("What do you want me to search?");
        send(`Searching Google for: ${gquery}\nhttps://www.google.com/search?q=${encodeURIComponent(gquery)}`);
        break;

      case 'ask':
        const q = args.join(" ");
        if (!q) return send("Ask me something.");
        send(`🤖 COSMO🤡 says: I don't know... yet! GPT coming soon.`);
        break;

      case 'weather':
        const city = args.join(" ");
        if (!city) return send("Enter a city name.");
        try {
          const wres = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
          send(`🌤 ${wres.data}`);
        } catch {
          send("Couldn't get weather.");
        }
        break;

      case 'mp3':
        const song = args.join(" ");
        if (!song) return send("Enter a song name.");
        send(`Pretending to download ${song}. (Integration coming soon!)`);
        break;

      case 'mp4':
        const vid = args.join(" ");
        if (!vid) return send("Enter a video name.");
        send(`Pretending to download video: ${vid}`);
        break;

      case 'anime':
        const animeName = args.join(" ");
        if (!animeName) return send("Type the anime/movie name.");
        try {
          const aniRes = await axios.get(`https://api.consumet.org/anime/gogoanime/${encodeURIComponent(animeName)}`);
          const results = aniRes.data.results;
          if (!results || results.length === 0) return send("No results found.");
          const top = results[0];
          let txt = `🎥 *${top.title}*\n\n📺 Episodes: ${top.totalEpisodes || 'N/A'}\n🔗 Watch: ${top.url}`;
          send(txt);
        } catch (err) {
          send("Failed to fetch.");
        }
        break;

      case 'img':
        const imageName = args.join(" ");
        if (!imageName) return send("Enter image search.");
        send(`🔍 Downloading image for: ${imageName}\nhttps://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageName)}`);
        break;

      default:
        send("🤖 Unknown command. Try `.adminpanel` or `.guess`");
    }
  });

  console.log("COSMO🤡 is alive!");
};

startBot();

app.get("/", (req, res) => res.send("COSMO🤡 is running..."));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
