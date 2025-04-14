// utils/downloads.js
const ytdl = require("ytdl-core");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");

// Download MP3 from YouTube
async function downloadMP3(url, path = "song.mp3") {
    return new Promise((resolve, reject) => {
        try {
            const stream = ytdl(url, { filter: "audioonly" }).pipe(fs.createWriteStream(path));
            stream.on("finish", () => resolve(path));
        } catch (err) {
            reject("Error downloading MP3");
        }
    });
}

// Download MP4 from YouTube
async function downloadMP4(url, path = "video.mp4") {
    return new Promise((resolve, reject) => {
        try {
            const stream = ytdl(url).pipe(fs.createWriteStream(path));
            stream.on("finish", () => resolve(path));
        } catch (err) {
            reject("Error downloading MP4");
        }
    });
}

// Movie search (uses OMDB API)
async function searchMovie(title) {
    const apiKey = "your_omdb_api_key";
    const res = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
    if (res.data.Response === "False") return "Movie not found.";
    const m = res.data;
    return `Title: ${m.Title}
Year: ${m.Year}
Genre: ${m.Genre}
Plot: ${m.Plot}
IMDb: ${m.imdbRating}`;
}

module.exports = {
    downloadMP3,
    downloadMP4,
    searchMovie
};
