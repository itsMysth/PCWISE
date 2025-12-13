// App.jsx (Final Clean Version)

import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import PCBuilder from "./pages/PCBuilder";
import Chatbot from "./pages/Chatbot"; 
import { Toaster } from "react-hot-toast";

export default function App() {
  const [page, setPage] = useState("products");
  
  // State for passing the initial message from PCBuilder to Chatbot
  const [initialChatMessage, setInitialChatMessage] = useState(""); 

  // State for persisting chat history
  const [messages, setMessages] = useState([]); 
  
  // State for the user's selected parts
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

      {/* Main content area below the Navbar */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {page === "products" && (
          // FIX: Removed p-4 here. Products component provides its own padding.
          <div className="flex-1 overflow-y-auto bg-[#0f1216]">
            <Products
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
            />
          </div>
        )}

        {page === "pcbuilder" && (
          // FIX: Removed p-4 here. PCBuilder component provides its own padding.
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
              clearInitialMessage={() => setInitialChatMessage("")}
              messages={messages} 
              setMessages={setMessages}
            />
          </div>
        )}
      </div>
    </div>
  );
}