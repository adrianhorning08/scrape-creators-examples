import fs from "graceful-fs";
import {
  searchLinkedinAdLibrary,
  getLinkedinAdLibraryAdDetail,
} from "./apis.js";

(async () => {
  const MAX_RESULTS = 10;
  const allSearchResults = [];
  let paginationToken = null;
  const company = null;
  const keyword = "scraping";
  const countries = "US,ES,CA";

  while (allSearchResults.length < MAX_RESULTS) {
    const searchResult = await searchLinkedinAdLibrary({
      company,
      keyword,
      countries,
      paginationToken,
    });
    console.log(searchResult);
    allSearchResults.push(...searchResult.ads);
    if (searchResult.paginationToken) {
      paginationToken = searchResult.paginationToken;
    } else {
      break;
    }
  }

  const allAdDetails = [];

  let batch = [];
  for (let i = 0; i < allSearchResults.length; i++) {
    const ad = allSearchResults[i];
    batch.push(getLinkedinAdLibraryAdDetail(ad.url));
    if (batch.length === 50 || i === allSearchResults.length - 1) {
      const adDetails = await Promise.all(batch);
      allAdDetails.push(...adDetails);
      batch = [];
    }
  }

  console.log(allAdDetails);
  fs.writeFileSync("test.json", JSON.stringify(allAdDetails, null, 2));
})();
