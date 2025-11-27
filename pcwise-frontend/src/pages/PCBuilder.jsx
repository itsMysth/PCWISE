import { useState, useMemo } from "react";

const slots = [
  "CPU",
  "Motherboard",
  "GPU",
  "RAM",
  "Storage",
  "PSU",
  "Case",
];

export default function PCBuilder({ selectedParts, setSelectedParts }) {
  const [budget, setBudget] = useState("");

  // ⭐ Compute total price
  const totalPrice = useMemo(() => {
    return Object.values(selectedParts).reduce((sum, part) => {
      return sum + (part?.price ? Number(part.price) : 0);
    }, 0);
  }, [selectedParts]);

  // ⭐ Build summary text
  const buildSummary = useMemo(() => {
    let summary = "Here is my PC build:\n\n";

    for (const slot of slots) {
      summary += `${slot}: ${selectedParts[slot]?.name || "None"}\n`;
    }

    summary += `\nTotal Price: ₱${totalPrice}`;
    return summary;
  }, [selectedParts, totalPrice]);

  return (
    <div className="p-4 text-gray-200">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">PC Builder</h1>

      {/* Summary Box */}
      <div className="bg-[#1a1f25] p-4 rounded-xl mb-6 border border-gray-700">
        <p className="text-xl font-semibold mb-3">Build Summary</p>

        <div className="flex flex-col md:flex-row gap-4">

          {/* Budget Input */}
          <div className="flex-1">
            <label className="text-sm text-gray-400">Your Budget (₱)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={budget}
              onChange={(e) => {
                // Remove anything that is NOT a digit
                const cleaned = e.target.value.replace(/\D/g, "");
                setBudget(cleaned);
              }}
              placeholder="Enter your max budget"
              className="no-spinner w-full mt-1 p-2 rounded-lg bg-[#11151b] border border-gray-600 text-gray-200"
            />
          </div>

          {/* Total Price */}
          <div className="flex-1">
            <p className="text-sm text-gray-400">Total Price</p>
            <p
              className={`text-2xl font-bold mt-1 ${
                budget && totalPrice > budget ? "text-red-500" : "text-green-400"
              }`}
            >
              ₱{totalPrice.toLocaleString()}
            </p>

            {/* Overbudget Notice */}
            {budget && totalPrice > budget && (
              <p className="text-red-400 text-sm">
                Over budget by ₱{(totalPrice - budget).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Consult Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(buildSummary);
            alert("Build summary copied! Paste it into the Chatbot tab.");
          }}
          className="mt-4 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          Consult AI About This Build
        </button>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const part = selectedParts[slot];

          return (
            <div
              key={slot}
              className="bg-[#1a1f25] p-4 rounded-xl flex flex-col items-center text-gray-300 border border-gray-700"
            >
              {/* Title */}
              <p className="text-lg font-bold">{slot}</p>

              {/* Part Name */}
              <p className="text-sm text-blue-400 mt-1 text-center px-2">
                {part ? part.name : "Not Selected"}
              </p>

              {/* ⭐ PRICE DISPLAY */}
              {part?.price && (
                <p className="text-green-400 text-sm mt-1">
                  ₱{Number(part.price).toLocaleString()}
                </p>
              )}

              {/* Remove Button */}
              {part && (
                <button
                  onClick={() =>
                    setSelectedParts((prev) => ({
                      ...prev,
                      [slot]: null,
                    }))
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

    </div>
  );
}
