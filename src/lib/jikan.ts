import type {
  AnimeDetail,
  AnimeSummary,
  Episode,
  MangaDetail,
  MangaSummary,
} from "./types";

const BASE = "https://api.jikan.moe/v4";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function jikan<T>(path: string, attempt = 0): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 60 * 60 },
      headers: { Accept: "application/json" },
    });
    if (res.status === 429 || res.status === 503 || res.status === 504) {
      if (attempt < 3) {
        await sleep(500 * 2 ** attempt);
        return jikan<T>(path, attempt + 1);
      }
      return null;
    }
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    if (attempt < 3) {
      await sleep(400 * 2 ** attempt);
      return jikan<T>(path, attempt + 1);
    }
    return null;
  }
}

interface JikanImage {
  large_image_url?: string;
  image_url?: string;
}

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: { jpg: JikanImage; webp?: JikanImage };
  type?: string;
  episodes?: number;
  status?: string;
  score?: number;
  genres?: { name: string }[];
  year?: number;
  synopsis?: string;
  duration?: string;
  rating?: string;
  aired?: { string?: string };
  studios?: { name: string }[];
  source?: string;
  trailer?: { youtube_id?: string };
}

function mapAnime(a: JikanAnime): AnimeSummary {
  return {
    id: a.mal_id,
    slug: String(a.mal_id),
    title: a.title,
    titleEnglish: a.title_english,
    image: a.images.webp?.large_image_url || a.images.jpg.large_image_url || a.images.jpg.image_url || "",
    type: a.type,
    episodes: a.episodes,
    status: a.status,
    score: a.score,
    genres: a.genres?.map((g) => g.name),
    year: a.year,
  };
}

function mapAnimeDetail(a: JikanAnime): AnimeDetail {
  return {
    ...mapAnime(a),
    synopsis: a.synopsis,
    duration: a.duration,
    rating: a.rating,
    aired: a.aired?.string,
    studios: a.studios?.map((s) => s.name),
    source: a.source,
    trailer: a.trailer?.youtube_id,
  };
}

interface JikanManga {
  mal_id: number;
  title: string;
  images: { jpg: JikanImage; webp?: JikanImage };
  status?: string;
  genres?: { name: string }[];
  year?: number;
  synopsis?: string;
  authors?: { name: string }[];
  demographics?: { name: string }[];
  chapters?: number;
}

function mapManga(m: JikanManga): MangaSummary {
  return {
    id: String(m.mal_id),
    slug: String(m.mal_id),
    title: m.title,
    image: m.images.webp?.large_image_url || m.images.jpg.large_image_url || m.images.jpg.image_url || "",
    status: m.status,
    genres: m.genres?.map((g) => g.name),
    year: m.year,
    chapters: m.chapters,
  };
}

function mapMangaDetail(m: JikanManga): MangaDetail {
  return {
    ...mapManga(m),
    synopsis: m.synopsis,
    author: m.authors?.[0]?.name,
    demographic: m.demographics?.[0]?.name,
  };
}

export interface AnimeListParams {
  q?: string;
  page?: number;
  type?: string;
  status?: string;
  order_by?: string;
  sort?: string;
  genres?: string;
  limit?: number;
}

export async function getAnimeList(params: AnimeListParams = {}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  sp.set("page", String(params.page ?? 1));
  sp.set("limit", String(params.limit ?? 24));
  if (params.type) sp.set("type", params.type);
  if (params.status) sp.set("status", params.status);
  if (params.order_by) sp.set("order_by", params.order_by);
  if (params.sort) sp.set("sort", params.sort);
  if (params.genres) sp.set("genres", params.genres);

  const data = await jikan<{ data: JikanAnime[]; pagination: { last_visible_page: number } }>(
    `/anime?${sp.toString()}`
  );
  if (!data) return { items: [] as AnimeSummary[], lastPage: 1 };
  return {
    items: data.data.map(mapAnime),
    lastPage: data.pagination?.last_visible_page ?? 1,
  };
}

export async function getAnime(id: string): Promise<AnimeDetail | null> {
  const data = await jikan<{ data: JikanAnime }>(`/anime/${id}`);
  if (!data) return null;
  return mapAnimeDetail(data.data);
}

export async function getAnimeEpisodes(id: string): Promise<Episode[]> {
  const data = await jikan<{ data: { mal_id: number; title: string; episode: number; filler: boolean }[] }>(
    `/anime/${id}/episodes`
  );
  if (!data) return [];
  return data.data.map((e) => ({
    id: String(e.episode),
    number: e.episode,
    title: e.title,
    filler: e.filler,
  }));
}

export async function getMangaList(params: AnimeListParams = {}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  sp.set("page", String(params.page ?? 1));
  sp.set("limit", String(params.limit ?? 24));
  if (params.status) sp.set("status", params.status);
  if (params.order_by) sp.set("order_by", params.order_by);
  if (params.sort) sp.set("sort", params.sort);
  if (params.genres) sp.set("genres", params.genres);

  const data = await jikan<{ data: JikanManga[]; pagination: { last_visible_page: number } }>(
    `/manga?${sp.toString()}`
  );
  if (!data) return { items: [] as MangaSummary[], lastPage: 1 };
  return {
    items: data.data.map(mapManga),
    lastPage: data.pagination?.last_visible_page ?? 1,
  };
}

export async function getManga(id: string): Promise<MangaDetail | null> {
  const data = await jikan<{ data: JikanManga }>(`/manga/${id}`);
  if (!data) return null;
  return mapMangaDetail(data.data);
}

export async function getTopAnime(filter: "airing" | "upcoming" | "bypopularity" = "bypopularity", limit = 12) {
  const data = await jikan<{ data: JikanAnime[] }>(`/top/anime?filter=${filter}&limit=${limit}`);
  return data?.data.map(mapAnime) ?? [];
}

export async function getSeasonalAnime(limit = 12) {
  const data = await jikan<{ data: JikanAnime[] }>(`/seasons/now?limit=${limit}`);
  return data?.data.map(mapAnime) ?? [];
}

export async function getTopManga(limit = 12) {
  const data = await jikan<{ data: JikanManga[] }>(`/top/manga?limit=${limit}`);
  return data?.data.map(mapManga) ?? [];
}

export async function getGenres(kind: "anime" | "manga") {
  const data = await jikan<{ data: { mal_id: number; name: string }[] }>(`/genres/${kind}`);
  return data?.data ?? [];
}
