import Link from "next/link";

import { FilterBar } from "@/components/FilterBar";
import { MediaCard } from "@/components/MediaCard";
import { getMangaList } from "@/lib/jikan";

export default async function MangaListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const { items, lastPage } = await getMangaList({
    q: sp.q,
    page,
    status: sp.status,
    order_by: sp.order_by ?? "popularity",
    sort: sp.sort ?? "desc",
    genres: sp.genres,
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-1">
        <span className="text-animen-red">Manga</span> Kataloğu
      </h1>
      <p className="text-animen-light/60 mb-6 text-sm">Binlerce manga arasında keşfet</p>

      <FilterBar kind="manga" current={sp} />

      {items.length === 0 ? (
        <p className="text-animen-light/60 py-20 text-center">Sonuç bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((m) => (
            <MediaCard
              key={m.id}
              title={m.title}
              image={m.image}
              href={`/manga/${m.slug}`}
              subtitle={m.title}
              badge={m.status}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-10">
        <Link
          href={`/manga?${new URLSearchParams({ ...obj(sp), page: String(Math.max(1, page - 1)) }).toString()}`}
          className={`px-4 py-2 rounded-md border border-animen-gray ${page <= 1 ? "opacity-40 pointer-events-none" : "hover:border-animen-red"}`}
        >
          Önceki
        </Link>
        <span className="text-sm text-animen-light/70">Sayfa {page} / {lastPage}</span>
        <Link
          href={`/manga?${new URLSearchParams({ ...obj(sp), page: String(Math.min(lastPage, page + 1)) }).toString()}`}
          className={`px-4 py-2 rounded-md border border-animen-gray ${page >= lastPage ? "opacity-40 pointer-events-none" : "hover:border-animen-red"}`}
        >
          Sonraki
        </Link>
      </div>
    </div>
  );
}

function obj(sp: Record<string, string | undefined>) {
  const o: Record<string, string> = {};
  Object.entries(sp).forEach(([k, v]) => {
    if (v) o[k] = v;
  });
  return o;
}
