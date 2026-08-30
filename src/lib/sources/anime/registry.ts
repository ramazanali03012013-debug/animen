import { env } from "../../env";
import type { Episode, SourceDef } from "../../types";
import { getAnimeEpisodes } from "../../jikan";

export function getAnimeSourceDefs(): SourceDef[] {
  if (env.animeSources.length) {
    return env.animeSources.map((s) => ({ id: s.id, name: s.name }));
  }
  return [];
}

export async function getAnimeEpisodesFor(animeId: string): Promise<Episode[]> {
  return getAnimeEpisodes(animeId);
}

export function getAnimeEmbed(
  sourceId: string,
  animeId: string,
  episode: Episode
): string | null {
  const src = env.animeSources.find((s) => s.id === sourceId);
  if (!src) return null;
  return src.embed
    .replace("{id}", String(episode.number))
    .replace("{anime}", String(animeId));
}
