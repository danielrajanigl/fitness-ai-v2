import ollama from "ollama";

export async function runChat(messages) {
  return await ollama.chat({
    model: "mistral:latest",
    messages,
    stream: false,
    options: { temperature: 0.4 }
  });
}

export async function embed(text) {
  const res = await ollama.embeddings({
    model: "qwen2:7b",
    prompt: text
  });

  return res.embeddings?.[0];
}
