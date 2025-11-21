const slots = [
  "CPU",
  "Motherboard",
  "GPU",
  "RAM",
  "Storage",
  "PSU",
  "Case"
];

export default function PCBuilder() {
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {slots.map((slot) => (
        <div
          key={slot}
          className="bg-[#1a1f25] p-4 rounded-xl flex items-center justify-center text-gray-300 border border-gray-700"
        >
          {slot}
        </div>
      ))}
    </div>
  );
}
