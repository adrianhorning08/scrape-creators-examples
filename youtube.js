import fs from "graceful-fs";
import {
  scrapeYouTubeChannelVideos,
  scrapeYouTubeSearch,
  scrapeYouTubeChannel,
} from "./apis.js";

(async () => {
  try {
    const NUM_RESULTS = 20;
    const channelHandle = "starterstory";
    let continuationToken = null;
    const sortBy = "relevance";
    const channelVideos = [];
    const searchResults = [];

    // scrape someones youtube channel
    const channelResponse = await scrapeYouTubeChannel(channelHandle);

    while (channelVideos.length < NUM_RESULTS) {
      // scrape youtube search
      const channelVideosResponse = await scrapeYouTubeChannelVideos(
        channelHandle,
        continuationToken
      );
      console.log("getting channel videos");
      channelVideos.push(...channelVideosResponse.videos);
      if (channelVideosResponse.continuationToken) {
        continuationToken = channelVideosResponse.continuationToken;
      } else {
        break;
      }
    }

    // reset continuation token for search
    continuationToken = null;

    const searchQuery = "how to make money with saas solo business";
    while (searchResults.length < NUM_RESULTS) {
      // scrape youtube search
      const searchResponse = await scrapeYouTubeSearch(
        searchQuery,
        sortBy,
        continuationToken
      );
      console.log("getting search results");
      searchResults.push(...searchResponse.videos);
      if (searchResponse.continuationToken) {
        continuationToken = searchResponse.continuationToken;
      } else {
        break;
      }
    }

    const combinedResults = [...channelVideos, ...searchResults];
    console.log("combinedResults.length", combinedResults.length);

    fs.writeFileSync("test.json", JSON.stringify(combinedResults, null, 2));
  } catch (error) {
    console.log("error at youtube", error.message);
  }
})();
