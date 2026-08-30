import { getAnime, getAnimeEpisodes } from "@/lib/jikan";
import { getAnimeEmbed, getAnimeSourceDefs } from "@/lib/sources/anime/registry";

import { WatchClient } from "@/components/WatchClient";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string; episode: string }>;
}) {
  const { id, episode } = await params;
  const [anime, episodes, sourceDefs] = await Promise.all([
    getAnime(id),
    getAnimeEpisodes(id),
    Promise.resolve(getAnimeSourceDefs()),
  ]);

  const ep = episodes.find((e) => e.id === episode) ?? episodes[0];

  const sources = sourceDefs.map((s) => ({
    id: s.id,
    name: s.name,
    embed: ep ? getAnimeEmbed(s.id, id, ep) : null,
  }));

  if (!anime || !ep) {
    return <div className="py-24 text-center text-animen-light/60">Bölüm bulunamadı.</div>;
  }

  return (
    <WatchClient
      animeId={id}
      animeTitle={anime.title}
      episode={{ id: ep.id, number: ep.number, title: ep.title }}
      episodes={episodes.map((e) => ({ id: e.id, number: e.number, title: e.title }))}
      sources={sources}
    />
  );
}
