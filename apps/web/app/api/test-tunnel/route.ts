import { NextResponse } from "next/server";

export async function GET() {
  const tunnelUrl = process.env.OLLAMA_HOST || 'http://localhost:11434';
  
  try {
    // Test if the tunnel URL is accessible
    const response = await fetch(tunnelUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    const text = await response.text();
    
    return NextResponse.json({
      success: true,
      tunnelUrl,
      status: response.status,
      statusText: response.statusText,
      responsePreview: text.substring(0, 200),
      message: "Tunnel is accessible!"
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      tunnelUrl,
      error: error?.message || "Unknown error",
      errorName: error?.name,
      errorCode: error?.code,
      troubleshooting: [
        "1. Check if Cloudflare Tunnel is running: cloudflared tunnel --url http://localhost:11434",
        "2. The URL might have changed - restart the tunnel to get a new URL",
        "3. Update OLLAMA_HOST in apps/web/.env.local with the new URL",
        "4. Make sure Ollama is running on localhost:11434",
        "5. Restart your dev server after updating .env.local"
      ],
      currentEnvVar: process.env.OLLAMA_HOST || "NOT SET"
    }, { status: 500 });
  }
}

