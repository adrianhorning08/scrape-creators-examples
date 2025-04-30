import { scrapeTruthSocialPosts } from "./apis.js";
import fs from "graceful-fs";

(async () => {
  const start = Date.now();
  const MAX_RESULTS = 100;
  const allPosts = [];
  let next_max_id = null;
  const handle = "realDonaldTrump";

  while (allPosts.length < MAX_RESULTS) {
    const postRes = await scrapeTruthSocialPosts(handle, next_max_id);
    console.log("got a page of posts");

    allPosts.push(...postRes.posts);
    next_max_id = postRes.next_max_id;
  }
  console.log(allPosts.length);
  const end = Date.now();
  console.log(`Time taken in seconds: ${(end - start) / 1000}`);
  fs.writeFileSync("test.json", JSON.stringify(allPosts, null, 2));
})();
