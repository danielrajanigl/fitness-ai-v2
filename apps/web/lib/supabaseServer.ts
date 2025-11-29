/**
 * @deprecated Use getServerSupabase() from @/lib/auth instead
 * This file is kept for backward compatibility but should not be used for new code.
 * 
 * SECURITY FIX: This now uses ANON_KEY instead of SERVICE_ROLE_KEY
 * Service role key should ONLY be used in server-side API routes that need to bypass RLS.
 */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies();

  // FIXED: Use ANON_KEY instead of SERVICE_ROLE_KEY
  // Service role key bypasses RLS and should only be used in specific server-side operations
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Changed from SERVICE_ROLE_KEY
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: any) {
          cookieStore.set(name, value, { path: "/", ...options });
        },
        remove(name: string, options?: any) {
          cookieStore.set(name, "", {
            path: "/",
            maxAge: 0,
            ...options,
          });
        },
      },
    }
  );
}
