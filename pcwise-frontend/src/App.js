// App.jsx
import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import PCBuilder from "./pages/PCBuilder";
import Chatbot from "./pages/Chatbot";

export default function App() {
  const [page, setPage] = useState("products");

  // ⭐ Shared PC Builder selected parts
  const [selectedParts, setSelectedParts] = useState({
    CPU: null,
    GPU: null,
    Motherboard: null,
    RAM: null,
    Storage: null,
    PSU: null,
    Case: null,
  });

  return (
    <div className="min-h-screen bg-[#0f1216] text-gray-200 flex flex-col">
      {/* Navbar */}
      <Navbar page={page} setPage={setPage} />

      {/* Main page container */}
      <div className="flex-1 flex flex-col">
        {page === "products" && (
          <div className="flex-1 overflow-auto p-4">
            <Products
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
            />
          </div>
        )}

        {page === "pcbuilder" && (
          <div className="flex-1 overflow-auto p-4">
            <PCBuilder
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
            />
          </div>
        )}

        {page === "chatbot" && (
          <div className="flex-1 flex flex-col p-4">
            <Chatbot />
          </div>
        )}
      </div>
    </div>
  );
}
