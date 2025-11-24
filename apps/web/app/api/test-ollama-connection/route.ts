import { NextResponse } from "next/server";
import { embed, runChat } from "@repo/ai";

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    ollamaHost: process.env.OLLAMA_HOST || 'NOT SET',
    hasZeroTrust: !!(process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET),
    tests: []
  };

  // Test 1: Direct URL test
  try {
    const testUrl = process.env.OLLAMA_HOST || 'https://llm.just-fit.org';
    const response = await fetch(`${testUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
      headers: process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET ? {
        'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID,
        'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET
      } : {}
    });
    
    const text = await response.text();
    results.tests.push({
      name: 'Direct URL Test',
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responsePreview: text.substring(0, 200)
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Direct URL Test',
      success: false,
      error: error?.message,
      errorCode: error?.code
    });
  }

  // Test 2: Embedding test (using our code)
  try {
    const embedding = await embed("test connection");
    results.tests.push({
      name: 'Embedding Test',
      success: true,
      dimension: embedding?.length || 0,
      message: 'Embedding generated successfully'
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Embedding Test',
      success: false,
      error: error?.message,
      errorStack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }

  // Test 3: Chat test (using our code)
  try {
    const chatResponse = await runChat([
      { role: 'user', content: 'Say "Hello" if you can hear me.' }
    ]);
    results.tests.push({
      name: 'Chat Test',
      success: true,
      responsePreview: chatResponse?.message?.content?.substring(0, 100) || 'No content',
      message: 'Chat response received'
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Chat Test',
      success: false,
      error: error?.message
    });
  }

  const allTestsPassed = results.tests.every((t: any) => t.success);
  
  return NextResponse.json({
    ...results,
    overall: {
      success: allTestsPassed,
      passed: results.tests.filter((t: any) => t.success).length,
      total: results.tests.length
    }
  }, { 
    status: allTestsPassed ? 200 : 500 
  });
}

