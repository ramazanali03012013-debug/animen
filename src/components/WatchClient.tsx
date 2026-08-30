"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SourceSwitcher } from "./SourceSwitcher";
import { VideoPlayer } from "./VideoPlayer";

interface WatchClientProps {
  animeId: string;
  animeTitle: string;
  episode: { id: string; number: number; title: string };
  episodes: { id: string; number: number; title: string }[];
  sources: { id: string; name: string; embed: string | null }[];
}

export function WatchClient({ animeId, animeTitle, episode, episodes, sources }: WatchClientProps) {
  const [sourceId, setSourceId] = useState(sources[0]?.id ?? "");
  const current = sources.find((s) => s.id === sourceId) ?? sources[0];
  const embed = current?.embed ?? null;

  const idx = useMemo(
    () => episodes.findIndex((e) => e.id === episode.id),
    [episodes, episode.id]
  );
  const prev = idx > 0 ? episodes[idx - 1] : null;
  const next = idx < episodes.length - 1 ? episodes[idx + 1] : null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Link href={`/anime/${animeId}`} className="text-sm text-animen-light/60 hover:text-animen-red">
          ← {animeTitle}
        </Link>
        <h1 className="text-2xl font-bold mt-2 mb-4">
          Bölüm {episode.number} — {episode.title}
        </h1>
        <VideoPlayer embedUrl={embed} />
        <div className="mt-4">
          <p className="text-sm text-animen-light/70 mb-2">Kaynak seç:</p>
          <SourceSwitcher sources={sources} value={sourceId} onChange={setSourceId} />
        </div>
        <div className="flex justify-between mt-5">
          {prev ? (
            <Link href={`/anime/${animeId}/${prev.id}`} className="px-4 py-2 rounded-md border border-animen-gray hover:border-animen-red text-sm">
              ← Önceki ({prev.number})
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/anime/${animeId}/${next.id}`} className="px-4 py-2 rounded-md border border-animen-gray hover:border-animen-red text-sm">
              Sonraki ({next.number}) →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>

      <aside className="bg-animen-dark rounded-lg p-4 h-[70vh] overflow-y-auto border border-animen-gray">
        <h3 className="font-bold mb-3 text-white">Bölüm Listesi</h3>
        <div className="flex flex-col gap-1">
          {episodes.map((e) => (
            <Link
              key={e.id}
              href={`/anime/${animeId}/${e.id}`}
              className={`px-3 py-2 rounded text-sm transition ${
                e.id === episode.id
                  ? "bg-animen-red text-white"
                  : "text-animen-light/80 hover:bg-animen-gray"
              }`}
            >
              <span className="font-bold">#{e.number}</span> {e.title}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
