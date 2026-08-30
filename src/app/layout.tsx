import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Animen — Anime İzle ve Manga Oku",
  description:
    "Animen ile binlerce animeyi izle, mangayı oku. Kırmızı-siyah Netflix tarzı arayüz, Türkçe çoklu kaynak desteği.",
  metadataBase: new URL("https://animen.pages.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-animen-black flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
