import { MediaCard } from "@/components/MediaCard";
import { getAnimeList } from "@/lib/jikan";
import { searchManga } from "@/lib/sources/manga/registry";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";

  if (!q) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center text-animen-light/60">
        Aramak için üstteki arama kutusunu kullan.
      </div>
    );
  }

  const [anime, manga] = await Promise.all([
    getAnimeList({ q, limit: 24 }),
    searchManga(q, 1),
  ]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">
        &quot;<span className="text-animen-red">{q}</span>&quot; için sonuçlar
      </h1>

      <h2 className="text-lg font-bold mb-3">Anime</h2>
      {anime.items.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {anime.items.map((a) => (
            <MediaCard key={a.id} title={a.title} image={a.image} href={`/anime/${a.slug}`} badge={a.type} />
          ))}
        </div>
      ) : (
        <p className="text-animen-light/60 mb-10">Anime bulunamadı.</p>
      )}

      <h2 className="text-lg font-bold mb-3">Manga</h2>
      {manga.items.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {manga.items.map((m) => (
            <MediaCard key={m.id} title={m.title} image={m.image} href={`/manga/${m.slug}`} badge={m.status} />
          ))}
        </div>
      ) : (
        <p className="text-animen-light/60">Manga bulunamadı.</p>
      )}
    </div>
  );
}
