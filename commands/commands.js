module.exports = {
  name: "commands",
  alias: ["menu", "help", "cmds"],
  desc: "Show all available commands",
  category: "🧾 Info",
  usage: ".commands",
  async exec(m, sock, args, store, db) {
    const sections = [
      {
        title: "🤖 General Commands",
        commands: [
          ".menu", ".alive", ".commands", ".google", ".ask", ".ask -v"
        ]
      },
      {
        title: "🎮 Games",
        commands: [
          ".guess", ".trivia", ".behind"
        ]
      },
      {
        title: "🎶 Media Downloads",
        commands: [
          ".mp3", ".mp4", ".movie", ".imgdl"
        ]
      },
      {
        title: "🖼️ Image & Text",
        commands: [
          ".toimg", ".txt2img", ".fancyimg"
        ]
      },
      {
        title
