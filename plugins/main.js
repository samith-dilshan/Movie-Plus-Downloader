/*
------------------------------------------------------------
    Movie Suport Bot
------------------------------------------------------------
    ✨ Developed by: Mr. Asitha
    ✅ Contact: +94743381623
    📅 Created: 2025-03-18
    🔗 Join WhatsApp Channel: https://whatsapp.com/channel/0029VaeyMWv3QxRu4hA6c33Z
    🚀 Program: MOVIE Suport Bot
------------------------------------------------------------
*/

const { cmd, commands } = require("../command");
const fetch = require("node-fetch");
const { fetchJson } = require("../lib/functions");
const axios = require("axios");
const cheerio = require("cheerio");

cmd(
  {
    pattern: "start",
    desc: "kok",
    category: "pp",
    use: "/start < Text >",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      if (!q) return reply("කරුණාකර search term එකක් ඇතුලත් කරන්න!");

      let data = await fetchJson(
        `http://server.moviepluslk.xyz/api.php?slug=${q}`
      );

      if (!data || !Array.isArray(data) || data.length === 0) {
        return reply("⚠️ ලබාදුන් token එක වැරදියි හෝ එය කල් ඉකුත් වී ඇත.");
      }

      let fileInfo = data[0];

      let size = parseFloat(fileInfo.file_size); // Ensure it's a number
      let downloadlink = fileInfo.google_drive_link;
      let title = fileInfo.file_name || "Unknown Movie";

      let message = `📁 *File Name* : ${title}
📈 *File Size* : ${size} GB

✅ *ඔබට අවශ්‍ය වීඩියෝ පිටපත Upload කරමින් පවතී...*`;

      let message2 = `📁 *File Name* : ${title}
📈 *File Size* : ${size} GB

❌ *සමාවෙන්න! 2GB ට වැඩි වීඩියෝව Upload කළ නොහැක.*`;

      if (size > 2) {
        await conn.sendMessage(from, { text: message2 }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return;
      }

      await conn.sendMessage(from, { text: message }, { quoted: mek });
      await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });

      let links = await convertDownloadToViewLink(downloadlink);

      if (!links) {
        return reply("⚠️ Google Drive link conversion failed.");
      }

      await conn.sendMessage(
        from,
        {
          document: { url: links },
          caption: `🎬 *${title}*\n\n> *MOVIE🇵 🇱 🇺 🇸*`,
          mimetype: "video/mp4",
          fileName: `🎬MOVIEPLUS🎬 ${title}.mp4`,
          contextInfo: {
            thumbnail: await getBuffer(
              "https://i.ibb.co/XZfWb7ST/Untitled-1.png"
            ),
          },
        },
        { quoted: mek }
      );

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
      console.log(e);
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
      reply("⚠️ වරදක් සිදුවියි!");
    }
  }
);

async function convertDownloadToViewLink(downloadLink) {
  try {
    let match = downloadLink.match(/\/d\/([^/]+)/);
    if (!match || !match[1]) return null;

    let fileId = match[1];
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  } catch (error) {
    console.error("Error converting link:", error);
    return null;
  }
}

async function getBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error("Thumbnail download failed:", error);
    return null;
  }
}

