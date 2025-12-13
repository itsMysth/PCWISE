// PCBuilder.jsx (ALLOW CONSULT WITH ₱0 IF BUILD IS COMPLETE)

import { useState, useMemo } from "react";
import toast from "react-hot-toast";

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

export default function PCBuilder({
  selectedParts,
  setSelectedParts,
  setPage,
  setInitialChatState,
}) {
  const [remainingBudget, setRemainingBudget] = useState("0");

  // ✅ Check if all slots are filled
  const isBuildComplete = useMemo(
    () => slots.every((slot) => selectedParts[slot]),
    [selectedParts]
  );

  // 🧠 AI consultation message
  const aiConsultationMessage = useMemo(() => {
    const selectedPartNames = Object.entries(selectedParts)
      .filter(([, part]) => part)
      .map(([category, part]) => `${category}: ${part.name}`);

    const missingSlots = slots.filter((slot) => !selectedParts[slot]);

    let message = "I am building a PC for balanced gaming/work use.\n\n";

    if (selectedPartNames.length > 0) {
      message += `Selected components:\n- ${selectedPartNames.join("\n- ")}\n\n`;
    }

    if (isBuildComplete) {
      message +=
        "The build is now complete.\nPlease review compatibility, balance, thermals, and overall value. ";
    } else {
      message += `Remaining parts to select: ${missingSlots.join(", ")}.\n`;
      message += `Remaining budget: ₱${remainingBudget || 0}.\n`;
      message +=
        "Please recommend the best value components to complete the build within budget.\n";
    }

    message +=
      "\nAlso suggest any improvements or optimizations if applicable.";

    return message;
  }, [selectedParts, remainingBudget, isBuildComplete]);

  // 🔹 CONSULT AI (UPDATED LOGIC)
  const handleConsult = () => {
    if (!isBuildComplete && Number(remainingBudget) <= 0) {
      toast.error(
        "Enter a budget or complete the build before consulting the AI.",
        { position: "top-center" }
      );
      return;
    }

    setInitialChatState({
      id: Date.now(),
      text: aiConsultationMessage,
    });

    setPage("chatbot");
  };

  // 🔹 RECOMMEND FULL BUILD (still requires budget)
  const handleRecommend = () => {
    if (Number(remainingBudget) <= 0) {
      toast.error("Please enter a valid budget for recommendations.", {
        position: "top-center",
      });
      return;
    }

    setInitialChatState({
      id: Date.now(),
      text: `Please recommend a complete PC build (CPU, Motherboard, GPU, RAM, Storage, PSU, Case, Cooler)
for balanced gaming/work use with a total budget of ₱${remainingBudget}.
Focus on best value and compatibility.`,
    });

    setPage("chatbot");
  };

  return (
    <div className="p-4 text-gray-200 min-h-screen bg-[#0f1216]">
      <h1 className="text-2xl font-bold mb-6">PC Builder</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: PART SLOTS */}
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {slots.map((slot) => {
            const part = selectedParts[slot];
            return (
              <div
                key={slot}
                className="bg-[#1a1f25] p-4 rounded-xl flex flex-col items-center border border-gray-700"
              >
                <p className="text-lg font-bold">{slot}</p>
                <p className="text-sm text-blue-400 mt-1 text-center">
                  {part ? part.name : "Not Selected"}
                </p>

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

        {/* RIGHT: ACTIONS */}
        <div className="flex flex-col gap-4">
          {/* Budget Input */}
          <div className="bg-[#11151b] p-4 rounded-xl border border-gray-700">
            <h2 className="font-bold text-lg text-center mb-2">
              Target Budget (₱)
            </h2>
            <p className="text-sm text-gray-400 text-center mb-2">
              Remaining budget for unselected parts
            </p>
            <input
              type="text"
              value={remainingBudget}
              onChange={(e) =>
                setRemainingBudget(e.target.value.replace(/\D/g, ""))
              }
              className="w-full p-2 rounded-lg bg-[#1a1f25] border border-gray-600 text-center"
            />
          </div>

          {/* Consult AI */}
          <div className="bg-blue-700 p-4 rounded-xl flex flex-col">
            <h2 className="font-bold text-lg text-center mb-2">
              Consult AI About Build
            </h2>
            <button
              onClick={handleConsult}
              className="mt-auto bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-semibold"
            >
              Consult AI
            </button>
          </div>

          {/* Recommend */}
          <div className="bg-green-700 p-4 rounded-xl flex flex-col">
            <h2 className="font-bold text-lg text-center mb-2">
              Recommend Full Build
            </h2>
            <button
              onClick={handleRecommend}
              className="mt-auto bg-green-600 hover:bg-green-500 py-2 rounded-lg font-semibold"
            >
              Recommend
            </button>
          </div>

          {/* Clear */}
          <button
            onClick={() => {
              setSelectedParts({});
              toast.success("Build cleared!", {
                position: "top-center",
              });
            }}
            className="bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold"
          >
            Clear Build
          </button>
        </div>
      </div>
    </div>
  );
}
