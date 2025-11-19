import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV || "null",
    keys: Object.keys(process.env).filter(k => k.includes("SUPABASE")),
    SUPABASE_URL: process.env.SUPABASE_URL || null,
    SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE_KEY || null,
    PUBLIC_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    PUBLIC_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
    cwd: process.cwd()
  });
}
