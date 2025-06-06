const config = require('../config');
const { cmd } = require('../command');

// MP3 song download using David Cyril API
cmd({ 
    pattern: "playx", 
    alias: ["play2", "song2"], 
    react: "🎵", 
    desc: "Download YouTube song using David Cyril API", 
    category: "main", 
    use: '.playx <song name>', 
    filename: __filename 
}, async (conn, mek, m, { from, sender, reply, q }) => { 
    try {
        if (!q) return reply("Please provide a song name to search.");

        // Search using David Cyril API
        const searchUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(q)}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.status || !searchData.result) {
            return reply("No results found or API error occurred.");
        }

        const song = searchData.result;
        
        // Prepare the message
        const ytmsg = `🎵 *Music Downloader*
🎶 *Title:* ${song.title}
⏳ *Duration:* ${song.duration}
👀 *Views:* ${song.views}
📅 *Published:* ${song.published}
🔗 *Link:* ${song.video_url}
> Powered By JawadTechX ❤️`;

        // Send audio with metadata
        await conn.sendMessage(from, {
            audio: { url: song.download_url },
            mimetype: "audio/mpeg",
            fileName: `${song.title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
                    body: "Enjoy the music!",
                    mediaType: 1,
                    thumbnailUrl: song.thumbnail,
                    sourceUrl: song.video_url,
                    mediaUrl: song.video_url,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        // Send song info as caption (optional)
        await reply(ytmsg);

    } catch (error) {
        console.error(error);
        reply("An error occurred. Please try again.");
    }
});
