import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function scrapeYouTubeChannel(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/youtube/channel?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeChannel", error.message);
  }
}

export async function scrapeYouTubeVideo(url) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/youtube/video?url=${url}&get_transcript=true`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeVideo", error.message);
  }
}

export async function scrapeYouTubeChannelVideos(
  handle,
  continuationToken = null
) {
  try {
    let url = `https://api.scrapecreators.com/v1/youtube/channel-videos?handle=${handle}`;
    if (continuationToken) {
      url += `&continuationToken=${continuationToken}`;
    }
    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeChannelVideos", error.message);
  }
}

export async function searchFacebookAdLibraryForCompanies(companyName) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/facebook/adLibrary/search/companies?query=${companyName}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "error at searchFacebookAdLibraryForCompanies",
      error.message
    );
  }
}

export async function getCompanyAdsOnFacebookAdLibrary(
  companyId,
  cursor = null
) {
  try {
    let url = `https://api.scrapecreators.com/v1/facebook/adLibrary/company/ads?pageId=${companyId}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at getCompanyAdsOnFacebookAdLibrary", error.message);
  }
}
