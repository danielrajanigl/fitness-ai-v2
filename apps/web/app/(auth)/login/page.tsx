"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { Card } from "@repo/design-system/components/Card";
import { Button } from "@repo/design-system/components/Button";
import { Input } from "@repo/design-system/components/Input";
import { Alert } from "@repo/design-system/components/Alert";
import { tokens } from "@repo/design-system/tokens/design-tokens";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: tokens.colors.surfaceAlt }}
    >
      <Card className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="mb-2">Welcome back.</h2>
          <p style={{ color: tokens.colors.textMuted }}>Continue your journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p 
          className="mt-6 text-center"
          style={{ 
            fontSize: tokens.font.size.sm,
            color: tokens.colors.textMuted,
            fontFamily: tokens.font.family,
          }}
        >
          Need an account?{" "}
          <Link 
            href="/signup" 
            style={{ 
              color: tokens.colors.primary,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
