import type { AnimeDetail, AnimeSummary, Episode } from "./types";

const URL = "https://graphql.anilist.co";

interface AlMedia {
  id: number;
  title: { romaji?: string; english?: string; native?: string; turkish?: string };
  coverImage?: { large?: string; extraLarge?: string };
  bannerImage?: string;
  episodes?: number;
  status?: string;
  averageScore?: number;
  genres?: string[];
  seasonYear?: number;
  description?: string;
  duration?: number;
  format?: string;
  source?: string;
  studios?: { nodes?: { name: string }[] };
  trailer?: { id?: string; site?: string };
  streamingEpisodes?: { title: string; url: string }[];
}

function pickTitle(t?: AlMedia["title"]) {
  if (!t) return "Bilinmeyen";
  return t.turkish || t.romaji || t.english || t.native || "Bilinmeyen";
}

function mapStatus(s?: string) {
  if (s === "RELEASING") return "Yayında";
  if (s === "FINISHED") return "Tamamlandı";
  if (s === "NOT_YET_RELEASED") return "Yakında";
  return s;
}

function gql(query: string, variables: Record<string, unknown> = {}) {
  return fetch(URL, {
    method: "POST",
    headers: { "content-type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 * 60 },
  }).then((r) => r.json());
}

export interface AnimeListParams {
  q?: string;
  page?: number;
  perPage?: number;
  type?: string;
  status?: string;
  sort?: string;
  genres?: string;
}

function sortToAl(sort?: string) {
  switch (sort) {
    case "score":
      return "SCORE_DESC";
    case "favorites":
      return "FAVOURITES_DESC";
    case "aired":
      return "START_DATE_DESC";
    case "title":
      return "TITLE_ROMAJI";
    default:
      return "POPULARITY_DESC";
  }
}

function statusToAl(status?: string) {
  if (status === "airing") return "RELEASING";
  if (status === "complete") return "FINISHED";
  if (status === "upcoming") return "NOT_YET_RELEASED";
  return undefined;
}

function typeToAl(type?: string) {
  const map: Record<string, string> = {
    tv: "TV",
    movie: "MOVIE",
    ova: "OVA",
    ona: "ONA",
    special: "SPECIAL",
  };
  return type ? map[type] : undefined;
}

const FIELDS = `
  id
  title { romaji english native }
  coverImage { large extraLarge }
  bannerImage
  episodes
  status
  averageScore
  genres
  seasonYear
  description
  duration
  format
  source
  studios { nodes { name } }
  trailer { id site }
  streamingEpisodes { title url }
`;

export async function getAnimeList(
  params: AnimeListParams = {}
): Promise<{ items: AnimeSummary[]; lastPage: number }> {
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 24;
  const vars: Record<string, unknown> = { page, perPage };
  let filter = "type: ANIME";
  if (params.q) vars.search = params.q;
  if (params.type) {
    const t = typeToAl(params.type);
    if (t) filter += `, format: ${t}`;
  }
  if (params.status) {
    const s = statusToAl(params.status);
    if (s) filter += `, status: ${s}`;
  }
  if (params.genres) vars.genres = [params.genres];
  const sort = sortToAl(params.sort);

  const varDecls: string[] = ["$page: Int", "$perPage: Int"];
  if (params.q) varDecls.push("$search: String");
  if (params.genres) varDecls.push("$genres: [String]");

  const q = `query(${varDecls.join(", ")}) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { lastPage }
      media(${filter}${params.q ? ", search: $search" : ""}${params.genres ? ", genre_in: $genres" : ""}, sort: ${sort}) {
        ${FIELDS}
      }
    }
  }`;

  try {
    const data = await gql(q, vars);
    const list: AlMedia[] = data?.data?.Page?.media ?? [];
    const lastPage = data?.data?.Page?.pageInfo?.lastPage ?? 1;
    return {
      items: list.map(mapMedia),
      lastPage,
    };
  } catch {
    return { items: [] as AnimeSummary[], lastPage: 1 };
  }
}

function mapMedia(m: AlMedia): AnimeSummary {
  const studios = m.studios?.nodes?.map((s) => s.name);
  return {
    id: m.id,
    slug: String(m.id),
    title: pickTitle(m.title),
    titleEnglish: m.title?.english,
    image: m.coverImage?.extraLarge || m.coverImage?.large || "",
    type: m.format,
    episodes: m.episodes,
    status: mapStatus(m.status),
    score: m.averageScore ? m.averageScore / 10 : undefined,
    genres: m.genres,
    year: m.seasonYear,
  };
}

export async function getAnime(id: string): Promise<AnimeDetail | null> {
  const q = `query($id: Int) { Media(id: $id, type: ANIME) { ${FIELDS} } }`;
  try {
    const data = await gql(q, { id: Number(id) });
    const m: AlMedia = data?.data?.Media;
    if (!m) return null;
    const studios = m.studios?.nodes?.map((s) => s.name);
    return {
      ...mapMedia(m),
      synopsis: m.description,
      duration: m.duration ? `${m.duration} dk` : undefined,
      rating: m.source,
      aired: m.seasonYear ? String(m.seasonYear) : undefined,
      studios,
      source: m.source,
      trailer: m.trailer?.id,
    };
  } catch {
    return null;
  }
}

export async function getAnimeEpisodes(id: string): Promise<Episode[]> {
  const q = `query($id: Int) { Media(id: $id, type: ANIME) { streamingEpisodes { title url } episodes } }`;
  try {
    const data = await gql(q, { id: Number(id) });
    const se = data?.data?.Media?.streamingEpisodes ?? [];
    if (se.length) {
      return se.map((e: { title: string; url: string }, i: number) => ({
        id: String(i + 1),
        number: i + 1,
        title: e.title || `Bölüm ${i + 1}`,
      }));
    }
    const epCount = data?.data?.Media?.episodes ?? 0;
    if (epCount) {
      return Array.from({ length: epCount }, (_, i) => ({
        id: String(i + 1),
        number: i + 1,
        title: `Bölüm ${i + 1}`,
      }));
    }
  } catch {
    return [];
  }
  return [];
}

export async function getTopAnime(limit = 14): Promise<AnimeSummary[]> {
  const { items } = await getAnimeList({ perPage: limit, sort: "popularity" });
  return items;
}

export async function getSeasonalAnime(limit = 14): Promise<AnimeSummary[]> {
  const q = `query($perPage: Int) {
    Page(perPage: $perPage) {
      media(season: ${currentSeason()}, seasonYear: ${new Date().getFullYear()}, type: ANIME, sort: POPULARITY_DESC) {
        ${FIELDS}
      }
    }
  }`;
  try {
    const data = await gql(q, { perPage: limit });
    return (data?.data?.Page?.media ?? []).map(mapMedia);
  } catch {
    return [];
  }
}

function currentSeason() {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "SPRING";
  if (m >= 5 && m <= 7) return "SUMMER";
  if (m >= 8 && m <= 10) return "FALL";
  return "WINTER";
}
