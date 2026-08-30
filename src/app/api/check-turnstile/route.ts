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

  if (!env.turnstileSecret) {
    return NextResponse.json({ ok: true });
  }
  if (!token) {
    return NextResponse.json({ ok: false, error: "Token yok" });
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
  return NextResponse.json({ ok: !!data.success });
}
