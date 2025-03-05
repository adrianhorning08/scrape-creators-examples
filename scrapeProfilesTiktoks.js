import axios from "axios";
import dotenv from "dotenv";
import fs from "graceful-fs";
dotenv.config();

const API_URL = "https://api.scrapecreators.com/v3/tiktok/profile/videos";
const API_KEY = process.env.SCRAPECREATORS_API_KEY;

async function scrapeTiktoks(handle, max_cursor = null) {
  try {
    let url = `${API_URL}?handle=${handle}`;

    if (max_cursor) {
      url += `&max_cursor=${max_cursor}`;
    }

    const response = await axios.get(url, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error scraping tiktoks:", error.message);
  }
}

function formatTiktok(tiktok) {
  return {
    aweme_id: tiktok.aweme_id,
    desc: tiktok.desc,
    url: tiktok.share_url?.split("?")[0],
    likes: tiktok.statistics.digg_count,
    comments: tiktok.statistics.comment_count,
    shares: tiktok.statistics.share_count,
    views: tiktok.statistics.play_count,
    create_time: tiktok.create_time,
    video: tiktok?.video?.bit_rate?.[0]?.play_addr?.url_list?.[0],
  };
}

(async () => {
  const start = Date.now();
  const handle = "khaby.lame";
  let max_cursor = null;
  let hasMore = true;
  const tiktoks = [];

  while (hasMore) {
    const data = await scrapeTiktoks(handle, max_cursor);
    if (data.aweme_list) {
      console.log(`Fetched ${data.aweme_list.length} tiktoks`);
      const formattedTiktoks = data.aweme_list.map(formatTiktok);
      console.log("formattedTiktoks.length", formattedTiktoks.length);
      tiktoks.push(...formattedTiktoks);
      console.log(`Total tiktoks fetched: ${tiktoks.length}`);
    }
    max_cursor = data.max_cursor;
    hasMore = !!max_cursor;
  }

  const end = Date.now();
  console.log(`Total time taken: ${((end - start) / 1000).toFixed(2)} seconds`);
  console.log(`Total tiktoks fetched: ${tiktoks.length}`);
  fs.writeFileSync(`${handle}_tiktoks.json`, JSON.stringify(tiktoks, null, 2));
})();
