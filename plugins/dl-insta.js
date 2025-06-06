const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "ig",
  alias: ["insta", "igdl", "instagram"],
  desc: "Download Instagram videos/reels",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram URL\nExample: .ig https://www.instagram.com/reel/...");
    }

    // Show processing indicator
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // API endpoint
    const apiUrl = `https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(q)}`;
    
    // Fetch data from API
    const { data } = await axios.get(apiUrl);

    // Validate response
    if (!data?.success || data?.status !== 200 || !data?.downloadUrl) {
      return reply("⚠️ Failed to fetch media. Please check the link or try again later.");
    }

    // Determine media type
    const isVideo = data.type === "mp4";
    const mediaType = isVideo ? "video" : "image";

    // Send the media
    await conn.sendMessage(
      from,
      {
        [mediaType]: { url: data.downloadUrl },
        mimetype: isVideo ? "video/mp4" : "image/jpeg",
        caption: `📥 *Instagram ${isVideo ? 'Video' : 'Image'} Downloaded*\n` +
                 `> 🛠️ *Powerd By JawadTechX ♥️*`
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Instagram Download Error:", error);
    reply(`❌ Error: ${error.message || "Failed to download media"}`);
  }
});
