import { scrapeSubredditPosts } from "./apis.js";
import fs from "graceful-fs";

(async () => {
  try {
    const start = new Date();
    const MAX_POSTS = 10;
    const allPosts = [];
    const subreddit = "askreddit";
    let after = null;
    const sort = null; // best, hot, new, top, rising
    const timeframe = null; // all, day, week, month, year *you need to sort by top to use a timeframe*

    while (allPosts.length < MAX_POSTS) {
      console.log(`Fetching posts after ${after}`);
      const response = await scrapeSubredditPosts(
        subreddit,
        sort,
        timeframe,
        after
      );

      const posts = response.children?.map((post) => ({
        title: post?.data?.title,
        permalink: `https://www.reddit.com${post?.data?.permalink}`,
        ups: post?.data?.ups,
        subreddit: post?.data?.subreddit,
        downs: post?.data?.downs,
        author: post?.data?.author,
        created_utc: post?.data?.created_utc,
        created_at: new Date(post?.data?.created_utc * 1000).toISOString(),
        num_comments: post?.data?.num_comments,
        score: post?.data?.score,
      }));
      allPosts.push(...posts);
      if (response.after) {
        after = response.after;
      } else {
        break;
      }
    }

    console.log(allPosts);
    const end = new Date();
    fs.writeFileSync("test.json", JSON.stringify(allPosts, null, 2));
    console.log(`Seconds taken: ${(end - start) / 1000} seconds`);
  } catch (error) {
    console.error("error at getSubredditPosts", error.message);
  }
})();
