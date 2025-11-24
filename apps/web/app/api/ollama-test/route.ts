import { NextResponse } from "next/server";
import { embed } from "@repo/ai";

export async function GET() {
  try {
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    
    // Test embedding function (which uses the configured Ollama client)
    let embeddingTest = null;
    try {
      const embedding = await embed("test connection");
      embeddingTest = {
        success: true,
        dimension: embedding?.length || 0,
        message: "Embedding generated successfully"
      };
    } catch (embedError: any) {
      embeddingTest = {
        success: false,
        error: embedError?.message,
        stack: process.env.NODE_ENV === 'development' ? embedError?.stack : undefined
      };
      throw embedError; // Re-throw to be caught by outer catch
    }
    
    return NextResponse.json({
      success: true,
      ollamaHost,
      connection: "✅ Connected successfully",
      embeddingTest,
      message: "Ollama connection successful! Ready to use."
    });
  } catch (error: any) {
    console.error("Ollama connection error:", error);
    return NextResponse.json({
      success: false,
      ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
      connection: "❌ Connection failed",
      error: error?.message || "Unknown error",
      errorStack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      errorName: error?.name,
      errorCode: error?.code,
      details: "Make sure Ollama is running and OLLAMA_HOST is set correctly. For Cloudflare Tunnel, use: OLLAMA_HOST=https://your-tunnel-url.trycloudflare.com",
      troubleshooting: [
        "❌ Cloudflare Tunnel is NOT running - Start it: cloudflared tunnel --url http://localhost:11434",
        "❌ URL has changed - Get the new URL from tunnel output",
        "Update apps/web/.env.local with the new URL",
        "Restart dev server after updating .env.local",
        "Test tunnel: curl https://your-new-url.trycloudflare.com",
        "See QUICK_START_TUNNEL.md for step-by-step instructions"
      ],
      quickFix: {
        step1: "Open new terminal and run: cloudflared tunnel --url http://localhost:11434",
        step2: "Copy the new URL from the output",
        step3: "Update apps/web/.env.local: OLLAMA_HOST=https://new-url.trycloudflare.com",
        step4: "Restart dev server: npm run dev"
      }
    }, { status: 500 });
  }
}

