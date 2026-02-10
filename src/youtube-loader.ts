import type { Loader, LoaderContext } from "astro/loaders";
import { VideoSnippetSchema } from "./schema";
import { google } from "googleapis";

export function youtubeLoader({
  channelId,
  apiKey,
  maxResults = 5,
}: {
  channelId: string;
  apiKey: string;
  maxResults?: number;
}): Loader {
  return {
    name: "youtube-loader",
    load: async (context: LoaderContext): Promise<void> => {
      const youtube = google.youtube("v3");
      const mostRecentVideoId = context.meta.get("mostRecentVideoId") || 0;
      let first;

      const params = {
        key: apiKey,
        channelId: channelId,
        order: "date",
        part: ["snippet"],
        type: ["video"],
        maxResults: maxResults,
      };

      const result = await youtube.search.list(params);

      if (result?.data?.items === undefined) {
        context.logger.error("Could not find any videos on YouTube.");
        return;
      }

      for (const video of result?.data?.items) {
        if (video?.id?.kind === "youtube#video" && video?.id?.videoId) {
          if (mostRecentVideoId && mostRecentVideoId === video.id.videoId) {
            break;
          }

          if (!first) {
            first = video.id.videoId;
          }

          try {
            const data = await context.parseData({
              id: video.id.videoId,
              data: JSON.parse(JSON.stringify(video.snippet)),
            });

            const digest = context.generateDigest(data);

            context.store.set({
              id: video.id.videoId,
              data,
              digest,
              rendered: {
                html: video.id.videoId,
              },
            });
          } catch (e) {
            console.log(e);
            context.logger.error(`Could not load video from YouTube.`);
          }
        }
      }

      if (first) {
        context.meta.set("mostRecentVideoId", first);
      }

      context.logger.info(`Fetched ${maxResults} videos from YouTube.`);
    },
    schema: VideoSnippetSchema,
  };
}
