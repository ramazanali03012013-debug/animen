"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/arama?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Anime veya manga ara..."
        className="w-full rounded-md bg-animen-dark border border-animen-gray px-4 py-2 text-sm text-white placeholder:text-animen-light/40 focus:outline-none focus:border-animen-red"
      />
      <button
        type="submit"
        className="absolute right-1 top-1 bottom-1 px-3 text-animen-red text-sm font-semibold"
      >
        Ara
      </button>
    </form>
  );
}
