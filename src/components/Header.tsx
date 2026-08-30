import Link from "next/link";

import { SearchBar } from "@/components/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-animen-black/95 backdrop-blur border-b border-animen-gray">
      <div className="max-w-[1400px] mx-auto flex items-center gap-6 px-4 h-16">
        <Link href="/" className="text-2xl font-extrabold tracking-tight logo-badge">
          Animen
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-animen-light/80">
          <Link href="/anime" className="nav-link hover:text-animen-red transition">Anime</Link>
          <Link href="/manga" className="nav-link hover:text-animen-red transition">Manga</Link>
          <Link href="/anime?sort=airing" className="nav-link hover:text-animen-red transition">Yeni Çıkanlar</Link>
          <Link href="/manga?sort=updated" className="nav-link hover:text-animen-red transition">Popüler Manga</Link>
          <Link href="/profil" className="nav-link hover:text-animen-red transition">Profil</Link>
        </nav>
        <div className="flex-1 flex justify-end">
          <SearchBar />
        </div>
        <Link
          href="/giris"
          className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-md bg-animen-red hover:bg-animen-red-dark text-white text-sm font-semibold transition"
        >
          Giriş Yap
        </Link>
      </div>
    </header>
  );
}
