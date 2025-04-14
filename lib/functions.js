// lib/functions.js
const axios = require("axios");
const fetch = require("node-fetch");

// Function: Get weather by city
async function getWeather(city) {
    try {
        const apiKey = 'your_openweathermap_api_key';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const res = await axios.get(url);
        const data = res.data;
        return `Weather in ${data.name}:
- ${data.weather[0].main}: ${data.weather[0].description}
- Temp: ${data.main.temp}°C
- Humidity: ${data.main.humidity}%`;
    } catch (e) {
        return "Couldn't fetch weather data. Try again.";
    }
}

module.exports = {
    getWeather
};
