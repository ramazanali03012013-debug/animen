"use client";

import { useRouter } from "next/navigation";

interface MangaSourceSelectProps {
  sources: { id: string; name: string }[];
  current: string;
  mangaId: string;
}

export function MangaSourceSelect({ sources, current, mangaId }: MangaSourceSelectProps) {
  const router = useRouter();
  return (
    <select
      className="bg-animen-dark border border-animen-gray rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-animen-red"
      value={current}
      onChange={(e) => router.push(`/manga/${mangaId}?source=${e.target.value}`)}
    >
      {sources.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
