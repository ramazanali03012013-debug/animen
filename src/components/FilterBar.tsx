"use client";

import { useRouter } from "next/navigation";

interface FilterBarProps {
  kind: "anime" | "manga";
  current: Record<string, string | undefined>;
}

const TYPES = [
  { value: "", label: "Tür (hepsi)" },
  { value: "tv", label: "TV" },
  { value: "movie", label: "Film" },
  { value: "ova", label: "OVA" },
  { value: "ona", label: "ONA" },
  { value: "special", label: "Özel" },
];

const STATUSES = [
  { value: "", label: "Durum (hepsi)" },
  { value: "airing", label: "Yayında" },
  { value: "complete", label: "Tamamlandı" },
  { value: "upcoming", label: "Yakında" },
];

const ORDERS = [
  { value: "popularity", label: "Popülerlik" },
  { value: "score", label: "Puan" },
  { value: "favorites", label: "Favori" },
  { value: "aired", label: "Yayın tarihi" },
  { value: "title", label: "İsim" },
];

export function FilterBar({ kind, current }: FilterBarProps) {
  const router = useRouter();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    Object.entries(current).forEach(([k, v]) => {
      if (v && k !== key && k !== "page") params.set(k, v);
    });
    if (value) params.set(key, value);
    params.set("page", "1");
    const q = params.toString();
    router.push(`/${kind}${q ? `?${q}` : ""}`);
  }

  const selectCls =
    "bg-animen-dark border border-animen-gray rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-animen-red";

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {kind === "anime" && (
        <select className={selectCls} value={current.type ?? ""} onChange={(e) => update("type", e.target.value)}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      )}
      <select className={selectCls} value={current.status ?? ""} onChange={(e) => update("status", e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <select className={selectCls} value={current.order_by ?? "popularity"} onChange={(e) => update("order_by", e.target.value)}>
        {ORDERS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select className={selectCls} value={current.sort ?? "desc"} onChange={(e) => update("sort", e.target.value)}>
        <option value="desc">Azalan</option>
        <option value="asc">Artan</option>
      </select>
    </div>
  );
}
