import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supa = await supabaseServer(); // <-- FIX
  return Response.json({ ok: true });
}
