import { scrapeYouTubeChannelVideos, scrapeYouTubeVideo } from "./apis.js";
import fs from "graceful-fs";

(async () => {
  const allVideoIds = [];
  let continuationToken = null;
  while (allVideoIds.length < 20) {
    // https://www.youtube.com/@allin
    // https://www.youtube.com/@BadFriends
    const videos = await scrapeYouTubeChannelVideos(
      "BadFriends",
      continuationToken
    );
    console.log(videos?.videos?.length);
    const ids = videos?.videos?.map((v) => v.id);
    allVideoIds.push(...ids);
    continuationToken = videos.continuationToken;
  }

  console.log(allVideoIds);

  const start = Date.now();
  const videosWithTranscripts = await Promise.all(
    allVideoIds.map((id) =>
      scrapeYouTubeVideo(`https://www.youtube.com/watch?v=${id}`)
    )
  );
  console.log(videosWithTranscripts);
  fs.writeFileSync("test.json", JSON.stringify(videosWithTranscripts, null, 2));
  const end = Date.now();
  console.log(`Time taken in seconds: ${(end - start) / 1000}`);
})();
