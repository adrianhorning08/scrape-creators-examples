import { scrapeRedditComments } from "./apis.js";
import fs from "graceful-fs";

(async () => {
  const start = new Date();
  const amount = 100;
  const postUrl =
    "https://www.reddit.com/r/AskReddit/comments/ablzuq/people_who_havent_pooped_in_2019_yet_why_are_you";

  const comments = await scrapeRedditComments(postUrl, amount);
  console.log("comments", comments);
  console.log("comments.length", comments.length);

  fs.writeFileSync("test.json", JSON.stringify(comments, null, 2));
  const end = new Date();
  console.log(`Seconds taken: ${(end - start) / 1000} seconds`);
})();
