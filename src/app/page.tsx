import Image from "next/image";
import Link from "next/link";

import { Carousel } from "@/components/Carousel";
import { getSeasonalAnime, getTopAnime } from "@/lib/jikan";
import { getPopularManga } from "@/lib/sources/manga/registry";

export default async function HomePage() {
  const [popular, seasonal, topManga] = await Promise.all([
    getTopAnime("bypopularity", 14),
    getSeasonalAnime(14),
    getPopularManga(1),
  ]);

  const hero = popular[0];

  const toCard = (x: { title: string; image: string; slug: string }, kind: "anime" | "manga") => ({
    title: x.title,
    image: x.image,
    href: `/${kind}/${x.slug}`,
    subtitle: x.title,
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-6">
      {hero && (
        <section className="relative rounded-xl overflow-hidden mb-8 min-h-[420px] flex items-end">
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 gradient-fade" />
          <div className="relative p-8 max-w-2xl">
            <span className="inline-block px-2 py-1 mb-3 text-xs font-bold bg-animen-red rounded">
              ÖNE ÇIKAN
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">{hero.title}</h1>
            <p className="text-animen-light/80 line-clamp-3 mb-5">{hero.titleEnglish}</p>
            <div className="flex gap-3">
              <Link
                href={`/anime/${hero.slug}`}
                className="px-6 py-2.5 rounded-md bg-animen-red hover:bg-animen-red-dark text-white font-semibold transition"
              >
                Detaylar
              </Link>
              <Link
                href={`/anime/${hero.slug}`}
                className="px-6 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur transition"
              >
                Bölümleri Gör
              </Link>
            </div>
          </div>
        </section>
      )}

      <Carousel title="Popüler Anime" items={popular.map((a) => toCard(a, "anime"))} />
      <Carousel title="Yayınlanan Sezon" items={seasonal.map((a) => toCard(a, "anime"))} />
      <Carousel title="Popüler Manga" items={topManga.map((m) => toCard(m, "manga"))} />
    </div>
  );
}
