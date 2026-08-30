import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  let token = "";
  try {
    const body = await req.json();
    token = body.token || "";
  } catch {
    token = "";
  }

  const setCookie = () => {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("animen_verified", "1", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
    return res;
  };

  if (!env.turnstileSecret) {
    // Geliştirme ortamında Turnstile yapılandırılmamışsa doğrudan geç.
    return setCookie();
  }

  if (!token) {
    return NextResponse.json({ ok: false, error: "Token yok" }, { status: 400 });
  }

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(env.turnstileSecret)}&response=${encodeURIComponent(token)}`,
    }
  );
  const data = await verifyRes.json();

  if (data.success) {
    return setCookie();
  }
  return NextResponse.json({ ok: false, error: "Doğrulama başarısız" }, { status: 403 });
}
