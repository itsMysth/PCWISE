// Chatbot.jsx
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about PC parts." },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    
    // Push user's message
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Placeholder bot message
    const index = messages.length + 1;
    setMessages((prev) => [...prev, { sender: "bot", text: "Processing..." }]);
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: "test-user",
          message: userMessage,
        }),
      });


      const data = await res.json();

      // Replace temporary “Processing…” message
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index ? { sender: "bot", text: data.response } : msg
        )
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index
            ? { sender: "bot", text: "Error: backend connection failed." }
            : msg
        )
      );
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat window */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-[#13171c] rounded-xl">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === "user" ? "justify-end" : ""}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
                m.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1d232c] text-gray-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 bg-[#1a1f25] border border-gray-600 rounded-lg px-3 py-2 text-gray-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about PC parts..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading ? "bg-gray-500" : "bg-blue-600"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
