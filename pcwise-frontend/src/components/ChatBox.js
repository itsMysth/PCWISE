import { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://pcwise.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "test_user", message: input })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "Oops! Something went wrong.." }]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg bg-white">
      <div className="h-80 overflow-y-auto mb-4 border p-2 flex flex-col">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 p-2 rounded max-w-[80%] ${
              m.sender === "user"
                ? "bg-blue-200 self-end text-right"
                : "bg-gray-200 self-start text-left"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="my-2 p-2 rounded bg-gray-200 self-start text-left animate-pulse">
            Bot is typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 transition-colors"
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
