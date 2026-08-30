"use client";

import { useEffect, useState } from "react";

interface VideoPlayerProps {
  embedUrl: string | null;
}

export function VideoPlayer({ embedUrl }: VideoPlayerProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [embedUrl]);

  const isPlaceholder =
    embedUrl?.includes("ornek-embed.com") ||
    embedUrl?.includes("ornek-api.com");

  if (!embedUrl || isPlaceholder) {
    return (
      <div className="aspect-video w-full flex flex-col items-center justify-center gap-3 bg-animen-dark rounded-lg text-animen-light/60 p-6 text-center">
        <p className="font-semibold text-white">İzleme kaynağı yapılandırılmadı</p>
        <p className="text-sm">
          Gerçek bir Türkçe kaynak eklemek için <code>.env.local</code> içindeki{" "}
          <code>ANIME_SOURCES</code> değerini güncelle. Örnek:
        </p>
        <pre className="text-left text-xs bg-black/40 rounded p-3 overflow-x-auto">
{`ANIME_SOURCES=[
  {"id":"kaynak1","name":"Kaynağım",
   "embed":"https://gercek-kaynak.com/embed/{id}"}
]`}
        </pre>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video w-full flex flex-col items-center justify-center gap-3 bg-animen-dark rounded-lg text-animen-light/60">
        <p>Oynatıcı yüklenemedi (kaynak engellemiş olabilir).</p>
        <a
          href={embedUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-animen-red rounded-md text-white text-sm font-semibold"
        >
          Yeni sekmede aç
        </a>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        onError={() => setError(true)}
        title="Anime oynatıcı"
      />
    </div>
  );
}
