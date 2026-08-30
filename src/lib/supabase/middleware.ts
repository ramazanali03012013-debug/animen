import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "../env";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          supabaseResponse.cookies.set(name, value)
        );
      },
    },
  });

  await supabase.auth.getUser();
  return supabaseResponse;
}
