const axios = require('axios');
const config = require('../config');

module.exports = {
  name: 'weather',
  description: 'Get current weather for a location',
  category: 'utilities',
  async execute(sock, m, args, command, prefix) {
    const query = args.join(' ');
    if (!query) return m.reply(`🌦️ Please enter a city or country.\nUsage: \`${prefix}weather Nairobi\``);

    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${config.openWeatherApiKey}`);
      const data = res.data;

      const weatherMsg = `
📍 *${data.name}, ${data.sys.country}*
🌡️ Temp: ${data.main.temp}°C
💧 Humidity: ${data.main.humidity}%
🌬️ Wind: ${data.wind.speed} m/s
🌤️ Condition: ${data.weather[0].main} - ${data.weather[0].description}
      `.trim();

      m.reply(weatherMsg);
    } catch (err) {
      console.error(err);
      m.reply('❌ Could not find weather data. Make sure the city is valid.');
    }
  }
};
