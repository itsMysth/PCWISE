// App.jsx (Final Definitive Scroll-Lock Fix)
import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import PCBuilder from "./pages/PCBuilder";
import Chatbot from "./pages/Chatbot";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [page, setPage] = useState("chatbot"); // Set to chatbot for easy testing

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
    // 1. MAIN CONTAINER: 
    // - h-screen: Must use full viewport height.
    // - overflow-hidden: CRITICAL! This locks the scrollbar for the entire page.
    <div className="h-screen overflow-hidden bg-[#0f1216] text-gray-200 flex flex-col">
      
      {/* Toast Popup System */}
      <Toaster position="top-center" />

      {/* Navbar: Remains fixed at the top */}
      <Navbar page={page} setPage={setPage} />

      {/* 2. MAIN PAGE CONTENT AREA: This section takes all remaining height. */}
      {/* If any page needs to scroll (Products/PCBuilder), the scrollbar will be here. */}
      <div className="flex-1 flex flex-col overflow-y-auto"> 
        
        {/* PRODUCTS PAGE: No longer manages its own scrollbar */}
        {page === "products" && (
          // NO overflow-auto/hidden here. The parent div handles the scrolling.
          <div className="flex-1 p-4 bg-[#0f1216]"> 
            <Products
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
            />
          </div>
        )}

        {/* PC BUILDER PAGE: No longer manages its own scrollbar */}
        {page === "pcbuilder" && (
          // NO overflow-auto/hidden here. The parent div handles the scrolling.
          <div className="flex-1 p-4 bg-[#0f1216]">
            <PCBuilder
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
            />
          </div>
        )}

        {/* CHATBOT PAGE: CRITICAL ISOLATION */}
        {page === "chatbot" && (
          // CRITICAL: We need this wrapper to be completely non-scrolling. 
          // The ChatBox component itself handles the internal scrolling.
          <div className="flex-1 flex flex-col overflow-hidden"> 
            <Chatbot />
          </div>
        )}
      </div>
    </div>
  );
}