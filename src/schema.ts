import { z } from "astro/zod";

const VideoThumbnailSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const VideoSnippetSchema = z.object({
  id: z.string(),
  data: z.object({
    channelId: z.string(),
    channelTitle: z.string(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    thumbnails: z.object({
      default: VideoThumbnailSchema,
      medium: VideoThumbnailSchema,
      high: VideoThumbnailSchema,
    }),
    liveBroadcastContent: z.string(),
  }),
});

export type VideoSnippet = z.infer<typeof VideoSnippetSchema>;
