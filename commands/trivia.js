// commands/trivia.js
const questions = [
  {
    question: "What is the capital of Kenya?",
    options: ["A. Nairobi", "B. Mombasa", "C. Kisumu", "D. Nakuru"],
    answer: "A",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["A. Earth", "B. Venus", "C. Mars", "D. Jupiter"],
    answer: "C",
  },
  {
    question: "How many continents are there on Earth?",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    answer: "C",
  },
];

module.exports = {
  name: "trivia",
  description: "Play a trivia game",
  execute: async (sock, msg, args) => {
    const random = questions[Math.floor(Math.random() * questions.length)];

    const triviaMessage = `🧠 *Trivia Time!*\n\n${random.question}\n${random.options.join("\n")}\n\n_Reply with the correct letter (e.g. A, B, C, D)._`;

    await sock.sendMessage(msg.key.remoteJid, { text: triviaMessage });

    // Optional: Add a listener for answers (not persistent across messages yet)
  },
};
