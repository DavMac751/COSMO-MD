} else if (command === 'rank') {
  const { xp, level, nextLevelXP } = getRank(sender);
  await sock.sendMessage(from, { text: `📊 *${name}'s Rank*\n\nLevel: ${level}\nXP: ${xp} / ${nextLevelXP}` });
}

else if (command === 'guess') {
  const random = Math.floor(Math.random() * 10) + 1;
  const reply = `I'm thinking of a number between 1 and 10... Guess it! (Just reply to this message)`;
  const sentMsg = await sock.sendMessage(from, { text: reply });

  sock.ev.once('messages.upsert', async ({ messages }) => {
    const userGuess = parseInt(messages[0].message?.conversation || '');
    if (userGuess === random) {
      const result = addXP(sender);
      await sock.sendMessage(from, { text: `✅ Correct! It was ${random}.` });
      if (result.levelUp) {
        await sock.sendMessage(from, { text: `🎉 Congrats ${name}! You've leveled up to Level ${result.level}` });
      }
    } else {
      await sock.sendMessage(from, { text: `❌ Nope! It was ${random}. Try again!` });
    }
  });

} else if (command === 'trivia') {
  const question = "What is the capital of Kenya?\n\nA. Nairobi\nB. Mombasa\nC. Kisumu\nD. Eldoret";
  const correct = 'A';

  await sock.sendMessage(from, { text: question });

  sock.ev.once('messages.upsert', async ({ messages }) => {
    const response = messages[0].message?.conversation?.trim().toUpperCase();
    if (response === correct) {
      const result = addXP(sender);
      await sock.sendMessage(from, { text: `✅ Correct! Nairobi is the capital of Kenya.` });
      if (result.levelUp) {
        await sock.sendMessage(from, { text: `🎉 Level up! You're now Level ${result.level}.` });
      }
    } else {
      await sock.sendMessage(from, { text: `❌ Wrong! The correct answer was A. Nairobi.` });
    }
  });

} else if (command === 'whatswall') {
  const options = ['🧱 Brick', '🪟 Window', '🚪 Door', '🐱 Cat'];
  const correctOption = '🐱 Cat';
  const prompt = `Guess what's behind the wall:\n\n${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}`;

  await sock.sendMessage(from, { text: prompt });

  sock.ev.once('messages.upsert', async ({ messages }) => {
    const guess = messages[0].message?.conversation?.trim().toUpperCase();
    const index = guess.charCodeAt(0) - 65;
    const userOption = options[index];
    if (userOption === correctOption) {
      const result = addXP(sender);
      await sock.sendMessage(from, { text: `✅ Yes! It was a ${correctOption} behind the wall.` });
      if (result.levelUp) {
        await sock.sendMessage(from, { text: `🎊 Level up! You're now Level ${result.level}.` });
      }
    } else {
      await sock.sendMessage(from, { text: `❌ Nope! It was ${correctOption}.` });
    }
  });
}
