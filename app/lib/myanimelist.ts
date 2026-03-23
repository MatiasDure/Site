import type { AnimeEntry } from '@/app/types';

export async function getFavoriteAnime(): Promise<AnimeEntry[]> {
  const username = process.env.MAL_USERNAME;
  if (!username) return [];

  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/favorites`,
      { next: { revalidate: 600 } }
    );

    if (!response.ok) return [];

    const data = (await response.json()) as {
      data?: {
        anime?: Array<{
          title: string;
          url: string;
          images: { jpg: { large_image_url: string } };
        }>;
      };
    };

    return (data.data?.anime ?? []).map((entry) => ({
      title: entry.title,
      url: entry.url,
      imageUrl: entry.images.jpg.large_image_url,
    }));
  } catch {
    return [];
  }
}
