import dotenv from "dotenv";
import fs from "graceful-fs";
import axios from "axios";
dotenv.config();

// Core function to fetch data from API
const getTikToksFromSong = async (clipId, cursor = 0) => {
  try {
    console.log(
      `Fetching TikToks for clipId: ${clipId} with cursor: ${cursor}`
    );

    const response = await axios.get(
      `https://api.scrapecreators.com/v1/tiktok/song/videos?clipId=${clipId}&cursor=${cursor}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPECREATORS_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("error at getTikToksFromSong", error.message);
  }
};

// Function to validate input
const validateClipId = (clipId) => {
  try {
    if (!clipId) throw new Error("ClipId is required");
    console.log(`Validating clipId: ${clipId}`);
  } catch (error) {
    console.error("Validation Error:", error.message);
    throw new Error(`Validation Error: ${error.message}`);
  }
};

// Function to handle pagination and collect all videos
const getAllTikToksForSong = async (clipId, maxPages = 5) => {
  try {
    validateClipId(clipId);
    console.log(
      `Starting to fetch TikToks for clipId: ${clipId}, max pages: ${maxPages}`
    );

    let allVideos = [];
    let currentCursor = 0;
    let pageCount = 0;
    let hasMore = true;

    while (hasMore && pageCount < maxPages) {
      const data = await getTikToksFromSong(clipId, currentCursor);

      if (!data.aweme_list || !Array.isArray(data.aweme_list)) {
        console.error("Invalid response format received:", data);
        throw new Error("Invalid response format");
      }

      // Map the videos to only include the required fields
      const trimmedVideos = data.aweme_list.map((video) => ({
        aweme_id: video.aweme_id,
        desc: video.desc,
        share_url: video.share_info.share_url,
      }));

      allVideos = [...allVideos, ...trimmedVideos];
      hasMore = data.has_more === 1;
      currentCursor = data.cursor;
      pageCount++;

      console.log(
        `Page ${pageCount}: Retrieved ${trimmedVideos.length} videos. Has more: ${hasMore}. Total videos so far: ${allVideos.length}`
      );
    }

    console.log(
      `Finished fetching. Total videos: ${allVideos.length}, Pages fetched: ${pageCount}`
    );

    return {
      success: true,
      data: {
        videos: allVideos,
        totalPages: pageCount,
        hasMorePages: hasMore,
      },
    };
  } catch (error) {
    console.error("Error fetching TikToks:", error);
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};

(async () => {
  console.log("Starting TikTok fetching process...");
  const clipId = "6806083515436779522";
  const result = await getAllTikToksForSong(clipId);
  console.log(`Writing ${result.data?.videos?.length || 0} videos to file...`);
  fs.writeFileSync(
    "trendingSongsTiktoks.json",
    JSON.stringify(result, null, 2)
  );
  console.log("Process completed. Data written to trendingSongsTiktoks.json");
})();
