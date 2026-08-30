"use client";

import Image from "next/image";
import { useState } from "react";

interface MangaReaderProps {
  pages: { index: number; url: string }[];
  title: string;
}

export function MangaReader({ pages, title }: MangaReaderProps) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  if (!pages.length) {
    return (
      <div className="py-20 text-center text-animen-light/60">
        Bu bölümün sayfaları yüklenemedi.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-center text-sm text-animen-light/60 mb-4">{title}</p>
      <div className="flex flex-col gap-2">
        {pages.map((p) => (
          <div key={p.index} className="relative bg-animen-dark min-h-[300px] flex items-center justify-center">
            {!loaded[p.index] && !failed[p.index] && (
              <div className="absolute inset-0 flex items-center justify-center text-animen-light/40 text-sm">
                Sayfa {p.index + 1} yükleniyor...
              </div>
            )}
            {failed[p.index] ? (
              <div className="py-10 text-animen-light/50 text-sm">
                Sayfa {p.index + 1} yüklenemedi.
              </div>
            ) : (
              <Image
                src={p.url}
                alt={`Sayfa ${p.index + 1}`}
                width={800}
                height={1200}
                unoptimized
                className="w-full h-auto"
                onLoad={() => setLoaded((l) => ({ ...l, [p.index]: true }))}
                onError={() => setFailed((f) => ({ ...f, [p.index]: true }))}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
