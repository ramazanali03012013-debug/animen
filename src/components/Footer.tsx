import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-animen-gray bg-animen-black mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-10 text-sm text-animen-light/60">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-extrabold">
            <span className="text-animen-red">Ani</span>
            <span className="text-white">men</span>
          </span>
        </div>
        <p className="max-w-2xl leading-relaxed">
          Animen, anime ve manga tutkunları için hazırlanan ücretsiz bir katalog ve
          izleme/okuma platformudur. Tüm içerikler üçüncü parti kaynaklardan
          sağlanmaktadır.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <Link href="/anime" className="hover:text-animen-red">Anime</Link>
          <Link href="/manga" className="hover:text-animen-red">Manga</Link>
          <Link href="/giris" className="hover:text-animen-red">Giriş Yap</Link>
          <Link href="/kayit" className="hover:text-animen-red">Kayıt Ol</Link>
        </div>
        <p className="mt-8 text-xs text-animen-light/40">
          © {new Date().getFullYear()} Animen. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
