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
      <Navbar page={page} setPage={setPage} />

      <div className="flex-1 p-4">
        {page === "products" && (
          <Products
            selectedParts={selectedParts}
            setSelectedParts={setSelectedParts}
          />
        )}

        {page === "pcbuilder" && (
          <PCBuilder
            selectedParts={selectedParts}
            setSelectedParts={setSelectedParts}
          />
        )}

        {page === "chatbot" && <Chatbot />}
      </div>
    </div>
  );
}
