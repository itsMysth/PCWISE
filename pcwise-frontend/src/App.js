// App.jsx (FINAL FIXED VERSION – object-based chat trigger)

import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import PCBuilder from "./pages/PCBuilder";
import Chatbot from "./pages/Chatbot";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [page, setPage] = useState("products");

  // ✅ FIX: object-based initial chat trigger
  // Shape: { id: number, text: string } | null
  const [initialChatMessage, setInitialChatMessage] = useState(null);

  // Persist chat history
  const [messages, setMessages] = useState([]);

  // Selected PC parts
  const [selectedParts, setSelectedParts] = useState({
    CPU: null,
    GPU: null,
    Motherboard: null,
    RAM: null,
    Storage: null,
    PSU: null,
    Case: null,
    Cooler: null,
  });

  return (
    <div className="h-screen overflow-hidden bg-[#0f1216] text-gray-200 flex flex-col">
      <Toaster position="top-center" />
      <Navbar page={page} setPage={setPage} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {page === "products" && (
          <div className="flex-1 overflow-y-auto bg-[#0f1216]">
            <Products
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
            />
          </div>
        )}

        {page === "pcbuilder" && (
          <div className="flex-1 overflow-y-auto bg-[#0f1216]">
            <PCBuilder
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
              setPage={setPage}
              setInitialChatState={setInitialChatMessage}
            />
          </div>
        )}

        {page === "chatbot" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <Chatbot
              initialMessage={initialChatMessage}
              clearInitialMessage={() => setInitialChatMessage(null)} // ✅ FIX
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
