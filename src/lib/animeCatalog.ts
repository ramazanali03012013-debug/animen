import type { AnimeDetail, Episode } from "./types";

import * as anilist from "./anilist";
import * as jikan from "./jikan";

export interface AnimeListParams {
  q?: string;
  page?: number;
  perPage?: number;
  type?: string;
  status?: string;
  sort?: string;
  genres?: string;
}

export async function getAnimeList(params: AnimeListParams = {}) {
  const r = await anilist.getAnimeList(params);
  if (r.items.length) return r;
  const order_by =
    params.sort?.replace("-desc", "").replace("-asc", "") ?? "popularity";
  const jikanSort = params.sort?.endsWith("asc") ? "asc" : "desc";
  return jikan.getAnimeList({
    q: params.q,
    page: params.page,
    limit: params.perPage,
    type: params.type,
    status: params.status,
    genres: params.genres,
    order_by,
    sort: jikanSort,
  });
}

export async function getAnime(id: string): Promise<AnimeDetail | null> {
  const r = await anilist.getAnime(id);
  if (r) return r;
  return jikan.getAnime(id);
}

export async function getAnimeEpisodes(id: string): Promise<Episode[]> {
  const r = await anilist.getAnimeEpisodes(id);
  if (r.length) return r;
  return jikan.getAnimeEpisodes(id);
}

export async function getTopAnime(limit = 14) {
  const r = await anilist.getTopAnime(limit);
  if (r.length) return r;
  return jikan.getTopAnime("bypopularity", limit);
}

export async function getSeasonalAnime(limit = 14) {
  const r = await anilist.getSeasonalAnime(limit);
  if (r.length) return r;
  return jikan.getSeasonalAnime(limit);
}
