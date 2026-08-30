import Link from "next/link";

import { MangaReader } from "@/components/MangaReader";
import { getChapters, getMangaDetail, getPages } from "@/lib/sources/manga/registry";

export default async function MangaReaderPage({
  params,
}: {
  params: Promise<{ id: string; chapter: string }>;
}) {
  const { id, chapter } = await params;
  const [manga, pages, chapters] = await Promise.all([
    getMangaDetail(id),
    getPages(chapter),
    getChapters(id, 1),
  ]);

  const idx = chapters.items.findIndex((c) => c.id === chapter);
  const prev = idx > 0 ? chapters.items[idx - 1] : null;
  const next = idx >= 0 && idx < chapters.items.length - 1 ? chapters.items[idx + 1] : null;

  return (
    <div className="py-6">
      <div className="max-w-[1400px] mx-auto px-4 mb-4 flex items-center justify-between">
        <Link href={`/manga/${id}`} className="text-sm text-animen-light/60 hover:text-animen-red">
          ← {manga?.title ?? "Manga"}
        </Link>
        <div className="flex gap-3">
          {prev ? (
            <Link href={`/manga/${id}/${prev.id}`} className="px-3 py-1.5 rounded-md border border-animen-gray hover:border-animen-red text-sm">
              ← Önceki
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm opacity-40">← Önceki</span>
          )}
          {next ? (
            <Link href={`/manga/${id}/${next.id}`} className="px-3 py-1.5 rounded-md border border-animen-gray hover:border-animen-red text-sm">
              Sonraki →
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm opacity-40">Sonraki →</span>
          )}
        </div>
      </div>
      <MangaReader pages={pages} title={`Bölüm ${chapters.items[idx]?.number ?? ""}`} />
    </div>
  );
}
