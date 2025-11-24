import { embed, runChat } from "./model";
import { COACH_PROMPT } from "./prompts/coach";
import { getRelevantContext } from "./retriever";

export async function askCoach(question, userId) {
  const embedding = await embed(question);
  if (!embedding) {
    console.error("Embedding failed for question:", question);
    return { error: "EMBED_FAIL", details: "Could not generate embedding. Check if qwen2:7b model is available." };
  }

  const context = await getRelevantContext(embedding, userId);

  const prompt = `
CONTEXT:
${context}

QUESTION:
${question}
`;

  const res = await runChat([
    { role: "system", content: COACH_PROMPT },
    { role: "user", content: prompt }
  ]);

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
