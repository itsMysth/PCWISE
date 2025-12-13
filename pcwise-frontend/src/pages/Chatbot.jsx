// ChatBox.js (Final Implementation: Single-Send Fix + Markdown)

// 🌟 ADD REACT MARKDOWN IMPORTS
import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; 

// 🌟 1. UPDATE: Accept messages and setMessages as props
export default function ChatBox({ initialMessage, clearInitialMessage, messages, setMessages }) { 
  
    // 🌟 ADD REF FOR SINGLE SEND PREVENTION
    const initialMessageSent = useRef(false); 
    
    // Keep userMessage local as it clears on send
    const [userMessage, setUserMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Reference the main messages container
    const messagesContainerRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL;

    // Scroll messages container to the bottom when new messages are added
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, loading]); 

    // 🌟 2. WRAP ASYNC FUNCTION IN USECALLBACK
    const sendInitialAIMessage = useCallback(async (message) => {
        setLoading(true);
        try {
            if (!API_URL) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                setMessages(prev => [...prev, { sender: "ai", content: `AI is reviewing your PC build: ${message.substring(0, 50)}...` }]);
            } else {
                const res = await fetch(`${API_URL}/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user: "system_build_consult", message: message }), 
                });
                const data = await res.json();
                setMessages(prev => [...prev, { sender: "ai", content: data.response }]);
            }
        } catch (err) {
            console.error("Initial Chat API Error:", err);
            setMessages(prev => [...prev, { sender: "ai", content: "Error consulting AI about the build." }]);
        }
        setLoading(false);
    }, [API_URL, setMessages]); // DEPENDENCY ADDED

    
    // 🌟 3. UPDATED EFFECT WITH SINGLE-SEND LOGIC (THE DEFINITIVE FIX)
    useEffect(() => {
        // Condition: Has initialMessage, chat is empty, AND logic hasn't run yet
        if (initialMessage && messages.length === 0 && !initialMessageSent.current) {
            initialMessageSent.current = true; // Set flag
            
            const initialUserMessage = { sender: "user", content: initialMessage };
            
            // 1. Uses setMessages prop
            setMessages([initialUserMessage]);
            
            // 2. Trigger the AI response
            setTimeout(() => {
                sendInitialAIMessage(initialMessage);
            }, 10); // Slight delay for state propagation

            // 3. IMPORTANT: Clear the message from App.jsx state after using it
            clearInitialMessage(); 
        }
        
        // Reset the flag if a new initialMessage comes in when the chat is no longer empty
        if (initialMessage && messages.length > 0 && initialMessageSent.current) {
             initialMessageSent.current = false;
        }

        // Removed messages.length from dependency array to reduce unnecessary runs, 
        // relying on the manual checks inside the condition.
    }, [initialMessage, clearInitialMessage, setMessages, sendInitialAIMessage]); 


    // The original sendMessage function (for regular chat input)
    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        const currentMessage = userMessage; 

        // Uses setMessages prop
        setMessages((prev) => [...prev, { sender: "user", content: currentMessage }]);
        setUserMessage("");
        setLoading(true);

        try {
            if (!API_URL) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                // Uses setMessages prop
                setMessages((prev) => [...prev, { sender: "ai", content: `Echo: ${currentMessage}. This is a very long message to ensure scrolling works. You should now be able to scroll up to access older messages, but the header and input remain fixed on the screen.` }]);
            } else {
                const res = await fetch(`${API_URL}/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user: "test-user", message: currentMessage }),
                });

                const data = await res.json();
                // Uses setMessages prop
                setMessages((prev) => [...prev, { sender: "ai", content: data.response }]);
            }
        } catch (err) {
            console.error("Chat API Error:", err);
            // Uses setMessages prop
            setMessages((prev) => [
                ...prev,
                { sender: "ai", content: "Error connecting to server." },
            ]);
        }

        setLoading(false);
    };

    return (
        // The JSX remains largely unchanged, as `messages` is still an array that is mapped.
        <div className="flex justify-center h-full w-full bg-[#0f1216]">
            
            <div className="flex flex-col h-full w-full max-w-xl rounded-xl shadow-lg">
                
                <div className="flex-none h-12 flex items-center justify-center border-b border-gray-700 text-lg font-bold">
                    AI Chat
                </div>

                {/* Messages Area: THE SCROLLING SECTION */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 flex flex-col p-2 gap-2 overflow-y-auto h-0"
                >
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`max-w-[80%] p-2 rounded-xl break-words text-sm ${
                                msg.sender === "user"
                                    ? "bg-blue-600 text-white ml-auto"
                                    : "bg-[#1a1f25] text-gray-200 mr-auto"
                            }`}
                        >
                            {/* 🌟 CONDITIONAL MARKDOWN RENDERING */}
                            {msg.sender === "ai" ? (
                                <ReactMarkdown 
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                // User messages are rendered as simple text
                                msg.content 
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="max-w-[80%] p-2 rounded-xl bg-[#1a1f25] text-gray-400 mr-auto">
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