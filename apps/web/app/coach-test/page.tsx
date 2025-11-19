"use client";
import { useState } from "react";

export default function CoachTestPage() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");

  async function askCoach() {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: q,
        user_id: "69b81e79-0be4-477b-bf77-0e0fb39a02dd"
      })
    });
    const data = await res.json();
    setAns(JSON.stringify(data, null, 2));
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>🤖 KI Coach Test</h1>
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: "100%", height: 80 }}
      />
      <button onClick={askCoach} style={{ marginTop: 10 }}>
        Frage senden
      </button>
      <pre style={{ background: "#eee", padding: 10, marginTop: 20 }}>
        {ans}
      </pre>
    </main>
  );
}
