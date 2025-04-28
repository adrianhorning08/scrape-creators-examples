import { scrapeInstagramProfile } from "./apis.js";
import fs from "graceful-fs";

(async () => {
  try {
    const startTime = new Date();

    const handles = ["adrianhorning", "carsoncantcode", "itsmikepowers"];

    const profiles = await Promise.all(handles.map(scrapeInstagramProfile));
    console.log(profiles);
    fs.writeFileSync("test.json", JSON.stringify(profiles, null, 2));

    for (const profile of profiles) {
      const followerCount = new Intl.NumberFormat().format(
        profile?.data?.user.edge_followed_by.count
      );
      const followingCount = new Intl.NumberFormat().format(
        profile?.data?.user.edge_follow.count
      );
      const postsCount = new Intl.NumberFormat().format(
        profile?.data?.user.edge_owner_to_timeline_media.count
      );
      const bio = profile?.data?.user.biography;
      const website = profile?.data?.user.external_url;
      const profilePicture = profile?.data?.user.profile_pic_url;
      const username = profile?.data?.user.username;
      const fullName = profile?.data?.user.full_name;

      console.log("username", username);
      console.log("fullName", fullName);
      console.log("followerCount", followerCount);
      console.log("followingCount", followingCount);
      console.log("postsCount", postsCount);
      console.log("bio", bio);
      console.log("website", website);
      console.log("profilePicture", profilePicture);

      const posts = profile?.data?.user.edge_owner_to_timeline_media.edges?.map(
        (edge) => {
          const post = edge?.node;
          return {
            postId: post?.id,
            postUrl: `https://www.instagram.com/p/${post?.shortcode}`,
            postCaption: post?.edge_media_to_caption?.edges?.[0]?.node?.text,
            postImageUrl: post?.thumbnail_tall_src,
            postVideoUrl: post?.video_url,
            postLikesCount: post?.edge_liked_by?.count,
            views: new Intl.NumberFormat().format(post?.video_view_count),
          };
        }
      );
      console.log(posts);

      const relatedProfiles =
        profile?.data?.user.edge_related_profiles.edges?.map((edge) => {
          const profile = edge?.node;
          return {
            id: profile?.id,
            name: profile?.full_name,
            username: profile?.username,
            url: `https://www.instagram.com/${profile?.username}`,
          };
        });

      console.log("relatedProfiles", relatedProfiles);

      console.log("--------------------------------");
    }

    const endTime = new Date();
    console.log(`Time taken: ${(endTime - startTime) / 1000} seconds`);
  } catch (error) {
    console.error(error.message);
  }
})();
