import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PREFIXES = ["/verify", "/api/verify-turnstile", "/api/img", "/_next", "/favicon.ico"];

function isPublic(path: string) {
  return PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(p));
}

async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx = getRequestContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kv = (ctx.env as any)?.RATE_LIMIT_KV as
      | { get: (k: string) => Promise<string | null>; put: (k: string, v: string, o?: { expirationTtl: number }) => Promise<void> }
      | undefined;
    if (!kv) return null;
    const ip = req.headers.get("cf-connecting-ip") || "anon";
    const key = `rl:${ip}:${new Date().getUTCHours()}`;
    const count = parseInt((await kv.get(key)) || "0", 10);
    if (count > 300) {
      return new NextResponse("Çok fazla istek. Lütfen biraz sonra tekrar deneyin.", {
        status: 429,
      });
    }
    await kv.put(key, String(count + 1), { expirationTtl: 3600 });
  } catch {
    return null;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const res = await updateSession(request);

  const verified = request.cookies.get("animen_verified")?.value === "1";
  const path = request.nextUrl.pathname;

  if (!verified && !isPublic(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/verify";
    url.searchParams.set("next", path + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
