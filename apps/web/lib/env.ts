import { z } from "zod";

/**
 * Environment variable validation schema
 * Validates all required environment variables on import
 */
const envSchema = z.object({
  // Supabase - Public (client-side)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

  // Supabase - Server-side only
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL").optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required").optional(),

  // Ollama
  OLLAMA_HOST: z.string().url("OLLAMA_HOST must be a valid URL").optional().default("http://localhost:11434"),

  // Cloudflare Zero Trust (optional)
  CF_ACCESS_CLIENT_ID: z.string().optional(),
  CF_ACCESS_CLIENT_SECRET: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

/**
 * Validated environment variables
 * Throws error on startup if required vars are missing
 */
function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      OLLAMA_HOST: process.env.OLLAMA_HOST,
      CF_ACCESS_CLIENT_ID: process.env.CF_ACCESS_CLIENT_ID,
      CF_ACCESS_CLIENT_SECRET: process.env.CF_ACCESS_CLIENT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("\n");
      throw new Error(
        `❌ Environment variable validation failed:\n${missingVars}\n\n` +
          `Please check your .env.local file in apps/web/ directory.`
      );
    }
    throw error;
  }
}

// Validate on module load (server-side only)
let validatedEnv: z.infer<typeof envSchema> | null = null;

if (typeof window === "undefined") {
  // Server-side: validate immediately
  validatedEnv = validateEnv();
} else {
  // Client-side: validate public vars only
  const publicEnvSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  });

  try {
    publicEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  } catch (error) {
    console.error("❌ Client-side environment variables validation failed:", error);
  }
}

/**
 * Get validated environment variable
 * Use this instead of process.env directly
 */
export function getEnv(): z.infer<typeof envSchema> {
  if (validatedEnv) {
    return validatedEnv;
  }
  // Re-validate if not already validated (shouldn't happen, but safety check)
  return validateEnv();
}

/**
 * Type-safe environment variable access
 */
export const env = {
  // Public (client-safe)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

  // Server-only (will be undefined on client)
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Optional
  OLLAMA_HOST: process.env.OLLAMA_HOST || "http://localhost:11434",
  CF_ACCESS_CLIENT_ID: process.env.CF_ACCESS_CLIENT_ID,
  CF_ACCESS_CLIENT_SECRET: process.env.CF_ACCESS_CLIENT_SECRET,
  NODE_ENV: (process.env.NODE_ENV || "development") as "development" | "production" | "test",
} as const;

