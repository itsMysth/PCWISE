import { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Reference the main messages container
  const messagesContainerRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;

  // Scroll messages container to the bottom when new messages are added
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Set scrollTop to scrollHeight to reliably scroll to the bottom of the content
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const currentMessage = userMessage; 

    setMessages((prev) => [...prev, { sender: "user", content: currentMessage }]);
    setUserMessage("");
    setLoading(true);

    try {
      if (!API_URL) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setMessages((prev) => [...prev, { sender: "ai", content: `Echo: ${currentMessage}. This is a very long message to ensure scrolling works. You should now be able to scroll up to access older messages, but the header and input remain fixed on the screen.` }]);
      } else {
        const res = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: "test-user", message: currentMessage }),
        });

        const data = await res.json();
        setMessages((prev) => [...prev, { sender: "ai", content: data.response }]);
      }
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "Error connecting to server." },
      ]);
    }

    setLoading(false);
  };

  return (
    // OUTER CONTAINER: Fills the full space, centers its content
    <div className="flex justify-center h-full w-full bg-[#0f1216]">
        
        {/* INNER CHAT WINDOW: Fixed-width, fixed-height, and handles internal Flexbox layout */}
        <div className="flex flex-col h-full w-full max-w-md rounded-xl shadow-lg">
            
            {/* Header: Fixed height */}
            <div className="flex-none h-12 flex items-center justify-center border-b border-gray-700 text-lg font-bold">
              AI Chat
            </div>

            {/* Messages Area: THE SCROLLING SECTION */}
            <div 
              ref={messagesContainerRef}
              // ⭐ CRITICAL FIX: Removed justify-end
              className="flex-1 flex flex-col p-2 gap-2 overflow-y-auto h-0"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] p-2 rounded-xl break-words text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-[#1a1f25] text-gray-200 mr-auto"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {loading && (
                <div className="max-w-[70%] p-2 rounded-xl bg-[#1a1f25] text-gray-400 mr-auto">
                  Typing...
                </div>
              )}
            </div>

            {/* Input Area: Fixed height */}
            <div className="flex-none flex gap-2 p-2 h-16 border-t border-gray-700 bg-[#11151b]">
              <textarea
                className="flex-1 p-2 rounded-xl bg-[#1a1f25] border border-gray-700 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold"
              >
                Send
              </button>
            </div>
        </div>
    </div>
  );
}