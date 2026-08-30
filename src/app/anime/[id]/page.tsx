import Image from "next/image";
import Link from "next/link";

import { FavoriteButton } from "@/components/FavoriteButton";
import { getAnime, getAnimeEpisodes } from "@/lib/animeCatalog";

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [anime, episodes] = await Promise.all([getAnime(id), getAnimeEpisodes(id)]);

  if (!anime) {
    return (
      <div className="py-24 text-center text-animen-light/60">
        Anime bulunamadı.{" "}
        <Link href="/anime" className="text-animen-red">Kataloğa dön</Link>
      </div>
    );
  }

  const firstEp = episodes[0];

  return (
    <div>
      <section className="relative">
        <div className="relative h-[360px]">
          <Image src={anime.image} alt={anime.title} fill sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 gradient-fade" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 -mt-40 relative">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-40 shrink-0 rounded-lg overflow-hidden border border-animen-gray">
              <Image src={anime.image} alt={anime.title} width={160} height={240} className="object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-white">{anime.title}</h1>
              {anime.titleEnglish && (
                <p className="text-animen-light/60 mt-1">{anime.titleEnglish}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {anime.genres?.map((g) => (
                  <span key={g} className="px-2 py-1 text-xs rounded bg-animen-dark border border-animen-gray">
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-animen-light/70">
                <span>Tür: {anime.type}</span>
                <span>Bölüm: {anime.episodes ?? "?"}</span>
                <span>Durum: {anime.status}</span>
                <span>Puan: {anime.score ?? "-"}</span>
                {anime.studios && <span>Stüdyo: {anime.studios.join(", ")}</span>}
              </div>
              {anime.synopsis && (
                <p className="mt-4 text-sm text-animen-light/80 leading-relaxed max-w-3xl line-clamp-3">
                  {anime.synopsis}
                </p>
              )}
              {firstEp && (
                <Link
                  href={`/anime/${id}/${firstEp.id}`}
                  className="inline-flex mt-5 px-6 py-2.5 rounded-md bg-animen-red hover:bg-animen-red-dark text-white font-semibold transition"
                >
                  ▶ İzlemeye Başla
                </Link>
              )}
              <div className="mt-3">
                <FavoriteButton kind="anime" refId={id} title={anime.title} image={anime.image} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 mt-10">
        <h2 className="text-xl font-bold mb-4">Bölümler</h2>
        {episodes.length === 0 ? (
          <p className="text-animen-light/60">Bölüm listesi alınamadı.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/anime/${id}/${ep.id}`}
                className="px-3 py-3 rounded-md bg-animen-dark border border-animen-gray hover:border-animen-red text-sm transition"
              >
                <span className="text-animen-red font-bold">#{ep.number}</span>
                <p className="line-clamp-2 text-animen-light/80 mt-1">{ep.title}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
