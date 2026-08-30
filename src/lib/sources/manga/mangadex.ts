const BASE = "https://api.mangadex.org";

async function md<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 60 * 30 },
      headers: { "User-Agent": "Animen/1.0", Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function coverUrl(mangaId: string, fileName?: string) {
  if (!fileName) return "";
  return `https://wsrv.nl/?url=${encodeURIComponent(
    `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
  )}&output=webp`;
}

function imgProxy(url: string) {
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
}

interface MdManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    description?: Record<string, string>;
    status?: string;
    year?: number;
    tags?: { attributes: { name: Record<string, string> } }[];
  };
  relationships?: {
    type: string;
    id: string;
    attributes?: { fileName?: string; name?: string };
  }[];
}

function pickTitle(t: Record<string, string>) {
  return t.tr || t.en || Object.values(t)[0] || "Bilinmeyen";
}

export async function searchManga(query: string, page = 1, limit = 24) {
  const offset = (page - 1) * limit;
  const path =
    `/manga?title=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}` +
    `&availableTranslatedLanguage[]=tr&includes[]=cover_art&contentRating[]=safe` +
    `&contentRating[]=suggestive&order[latestUploadedChapter]=desc`;
  const data = await md<{ data: MdManga[]; total: number }>(path);
  if (!data) return { items: [], total: 0 };
  const items = data.data.map((m) => {
    const cover = m.relationships?.find((r) => r.type === "cover_art")?.attributes?.fileName;
    return {
      id: m.id,
      slug: m.id,
      title: pickTitle(m.attributes.title),
      image: coverUrl(m.id, cover),
      status: m.attributes.status,
      genres: m.attributes.tags?.slice(0, 4).map((t) => pickTitle(t.attributes.name)),
      year: m.attributes.year,
    };
  });
  return { items, total: data.total };
}

export async function getMangaDetail(id: string) {
  const data = await md<{ data: MdManga }>(
    `/manga/${id}?includes[]=cover_art&includes[]=author`
  );
  if (!data) return null;
  const m = data.data;
  const cover = m.relationships?.find((r) => r.type === "cover_art")?.attributes?.fileName;
  const author = m.relationships?.find((r) => r.type === "author")?.attributes?.name;
  return {
    id: m.id,
    slug: m.id,
    title: pickTitle(m.attributes.title),
    image: coverUrl(m.id, cover),
    status: m.attributes.status,
    synopsis: m.attributes.description?.tr || m.attributes.description?.en,
    author,
    genres: m.attributes.tags?.map((t) => pickTitle(t.attributes.name)),
    year: m.attributes.year,
  };
}

export async function getChapters(id: string, page = 1, limit = 100) {
  const offset = (page - 1) * limit;
  const path =
    `/manga/${id}/feed?translatedLanguage[]=tr&limit=${limit}&offset=${offset}` +
    `&order[chapter]=asc&contentRating[]=safe&contentRating[]=suggestive&includes[]=scanlation_group`;
  const data = await md<{ data: { id: string; attributes: { chapter: string; title?: string; publishedAt: string } }[]; total: number }>(path);
  if (!data) return { items: [], total: 0 };
  const items = data.data.map((c) => ({
    id: c.id,
    number: c.attributes.chapter,
    title: c.attributes.title || `Bölüm ${c.attributes.chapter}`,
    publishedAt: c.attributes.publishedAt,
  }));
  return { items, total: data.total };
}

export async function getPages(chapterId: string) {
  const server = await md<{
    baseUrl: string;
    chapter: { hash: string; data: string[]; dataSaver: string[] };
  }>(`/at-home/server/${chapterId}`);
  if (!server) return [];
  return server.chapter.data.map((file, index) => ({
    index,
    url: imgProxy(`${server.baseUrl}/data/${server.chapter.hash}/${file}`),
  }));
}
