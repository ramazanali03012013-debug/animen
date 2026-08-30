"use client";

interface SourceSwitcherProps {
  sources: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
}

export function SourceSwitcher({ sources, value, onChange }: SourceSwitcherProps) {
  if (!sources.length) {
    return (
      <p className="text-xs text-animen-light/50">
        Yapılandırılmış kaynak yok. Lütfen ANIME_SOURCES ortam değişkenini ayarlayın.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition ${
            value === s.id
              ? "bg-animen-red border-animen-red text-white"
              : "bg-animen-dark border-animen-gray text-animen-light/80 hover:border-animen-red"
          }`}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
