import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about PC parts." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);

    setTimeout(() => {
      setMessages((m) => [...m, { sender: "bot", text: "Processing..." }]);
    }, 400);

    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden p-4 space-y-2 bg-[#13171c] rounded-xl">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : ""}`}>
            <div
              className={`px-4 py-2 rounded-xl max-w-xs text-sm
                ${m.sender === "user" ? "bg-blue-600 text-white" : "bg-[#1d232c] text-gray-200"}
              `}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 bg-[#1a1f25] border border-gray-600 rounded-lg px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about PC parts..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
