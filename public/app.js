const toggleBtn = document.getElementById("chat-toggle");
const closeBtn = document.getElementById("chat-close");
const widget = document.getElementById("chat-widget");
const messagesBox = document.getElementById("chat-messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");

const HF_MODEL = "Qwen/Qwen2.5-7B-Instruct";
const chatHistory = [
  {
    role: "system",
    content:
      "You are a concise helpful assistant. Keep answers clear and practical.",
  },
];

function renderMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function toggleWidget(open) {
  const shouldOpen = open ?? widget.classList.contains("hidden");
  widget.classList.toggle("hidden", !shouldOpen);
  if (shouldOpen) {
    input.focus();
  }
}

toggleBtn.addEventListener("click", () => toggleWidget());
closeBtn.addEventListener("click", () => toggleWidget(false));

renderMessage(
  "assistant",
  "Welcome to this demo website made by Giorgi Kemoklidze. Ask me anything."
);

async function requestHuggingFaceReply(messages) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: HF_MODEL,
      messages,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || `${response.status} ${response.statusText}`);
  }

  const reply = data?.reply;
  if (typeof reply === "string" && reply.trim()) {
    return reply.trim();
  }

  throw new Error("Model returned an empty response.");
}

async function sendMessage(message) {
  chatHistory.push({ role: "user", content: message });
  renderMessage("user", message);

  const thinkingText = "Thinking...";
  renderMessage("assistant", thinkingText);
  const thinkingBubble = messagesBox.lastElementChild;

  try {
    const reply = await requestHuggingFaceReply(chatHistory.slice(-14));
    thinkingBubble.textContent = reply;
    chatHistory.push({
      role: "assistant",
      content: reply,
    });
  } catch (error) {
    thinkingBubble.textContent =
      error instanceof Error
        ? `Error: ${error.message}`
        : "Error: Unable to get a response.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  input.value = "";
  input.focus();
  await sendMessage(value);
});
