import { useState, useMemo } from "react";

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

export default function PCBuilder({ selectedParts, setSelectedParts }) {
  const [budget, setBudget] = useState("");

  const totalPrice = useMemo(() => {
    return Object.values(selectedParts).reduce(
      (sum, part) => sum + (part?.price ? Number(part.price) : 0),
      0
    );
  }, [selectedParts]);

  const buildSummary = useMemo(() => {
    let summary = "Here is my PC build:\n\n";
    for (const slot of slots) {
      summary += `${slot}: ${selectedParts[slot]?.name || "None"}\n`;
    }
    summary += `\nTotal Price: ₱${totalPrice}`;
    return summary;
  }, [selectedParts, totalPrice]);

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
                {part?.price && (
                  <p className="text-green-400 text-sm mt-1">
                    ₱{Number(part.price).toLocaleString()}
                  </p>
                )}
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

          {/* Total Price */}
          <div className="bg-[#11151b] p-4 rounded-xl border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Total Price</p>
            <p
              className={`text-2xl font-bold mt-1 ${
                budget && totalPrice > budget ? "text-red-500" : "text-green-400"
              }`}
            >
              ₱{totalPrice.toLocaleString()}
            </p>
            {budget && totalPrice > budget && (
              <p className="text-red-400 text-sm mt-1">
                Over budget by ₱{(totalPrice - budget).toLocaleString()}
              </p>
            )}
          </div>

          {/* Consult AI Card */}
          <div className="bg-blue-700 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col">
            <h2 className="font-bold text-lg mb-2 text-center">Consult AI About Build</h2>
            <p className="text-sm text-gray-200 mb-3 text-center truncate">
              Click to copy your build summary and consult AI in the Chatbot tab.
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(buildSummary);
                alert("Build summary copied! Paste into Chatbot tab.");
              }}
              className="mt-auto w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
            >
              Copy & Consult
            </button>
          </div>

          {/* Recommend Build Card */}
          <div className="bg-green-700 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col">
            <h2 className="font-bold text-lg mb-2 text-center">Recommend Build for Budget</h2>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter budget ₱"
              className="w-full p-2 rounded-lg mb-3 text-gray-200 bg-[#11151b] border border-gray-600"
            />
            <button
              onClick={() => alert(`Recommend build for budget ₱${budget || "any"}`)}
              className="mt-auto w-full px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
            >
              Recommend
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
