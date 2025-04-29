import fs from "graceful-fs";
import { scrapeTwitterProfile, scrapeUserTweets, scrapeTweet } from "./apis.js";

async function getTwitterProfiles(handles) {
  try {
    const twitterProfiles = await Promise.all(
      handles.map((handle) => scrapeTwitterProfile(handle))
    );
    fs.writeFileSync("test.json", JSON.stringify(twitterProfiles, null, 2));
    return twitterProfiles;
  } catch (error) {
    console.error("error at getTwitterProfiles", error.message);
    throw new Error(error.message);
  }
}

async function getTwitterUserTweets(handles) {
  try {
    const twitterUserTweets = await Promise.all(
      handles.map((handle) => scrapeUserTweets(handle))
    );
    fs.writeFileSync("test.json", JSON.stringify(twitterUserTweets, null, 2));
    return twitterUserTweets;
  } catch (error) {
    console.error("error at getTwitterUserTweets", error.message);
    throw new Error(error.message);
  }
}

async function getTwitterTweets(tweets) {
  try {
    const twitterTweets = await Promise.all(
      tweets.map((tweet) => scrapeTweet(tweet))
    );
    fs.writeFileSync("test.json", JSON.stringify(twitterTweets, null, 2));
    return twitterTweets;
  } catch (error) {
    console.error("error at getTwitterTweets", error.message);
    throw new Error(error.message);
  }
}

(async () => {
  const start = Date.now();
  const handles = ["elonmusk", "adrian_horning_"];
  const tweets = [
    "https://x.com/adrian_horning_/status/1911900126529958135",
    "https://x.com/adrian_horning_/status/1828402665845322123",
    "https://x.com/adrian_horning_/status/1828819175755903320",
  ];

  const twitterProfiles = await getTwitterProfiles(handles);
  // const twitterUserTweets = await getTwitterUserTweets(handles);
  // const twitterTweets = await getTwitterTweets(tweets);
  const end = Date.now();
  console.log(`Time taken in seconds: ${(end - start) / 1000}`);
})();
