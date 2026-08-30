"use client";

import { useRef } from "react";

import { MediaCard } from "./MediaCard";

interface CarouselProps {
  title: string;
  items: { title: string; image: string; href: string; subtitle?: string; badge?: string }[];
}

export function Carousel({ title, items }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full bg-animen-dark border border-animen-gray text-white hover:bg-animen-red transition"
            aria-label="Geri"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full bg-animen-dark border border-animen-gray text-white hover:bg-animen-red transition"
            aria-label="İleri"
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin"
        style={{ scrollbarWidth: "thin" }}
      >
        {items.map((item, i) => (
          <div key={i} className="min-w-[150px] w-[150px] sm:min-w-[170px] sm:w-[170px]">
            <MediaCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
