import axios from "axios";
import dotenv from "dotenv";
import fs from "graceful-fs";
dotenv.config();

async function fetchSongsPage(page) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/tiktok/songs/popular?page=${page}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error at fetchSongsPage", error.message);
  }
}

async function getTrendingSongs() {
  let allSongs = [];
  let currentPage = 1;
  let hasMore = true;

  console.log("Starting to fetch trending songs...");

  try {
    while (hasMore) {
      const { pagination, sound_list } = await fetchSongsPage(currentPage);

      const trimmedSongs = sound_list.map(
        ({ clip_id, author, link, title }) => ({
          clip_id,
          author,
          link,
          title,
        })
      );

      allSongs = [...allSongs, ...trimmedSongs];
      console.log(
        `Fetched page ${currentPage}. Total songs: ${allSongs.length}`
      );

      hasMore = pagination.has_more;
      currentPage++;

      if (hasMore) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`Completed. Total songs retrieved: ${allSongs.length}`);
    return { total: allSongs.length, songs: allSongs };
  } catch (error) {
    console.error("Failed to fetch trending songs:", error.message);
    throw error;
  }
}

async function main() {
  try {
    const result = await getTrendingSongs();
    console.log(`Retrieved ${result.total} songs`);
    fs.writeFileSync("trendingSongs.json", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
