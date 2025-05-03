# Astro YouTube Video Loader

This package provides a YouTube video loader for the [Astro Loader API](https://docs.astro.build/en/reference/content-loader-reference/). It allows you to load and parse YouTube video data and use the data in your Astro site.

## Installation

```sh
npm install @richardnbanks/astro-loader-youtube
```

```sh
pnpm add @richardnbanks/astro-loader-youtube
```

## Usage

This package requires Astro 5 or later (You can enable experimental support for the content loader API in astro 4.10 or later).

Firstly add the content loader to your content configuration:

```typescript
// src/content.config.ts
import { defineCollection } from "astro:content";
import { youtubeLoader } from "@richardnbanks/astro-loader-youtube";

const youtube = defineCollection({
  loader: youtubeLoader({
    channelId: import.meta.env.YOUTUBE_CHANNEL_ID,
    apiKey: import.meta.env.YOUTUBE_API_KEY,
    maxResults: 1,
  }),
});

export const collections = { youtube };

```

Now just use it like any other content collection in astro:

```astro
---
import { getCollection, type CollectionEntry, render } from "astro:content";
import Layout from "../../layouts/Layout.astro";
const videos = await getCollection("youtube");
---

<Layout>
  {
    videos.map(async (video) => {
      return (
        <section>
            <a href={"https://youtube.com/watch?v=" + video.id} title={video.title}>
                <img src={video.data.thumbnails.default.url} alt={video.title} />
            </a>
        </section>
      );
    })
  }
</Layout>
```

## Options

The `youtubeLoader` function takes an options object with the following properties:

* channelId: The id of the channel you want to query videos from.
* apiKey: API Key for the [YouTube Data API](https://developers.google.com/youtube/v3/docs).
* maxResults (optional): The total number of videos you would like to fetch.

## Rendering videos with Astro Embed

You can use [Astro Embed](https://astro-embed.netlify.app/) to render YouTube videos for you.

```astro
---
import {getCollection} from "astro:content";
import {YouTube} from "astro-embed";

const videos = await getCollection("youtube");
---

{videos.map((video) => <YouTube id={video.id} />)}
```
