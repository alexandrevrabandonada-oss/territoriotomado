import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieMethods = Parameters<typeof createServerClient>[2]["cookies"];
type CookiesToSet = Parameters<NonNullable<CookieMethods>["setAll"]>[0];
type CookieToSet = CookiesToSet[number];

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookiesToSet) {
        cookiesToSet.forEach((cookie: CookieToSet) => {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        });
      },
    },
  });
}