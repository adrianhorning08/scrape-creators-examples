import { scrapeRedditSearch } from "./apis.js";
import fs from "graceful-fs";

(async () => {
  const start = new Date();
  const NUM_RESULTS = 20;
  const term = "tariffs";
  const sort = "relevance"; // relevance, new, top, comment_count
  const timeframe = "all"; // all, day, week, month, year
  let after = null;
  const results = [];

  while (results.length < NUM_RESULTS) {
    const search = await scrapeRedditSearch(term, sort, timeframe, after);
    console.log(search);
    results.push(...search.posts);
    if (search?.after) {
      after = search.after;
    } else {
      break;
    }
  }

  results.forEach((result) => {
    console.log(result.title);
    console.log(result.url);
    console.log("--------------------------------");
  });

  console.log(results.length);
  fs.writeFileSync("test.json", JSON.stringify(results, null, 2));
  const end = new Date();
  console.log(`Seconds taken: ${(end - start) / 1000} seconds`);
})();
