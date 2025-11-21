import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import PCBuilder from "./pages/PCBuilder";
import Chatbot from "./pages/Chatbot";

export default function App() {
  const [page, setPage] = useState("products");

  return (
    <div className="h-screen bg-[#0f1216] text-gray-200 flex flex-col">
      <Navbar page={page} setPage={setPage} />

      <div className="flex-1 p-4">
        {page === "products" && <Products />}
        {page === "pcbuilder" && <PCBuilder />}
        {page === "chatbot" && <Chatbot />}
      </div>
    </div>
  );
}
