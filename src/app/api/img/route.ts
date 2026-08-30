import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "api.jikan.moe",
  "cdn.myanimelist.net",
  "uploads.mangadex.org",
  "mangadex.org",
  "*.mangadex.org",
  "images.weserv.nl",
];

function hostAllowed(host: string): boolean {
  return ALLOWED_HOSTS.some((h) => h === host || (h.startsWith("*.") && host.endsWith(h.slice(1))));
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (parsed.protocol !== "https:" || !hostAllowed(parsed.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    headers: { "User-Agent": "Animen/1.0", Referer: "https://animen.pages.dev/" },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!upstream.ok) {
    return new NextResponse("Upstream error", { status: 502 });
  }

  const body = await upstream.arrayBuffer();
  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
