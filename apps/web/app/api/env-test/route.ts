import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SUPABASE_URL: process.env.SUPABASE_URL ? "OK" : "MISSING",
    SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING",
    PUBLIC_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "MISSING",
    PUBLIC_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK" : "MISSING"
  });
}
