// COSMO🤡 Bot - index.js // All commands and features are integrated here

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@whiskeysockets/baileys'); const { Boom } = require('@hapi/boom'); const express = require('express'); const fs = require('fs'); const pino = require('pino'); const app = express(); const axios = require('axios'); const path = require('path');

const prefix = '.';

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

async function startBot() { const { state, saveCreds } = await useMultiFileAuthState('auth');

const conn = makeWASocket({ logger: pino({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ['COSMO🤡', 'Safari', '3.0.0'] });

store.bind(conn.ev);

conn.ev.on('messages.upsert', async ({ messages }) => { const m = messages[0]; if (!m.message || m.key.fromMe) return;

const type = Object.keys(m.message)[0];
const body = m.message[type]?.text || m.message[type]?.caption || '';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const text = args.join(' ');
const sender = m.key.remoteJid;
const from = m.key.remoteJid;
const isGroup = from.endsWith('@g.us');
const isCreator = m.key.participant === conn.user.id || from === conn.user.id;

if (!isCmd) return;

switch (command) {
  case 'menu':
    await conn.sendMessage(from, { text: `*COSMO🤡 Bot Menu*

.ask - Chat with GPT .google <query> - Search Google .weather <city> - Get weather .mp3 <url> - Download MP3 .mp4 <url> - Download MP4 .image <query> - Download image .movie <title> - Search movie .guess - Play number guess game .trivia - Play trivia .wall - Play what's behind the wall .block - Block user (owner only)` }); break;

case 'ask':
    if (!text) return conn.sendMessage(from, { text: 'Ask something...' });
    const gpt = await axios.get(`https://api.popcat.xyz/chatgpt?msg=${encodeURIComponent(text)}`);
    conn.sendMessage(from, { text: `*COSMO🤡 Replies:*

${gpt.data.response}` }); break;

case 'google':
    if (!text) return conn.sendMessage(from, { text: 'Enter a search term' });
    const googleRes = await axios.get(`https://api.popcat.xyz/google?q=${encodeURIComponent(text)}`);
    conn.sendMessage(from, { text: `*Google Results:*

${googleRes.data.results.map(r => • ${r.title} - ${r.link}).join('\n')}` }); break;

case 'weather':
    if (!text) return conn.sendMessage(from, { text: 'Enter a city name.' });
    const weather = await axios.get(`https://api.popcat.xyz/weather?q=${text}`);
    conn.sendMessage(from, { text: `*Weather in ${weather.data.location.name}:*

Temperature: ${weather.data.current.temperature}°C Condition: ${weather.data.current.condition.text}` }); break;

case 'mp3':
    if (!text) return conn.sendMessage(from, { text: 'Provide YouTube link' });
    const mp3 = await axios.get(`https://api.vevioz.com/api/button/mp3/${text}`);
    conn.sendMessage(from, { text: `*MP3 Download:*

${mp3.data.url}` }); break;

case 'mp4':
    if (!text) return conn.sendMessage(from, { text: 'Provide YouTube link' });
    const mp4 = await axios.get(`https://api.vevioz.com/api/button/mp4/${text}`);
    conn.sendMessage(from, { text: `*MP4 Download:*

${mp4.data.url}` }); break;

case 'image':
    const img = await axios.get(`https://api.unsplash.com/photos/random?query=${text}&client_id=YOUR_UNSPLASH_API_KEY`);
    conn.sendMessage(from, { image: { url: img.data.urls.full }, caption: `Image for: ${text}` });
    break;

  case 'movie':
    const movie = await axios.get(`https://www.omdbapi.com/?t=${text}&apikey=YOUR_OMDB_KEY`);
    if (movie.data.Response === 'False') return conn.sendMessage(from, { text: 'Movie not found.' });
    conn.sendMessage(from, { text: `*${movie.data.Title}*

${movie.data.Plot} IMDB: ${movie.data.imdbRating}` }); break;

case 'guess':
    const rand = Math.floor(Math.random() * 10) + 1;
    conn.sendMessage(from, { text: 'Guess a number (1-10)! Reply with your guess.' });
    break;

  case 'trivia':
    const trivia = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    const t = trivia.data.results[0];
    conn.sendMessage(from, { text: `*Trivia:*

${t.question} A. ${t.correct_answer} B. ${t.incorrect_answers.join('\n')}` }); break;

case 'wall':
    conn.sendMessage(from, { text: `Behind the wall is...

1. Gold


2. Monster


3. Nothing Reply with your choice.` }); break;

case 'block': if (!isCreator) return conn.sendMessage(from, { text: 'Only the owner can use this command.' }); if (isGroup) return conn.sendMessage(from, { text: 'Use in DMs only.' }); await conn.updateBlockStatus(from, 'block'); conn.sendMessage(from, { text: 'User blocked successfully.' }); break;

default: conn.sendMessage(from, { text: Unknown command: ${command} }); } });



conn.ev.on

  
