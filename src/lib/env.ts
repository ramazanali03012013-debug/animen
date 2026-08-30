export interface AnimeSourceDef {
  id: string;
  name: string;
  embed: string;
  search?: string;
}

function parseAnimeSources(raw?: string): AnimeSourceDef[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (s) => s && typeof s.id === "string" && typeof s.name === "string" && typeof s.embed === "string"
      );
    }
  } catch {
    return [];
  }
  return [];
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  animeSources: parseAnimeSources(process.env.ANIME_SOURCES),
};

export const isProd = process.env.NODE_ENV === "production";
