import {
  getCompanyAdsOnFacebookAdLibrary,
  searchFacebookAdLibraryForCompanies,
} from "./apis.js";
import fs from "graceful-fs";

(async () => {
  try {
    const companySearchResults = await searchFacebookAdLibraryForCompanies(
      //   "TikTok"
      "lululemon"
    );

    const companyId = companySearchResults?.searchResults[0]?.page_id;

    const companyAdsResults = await getCompanyAdsOnFacebookAdLibrary(companyId);

    console.log(companyAdsResults);

    fs.writeFileSync("test.json", JSON.stringify(companyAdsResults, null, 2));
  } catch (error) {
    console.error(
      "error at searchFacebookAdLibraryForCompanies",
      error.message
    );
  }
})();
