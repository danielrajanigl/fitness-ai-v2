"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CoachTestPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function askCoach() {
    if (!q.trim()) return;
    
    setLoading(true);
    setError(null);
    setAns("");

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Request failed");
      }

      setAns(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setAns(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1>🤖 KI Coach Test</h1>
        <p style={{ color: "#666" }}>
          Test endpoint - Uses authenticated session (no hardcoded user_id)
        </p>
        <button
          onClick={() => router.push("/coach")}
          style={{ marginTop: 10, padding: "8px 16px", cursor: "pointer" }}
        >
          Go to Full Chat Interface →
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask your fitness coach a question..."
          disabled={loading}
          style={{
            width: "100%",
            height: 100,
            padding: 10,
            fontSize: 14,
            border: "1px solid #ddd",
            borderRadius: 4,
          }}
        />
        <button
          onClick={askCoach}
          disabled={loading || !q.trim()}
          style={{
            marginTop: 10,
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Frage senden"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 10,
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: 4,
            color: "#c00",
            marginBottom: 20,
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {ans && (
        <div>
          <h3>Response:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 15,
              borderRadius: 4,
              overflow: "auto",
              fontSize: 12,
              border: "1px solid #ddd",
            }}
          >
            {ans}
          </pre>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 20, color: "#666" }}>
          ⏳ Waiting for AI response...
        </div>
      )}
    </main>
  );
}
