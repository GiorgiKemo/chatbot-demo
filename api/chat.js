const DEFAULT_MODEL = "Qwen/Qwen2.5-7B-Instruct";

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter(
      (msg) =>
        msg &&
        typeof msg.role === "string" &&
        typeof msg.content === "string" &&
        ["system", "user", "assistant"].includes(msg.role)
    )
    .map((msg) => ({
      role: msg.role,
      content: msg.content.trim(),
    }))
    .filter((msg) => msg.content.length > 0)
    .slice(-14);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.HF_API_TOKEN;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server is missing HF_API_TOKEN environment variable." });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const model =
      typeof body.model === "string" && body.model.trim().length > 0
        ? body.model.trim()
        : DEFAULT_MODEL;
    const messages = cleanMessages(body.messages);

    if (messages.length === 0) {
      return res.status(400).json({ error: "messages array is required." });
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 280,
        temperature: 0.7,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const reason = data?.error || `${response.status} ${response.statusText}`;
      return res.status(response.status).json({ error: reason });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({ error: "Model returned an empty response." });
    }

    return res.status(200).json({ reply: reply.trim(), model });
  } catch {
    return res.status(500).json({ error: "Failed to process request." });
  }
};
