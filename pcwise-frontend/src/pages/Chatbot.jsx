// ChatBox.js (FINAL – no double send, repeat consult safe)

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function ChatBox({
  initialMessage,       // { id, text } | null
  clearInitialMessage,
  messages,
  setMessages,
}) {
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesContainerRef = useRef(null);
  const lastInitialId = useRef(null); // 🔒 CRITICAL GUARD
  const API_URL = process.env.REACT_APP_API_URL;

  // 🔽 Auto-scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading]);

  // 🔹 Send AI response for initial consult / recommend
  const sendInitialAIMessage = useCallback(
    async (messageText) => {
      if (loading) return; // 🛑 block double send
      setLoading(true);

      try {
        if (!API_URL) {
          await new Promise((r) => setTimeout(r, 1200));
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              content: `AI is reviewing your request:\n\n${messageText}`,
            },
          ]);
        } else {
          const res = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: "system_build_consult",
              message: messageText,
            }),
          });

          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            { sender: "ai", content: data.response },
          ]);
        }
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", content: "Error consulting AI." },
        ]);
      }

      setLoading(false);
    },
    [API_URL, loading, setMessages]
  );

  // ✅ INITIAL MESSAGE HANDLER (ID-BASED, BULLETPROOF)
  useEffect(() => {
    if (!initialMessage?.text) return;

    // 🛑 prevent duplicate firing
    if (lastInitialId.current === initialMessage.id) return;
    lastInitialId.current = initialMessage.id;

    setMessages((prev) => [
      ...prev,
      { sender: "user", content: initialMessage.text },
    ]);

    sendInitialAIMessage(initialMessage.text);
    clearInitialMessage();
  }, [
    initialMessage?.id,
    initialMessage?.text,
    sendInitialAIMessage,
    clearInitialMessage,
    setMessages,
  ]);

  // 🔹 Normal chat send
  const sendMessage = async () => {
    if (loading || !userMessage.trim()) return; // 🛑 block spam

    const currentMessage = userMessage;
    setUserMessage("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "user", content: currentMessage },
    ]);

    try {
      if (!API_URL) {
        await new Promise((r) => setTimeout(r, 1200));
        setMessages((prev) => [
          ...prev,
          { sender: "ai", content: "This is a sample AI response." },
        ]);
      } else {
        const res = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: "test-user",
            message: currentMessage,
          }),
        });

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { sender: "ai", content: data.response },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "Error connecting to server." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-[#0f1216]">
      <div className="flex flex-col w-full max-w-3xl h-[90vh] rounded-2xl shadow-xl bg-[#0f1216]">
        {/* HEADER */}
        <div className="flex-none h-14 flex items-center justify-center border-b border-gray-700 text-xl font-bold text-gray-200">
          AI Chat
        </div>

        {/* MESSAGES */}
        <div
          ref={messagesContainerRef}
          className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] p-4 rounded-2xl text-base leading-relaxed break-words ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-[#1a1f25] text-gray-200 mr-auto"
              }`}
            >
              {msg.sender === "ai" ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {loading && (
            <div className="max-w-[75%] p-4 rounded-2xl bg-[#1a1f25] text-gray-400 mr-auto">
              Typing...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="flex-none flex gap-3 p-4 h-24 border-t border-gray-700 bg-[#11151b]">
          <textarea
            className="flex-1 p-3 rounded-2xl bg-[#1a1f25] border border-gray-700
                       text-gray-200 resize-none focus:outline-none
                       focus:ring-2 focus:ring-blue-500 text-base leading-relaxed"
            placeholder="Type your message..."
            value={userMessage}
            rows={2}
            onChange={(e) => {
              setUserMessage(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            disabled={loading}
            onClick={sendMessage}
            className={`px-6 py-3 rounded-2xl font-semibold text-base ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
