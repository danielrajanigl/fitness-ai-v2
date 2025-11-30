"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { Card } from "@repo/design-system/components/Card";
import { Button } from "@repo/design-system/components/Button";
import { Input } from "@repo/design-system/components/Input";
import { Alert } from "@repo/design-system/components/Alert";
import { tokens } from "@repo/design-system/tokens/design-tokens";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const supabase = supabaseBrowser();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
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
          <h2 className="mb-2">Create your account</h2>
          <p style={{ color: tokens.colors.textMuted }}>Start your fitness journey</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Sign up"}
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
          Already have an account?{" "}
          <Link 
            href="/login" 
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
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
