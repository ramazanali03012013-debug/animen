import type { MangaChapter, MangaDetail, MangaPage, MangaSummary, SourceDef } from "../../types";
import * as mangadex from "./mangadex";

export function getMangaSourceDefs(): SourceDef[] {
  return [{ id: "mangadex", name: "MangaDex (TR)" }];
}

export async function searchManga(
  query: string,
  page = 1,
  _sourceId = "mangadex"
): Promise<{ items: MangaSummary[]; total: number }> {
  return mangadex.searchManga(query, page);
}

export async function getMangaDetail(
  id: string,
  _sourceId = "mangadex"
): Promise<MangaDetail | null> {
  return mangadex.getMangaDetail(id);
}

export async function getChapters(
  id: string,
  page = 1,
  _sourceId = "mangadex"
): Promise<{ items: MangaChapter[]; total: number }> {
  return mangadex.getChapters(id, page);
}

export async function getPages(
  chapterId: string,
  _sourceId = "mangadex"
): Promise<MangaPage[]> {
  return mangadex.getPages(chapterId);
}
