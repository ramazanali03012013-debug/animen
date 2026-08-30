import Image from "next/image";
import Link from "next/link";

import { FavoriteButton } from "@/components/FavoriteButton";
import { MangaSourceSelect } from "@/components/MangaSourceSelect";
import { getChapters, getMangaDetail, getMangaSourceDefs } from "@/lib/sources/manga/registry";

export default async function MangaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const source = sp.source ?? "mangadex";
  const [manga, chapters, sourceDefs] = await Promise.all([
    getMangaDetail(id, source),
    getChapters(id, 1, source),
    Promise.resolve(getMangaSourceDefs()),
  ]);

  if (!manga) {
    return (
      <div className="py-24 text-center text-animen-light/60">
        Manga bulunamadı.{" "}
        <Link href="/manga" className="text-animen-red">Kataloğa dön</Link>
      </div>
    );
  }

  const first = chapters.items[0];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-44 shrink-0 rounded-lg overflow-hidden border border-animen-gray">
          <Image src={manga.image} alt={manga.title} width={176} height={264} className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-white">{manga.title}</h1>
            <MangaSourceSelect sources={sourceDefs} current={source} mangaId={id} />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {manga.genres?.map((g) => (
              <span key={g} className="px-2 py-1 text-xs rounded bg-animen-dark border border-animen-gray">{g}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-animen-light/70">
            <span>Durum: {manga.status}</span>
            <span>Yazar: {manga.author ?? "-"}</span>
            <span>Yıl: {manga.year ?? "-"}</span>
          </div>
          {manga.synopsis && (
            <p className="mt-4 text-sm text-animen-light/80 leading-relaxed max-w-3xl line-clamp-3">{manga.synopsis}</p>
          )}
          {first && (
            <Link
              href={`/manga/${id}/${first.id}`}
              className="inline-flex mt-5 px-6 py-2.5 rounded-md bg-animen-red hover:bg-animen-red-dark text-white font-semibold transition"
            >
              ▶ Okumaya Başla
            </Link>
          )}
          <div className="mt-3">
            <FavoriteButton kind="manga" refId={id} title={manga.title} image={manga.image} />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">Bölümler ({chapters.total})</h2>
        {chapters.items.length === 0 ? (
          <p className="text-animen-light/60">Türkçe bölüm bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {chapters.items.map((c) => (
              <Link
                key={c.id}
                href={`/manga/${id}/${c.id}`}
                className="px-3 py-2.5 rounded-md bg-animen-dark border border-animen-gray hover:border-animen-red text-sm transition"
              >
                <span className="text-animen-red font-bold">Bölüm {c.number}</span>
                {c.title && c.title !== `Bölüm ${c.number}` && (
                  <span className="text-animen-light/70"> — {c.title}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
