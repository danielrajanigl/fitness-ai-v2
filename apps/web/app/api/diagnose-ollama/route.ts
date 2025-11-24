import { NextResponse } from "next/server";

export async function GET() {
  // Check all possible ways the env var might be set
  const ollamaHost = process.env.OLLAMA_HOST;
  const allEnvKeys = Object.keys(process.env).filter(k => k.includes('OLLAMA') || k.includes('HOST'));
  
  // Try to import and check the actual client
  let modelModuleInfo = null;
  try {
    // Dynamic import to see what the module sees
    const modelModule = await import("@repo/ai/src/model");
    modelModuleInfo = "Module loaded successfully";
  } catch (error: any) {
    modelModuleInfo = `Error loading module: ${error.message}`;
  }

  return NextResponse.json({
    diagnosis: "Ollama Environment Variable Check",
    ollamaHost: ollamaHost || "❌ NOT SET",
    defaultFallback: ollamaHost ? "Using set value" : "Will use http://localhost:11434",
    allOllamaRelatedEnvVars: allEnvKeys.reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {} as Record<string, string>),
    processEnvKeys: Object.keys(process.env).length,
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    modelModuleInfo,
    recommendations: [
      ollamaHost 
        ? "✅ OLLAMA_HOST is set" 
        : "❌ OLLAMA_HOST is NOT set - check .env file location",
      "For monorepo: .env should be in apps/web/ directory",
      "Or use: NEXT_PUBLIC_OLLAMA_HOST for client-side (not recommended for security)",
      "Restart dev server after changing .env"
    ]
  });
}

