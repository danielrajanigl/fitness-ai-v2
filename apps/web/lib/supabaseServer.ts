import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const store = await cookies(); // <-- FIX: async cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async get(name: string) {
          const all = (await cookies()).getAll();
          const found = all.find(c => c.name === name);
          return found?.value ?? null;
        },
        async set(name: string, value: string, options?: any) {
          (await cookies()).set(name, value, { path: "/", ...options });
        },
        async remove(name: string, options?: any) {
          (await cookies()).set(name, "", {
            path: "/",
            maxAge: 0,
            ...options,
          });
        },
      },
    }
  );
}
