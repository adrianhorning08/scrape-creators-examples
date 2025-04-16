import axios from "axios";
import fs from "graceful-fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const API_URL = "https://api.scrapecreators.com/v2/tiktok/profile/videos";
const API_KEY = process.env.SCRAPE_CREATORS_API_KEY;

const OUTPUT_DIR = "./downloads";
const MAX_VIDEOS = 100;

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Utility function to download files
const downloadFile = async (url, filename) => {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const filePath = path.join(OUTPUT_DIR, filename);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(filePath));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error.message);
  }
};

// Function to fetch videos
const fetchVideos = async (handle) => {
  let cursor = "";
  let hasMore = true;
  let videoCount = 0;

  while (hasMore && videoCount < MAX_VIDEOS) {
    try {
      const response = await axios.get(API_URL, {
        headers: { "x-api-key": API_KEY },
        params: { handle, max_cursor: cursor },
      });

      if (response.data?.aweme_list) {
        for (const video of response.data.aweme_list) {
          if (
            video.video?.download_no_watermark_addr?.url_list?.length > 0 &&
            videoCount < MAX_VIDEOS
          ) {
            const videoUrl = video.video.download_no_watermark_addr.url_list[0];
            const filename = `video_${videoCount + 1}.mp4`;
            console.log(`Downloading: ${filename}`);
            await downloadFile(videoUrl, filename);
            videoCount++;
          }
        }
      }

      // Stop if we reached the limit
      if (videoCount >= MAX_VIDEOS) {
        console.log(`Downloaded ${MAX_VIDEOS} videos. Stopping.`);
        break;
      }

      // Check for pagination
      cursor = response.data?.max_cursor || "";
      hasMore = !!cursor;
      console.log(
        `Fetched ${videoCount} videos so far. Next cursor: ${cursor}`
      );
    } catch (error) {
      console.error("Error fetching videos:", error.message);
      hasMore = false;
    }
  }
};

const HANDLE = "stoolpresidente";
fetchVideos(HANDLE).then(() => console.log("Download complete!"));
