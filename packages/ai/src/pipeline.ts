import ollama from "ollama";
import { embed } from "./model";
import { COACH_PROMPT } from "./prompts/coach";
import { getRelevantContext } from "./retriever";

export async function askCoach(question, userId) {
  const embedding = await embed(question);
  if (!embedding) return { error: "EMBED_FAIL" };

  const context = await getRelevantContext(embedding, userId);

  const prompt = `
CONTEXT:
${context}

QUESTION:
${question}
`;

  const res = await ollama.chat({
    model: "mistral:latest",
    stream: false,
    messages: [
      { role: "system", content: COACH_PROMPT },
      { role: "user", content: prompt }
    ],
    options: { temperature: 0.4 }
  });

  let text = res?.message?.content?.trim() || "";
  if (text.startsWith("```")) {
    text = text.replace(/```json|```/g, "").trim();
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: "INVALID_JSON", raw: text };
  }
}
