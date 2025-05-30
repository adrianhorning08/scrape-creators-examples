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

export async function scrapeYouTubeSearch(
  query,
  sortBy,
  continuationToken = null
) {
  try {
    let url = `https://api.scrapecreators.com/v1/youtube/search?query=${query}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    if (continuationToken) {
      url += `&continuationToken=${continuationToken}`;
    }
    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeSearch", error.message);
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

export async function searchLinkedinAdLibrary({
  company,
  keyword,
  countries,
  startDate,
  endDate,
  paginationToken = null,
}) {
  try {
    let url = "https://api.scrapecreators.com/v1/linkedin/ads/search";
    const queryParams = [];

    if (company) {
      queryParams.push(`company=${encodeURIComponent(company)}`);
    }
    if (keyword) {
      queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
    }
    if (countries) {
      queryParams.push(`countries=${encodeURIComponent(countries)}`);
    }
    if (startDate) {
      queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
    }
    if (endDate) {
      queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
    }
    if (paginationToken) {
      queryParams.push(
        `paginationToken=${encodeURIComponent(paginationToken)}`
      );
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at searchLinkedinAdLibrary", error.message);
    throw new Error(error.message);
  }
}

export async function getLinkedinAdLibraryAdDetail(url) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/linkedin/ad?url=${url}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at getLinkedinAdLibraryAdDetail", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeSubredditPosts(subreddit, sort, timeframe, after) {
  try {
    let url = `https://api.scrapecreators.com/v1/reddit/subreddit?subreddit=${subreddit}`;
    if (timeframe) {
      url += `&timeframe=${timeframe}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (after) {
      url += `&after=${after}`;
    }
    console.log(url);
    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeSubredditPosts", error.message);
    console.log(error.response.data);
  }
}

export async function scrapeRedditComments(postUrl, amount = 20) {
  try {
    let url = `https://api.scrapecreators.com/v1/reddit/post/comments/simple?url=${postUrl}&amount=${amount}`;

    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeRedditComments", error.message);
    console.log(error.response.data);
  }
}

export async function scrapeRedditSearch(query, sort, timeframe, after) {
  try {
    let url = `https://api.scrapecreators.com/v1/reddit/search?query=${query}`;
    if (sort) {
      url += `&sort=${sort}`;
    }

    if (timeframe) {
      url += `&timeframe=${timeframe}`;
    }
    if (after) {
      url += `&after=${after}`;
    }

    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeRedditSearch", error.message);
    console.log(error.response.data);
    throw new Error(error.message);
  }
}

export async function scrapeInstagramProfile(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/instagram/profile?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeInstagramProfile", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeInstagramPosts(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v2/instagram/posts?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeInstagramPosts", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeTwitterProfile(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/twitter/profile?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error at scrapeTwitterProfile", error.message);
  }
}

export async function scrapeUserTweets(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/twitter/user-tweets?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeUserTweets", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeTweet(url) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/twitter/tweet?url=${url}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeTweet", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeTruthSocialPosts(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/truthsocial/user/posts?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeTruthSocialPosts", error.message);
    throw new Error(error.message);
  }
}
