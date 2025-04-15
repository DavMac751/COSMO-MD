const express = require('express');
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/pair', async (req, res) => {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('connection.update', async ({ qr, connection }) => {
    if (qr) {
      const qrImage = await qrcode.toDataURL(qr);
      res.send(`
        <html><body>
          <h1>Scan this QR to login:</h1>
          <img src="${qrImage}" />
        </body></html>
      `);
    }

    if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
      await saveCreds();
    }
  });

  sock.ev.on('creds.update', saveCreds);
});

app.listen(port, () => {
  console.log(`🟢 Visit http://localhost:${port}/pair to scan QR`);
});
