# Animen

Anime izleme ve manga okuma platformu. **Next.js 15 + Supabase + Cloudflare Pages.**
Kırmızı/siyah Netflix tarzı arayüz, Türkçe çoklu kaynak desteği, bot koruması (Turnstile) ve rate limiting.

## Özellikler
- 🎬 Anime kataloğu & bölüm izleme (kaynak değiştirilebilir embed oynatıcı)
- 📖 Manga okuyucu (MangaDex TR entegrasyonu, tamamen Türkçe)
- 🔥 Netflix tarzı ana sayfa (popüler, sezon, öne çıkan)
- 🔍 Arama (anime + manga)
- 🛡️ Cloudflare Turnstile bot koruması + rate limiting
- 👤 Supabase Auth ile giriş/kayıt (favoriler, geçmiş, watchlist)

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldur
npm run dev
```

### Ortam değişkenleri
| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (güvenli tarafta) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret |
| `NEXT_PUBLIC_SITE_URL` | Site URL |
| `ANIME_SOURCES` | Türkçe anime embed kaynakları (JSON) |

`ANIME_SOURCES` örneği:
```json
[{"id":"kaynak1","name":"Kaynak 1","embed":"https://embed.site/v/{id}","search":"https://api.site/s/{anime}"}]
```
`{id}` bölüm numarası, `{anime}` anime ID'si ile değişilir.

## Supabase
`supabase/schema.sql` dosyasını Supabase SQL Editor'de çalıştırın.

## Cloudflare deploy (GitHub → Pages)
1. Repoyu GitHub'a pushlayın.
2. Cloudflare Pages'te "Connect to Git" ile repoyu seçin.
3. Build command: `npx @cloudflare/next-on-pages`, output: `pages_build_output_dir` (`.vercel/output/static`).
4. Ortam değişkenlerini Cloudflare Panel'den ekleyin.
5. `wrangler.toml` içindeki `RATE_LIMIT_KV` için bir KV namespace oluşturup ID'yi girin.

```bash
npm run cf:build   # lokal build testi
npx wrangler kv namespace create RATE_LIMIT_KV
```

## Güvenlik
- Turnstile: İlk ziyarette bot doğrulama (30 günlük çerez).
- Rate limit: Cloudflare KV üzerinden IP başına saatlik sınır (middleware).
- DDoS/WAF: Cloudflare edge koruması.
- Görsel proxy (`/api/img`) yalnız izin verilen hostlardan görsel çeker.

## Yol haritası
- [ ] Gerçek Türkçe anime scrape adaptörleri (kaynak bazlı)
- [ ] Favoriler/geçmiş UI sayfaları
- [ ] Mobil & PC uygulaması (ileride)
