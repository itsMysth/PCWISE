// PCBuilder.jsx (Price Removal & AI Message Update)

import { useState, useMemo } from "react";
import toast from "react-hot-toast"; // Adding toast for user feedback

const slots = [
  "CPU",
  "Motherboard",
  "GPU",
  "RAM",
  "Storage",
  "PSU",
  "Case",
  "Cooler",
];

export default function PCBuilder({ selectedParts, setSelectedParts, setPage, setInitialChatState }) {
  
  // 🗑️ PRICE REMOVAL 1: Renaming the state variable to be more appropriate, 
  // and initializing it to a fixed budget of ₱11,000 for the remainder of the build.
  // The user should know this is for the *remaining* parts.
  const [remainingBudget, setRemainingBudget] = useState("11000"); 

  // 🗑️ PRICE REMOVAL 2: Remove totalPrice calculation (no longer needed)
  // const totalPrice = useMemo(...) 

  // ✅ New, Cleaner Message for the AI
  const aiConsultationMessage = useMemo(() => {
    // 1. Identify all selected parts by name
    const selectedPartNames = Object.entries(selectedParts)
      .filter(([category, part]) => part)
      .map(([category, part]) => `${category}: ${part.name}`);

    // 2. Identify missing parts for the AI to recommend
    const missingSlots = slots.filter(slot => !selectedParts[slot]);

    // Construct the direct and clear prompt
    let message = "I am building a PC for balanced gaming/work use. ";
    
    if (selectedPartNames.length > 0) {
        message += `I have already selected these components: ${selectedPartNames.join(', ')}. `;
    } else {
        message += "I have not selected any components yet. ";
    }
    
    // Ensure the AI focuses on the remaining budget
    message += `\n\nMy remaining budget for the ${missingSlots.length > 0 ? missingSlots.join(', ') : 'entire build'} is ₱${remainingBudget || 0}. `;
    message += "\n\nCan you check compatibility, suggest the best value components to complete the build within the budget, and provide a full analysis?";
    
    return message;
  }, [selectedParts, remainingBudget]); // Depend only on parts and the budget field

  // 🌟 Cleaned-up Consultation Handler
  const handleConsult = () => {
    if (!setPage || !setInitialChatState) {
        console.error("Page navigation or chat state function not passed to PCBuilder.");
        return;
    }
    
    if (!remainingBudget || Number(remainingBudget) <= 0) {
        toast.error("Please enter a valid remaining budget (in PHP) before consulting the AI.", { position: "top-center" });
        return;
    }
    
    setInitialChatState(aiConsultationMessage);
    setPage("chatbot");
  };

  // ✅ New handler for the "Recommend Build" button (uses the same budget state)
  const handleRecommend = () => {
    if (!remainingBudget || Number(remainingBudget) <= 0) {
        toast.error("Please enter a budget (in PHP) for the AI recommendation.", { position: "top-center" });
        return;
    }
    
    const message = `Please recommend a complete PC build (CPU, Motherboard, GPU, RAM, Storage, PSU, Case, Cooler) for a balanced gaming/work use case with a total budget of ₱${remainingBudget}. Focus on the best value and compatibility.`;
    
    setInitialChatState(message);
    setPage("chatbot");
  };

  // --- JSX RENDER ---
  return (
    <div className="p-4 text-gray-200 min-h-screen bg-[#0f1216]">
      <h1 className="text-2xl font-bold mb-6">PC Builder</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Column: Slots */}
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {slots.map((slot) => {
            const part = selectedParts[slot];
            return (
              <div
                key={slot}
                className="bg-[#1a1f25] p-4 rounded-xl flex flex-col items-center text-gray-300 border border-gray-700"
              >
                <p className="text-lg font-bold">{slot}</p>
                <p className="text-sm text-blue-400 mt-1 text-center px-2">
                  {part ? part.name : "Not Selected"}
                </p>
                {/* 🗑️ PRICE REMOVAL 3: Removed price display */}
                {/* {part?.price && ( ... )} */}
                
                {part && (
                  <button
                    onClick={() =>
                      setSelectedParts((prev) => ({ ...prev, [slot]: null }))
                    }
                    className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Build Actions */}
        <div className="flex flex-col gap-4">

          {/* 🗑️ PRICE REMOVAL 4: Removed Total Price Card (no price data to track) */}
          {/* <div className="bg-[#11151b] p-4 rounded-xl border border-gray-700 text-center">... </div> */}


          {/* 🌟 New Unified Budget Input Card */}
          <div className="bg-[#11151b] p-4 rounded-xl border border-gray-700">
            <h2 className="font-bold text-lg mb-2 text-center text-gray-300">Target Budget (₱)</h2>
            <p className="text-sm text-gray-400 mb-2 text-center">
                This is the remaining budget for all unselected parts.
            </p>
            <input
              type="text"
              value={remainingBudget}
              onChange={(e) => setRemainingBudget(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter remaining budget ₱"
              className="w-full p-2 rounded-lg mb-3 text-gray-200 bg-[#1a1f25] border border-gray-600 text-center"
            />
          </div>


          {/* Consult AI Card */}
          <div className="bg-blue-700 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col">
            <h2 className="font-bold text-lg mb-2 text-center">Consult AI About Build</h2>
            <p className="text-sm text-gray-200 mb-3 text-center truncate">
              Get compatibility checks and suggestions for remaining parts.
            </p>
            <button
              onClick={handleConsult} 
              className="mt-auto w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
            >
              Consult AI
            </button>
          </div>

          {/* Recommend Build Card (using the same budget input) */}
          <div className="bg-green-700 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col">
            <h2 className="font-bold text-lg mb-2 text-center">Recommend Full Build</h2>
            <p className="text-sm text-gray-200 mb-3 text-center truncate">
                Ask the AI to design a full PC within the target budget.
            </p>
            <button
              onClick={handleRecommend}
              className="mt-auto w-full px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
            >
              Recommend
            </button>
          </div>
          
          {/* ✅ NEW FEATURE: Clear Build Button */}
          <button
              onClick={() => {
                  setSelectedParts({});
                  toast.success("Build cleared!", { position: "top-center" });
              }}
              className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-gray-200"
          >
              Clear Build
          </button>


        </div>
      </div>
    </div>
  );
}