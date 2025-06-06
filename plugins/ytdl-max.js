const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "video2",
    alias: ["mp4", "song2"],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a video name!");

        await reply("🔍 Searching for video...");
        
        // Search YouTube for videos only
        const search = await yts(q);
        const videos = search.videos.filter(v => v.type === "video"); // Filter only videos, not channels
        
        if (!videos.length) return await reply("❌ No video results found!");
        
        const video = videos[0];
        const videoUrl = video.url;
        const title = video.title;

        await reply("⏳ Downloading video...");

        // Use API to get video
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success) return await reply("❌ Failed to download video!");

        await conn.sendMessage(from, {
            video: { url: data.result.download_url },
            mimetype: 'video/mp4',
            caption: `*${title}*`
        }, { quoted: mek });

        await reply(`✅ *${title}* downloaded successfully!`);

    } catch (error) {
        console.error(error);
        await reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "play2",
    alias: ["music", "song2"],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "download",
    use: ".play <query>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a song name!");

        await reply("🔍 Searching for song...");
        
        // Search YouTube for videos only
        const search = await yts(q);
        const videos = search.videos.filter(v => v.type === "video"); // Filter only videos, not channels
        
        if (!videos.length) return await reply("❌ No song results found!");
        
        const video = videos[0];
        const videoUrl = video.url;
        const title = video.title;

        await reply("⏳ Downloading audio...");

        // Use API to get audio
        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success) return await reply("❌ Failed to download audio!");

        await conn.sendMessage(from, {
            audio: { url: data.result.download_url },
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${title}.mp3`
        }, { quoted: mek });

        await reply(`✅ *${title}* downloaded successfully!`);

    } catch (error) {
        console.error(error);
        await reply(`❌ Error: ${error.message}`);
    }
});
