export default function Navbar({ page, setPage }) {
  const tab = (id, label) => (
    <button
      onClick={() => setPage(id)}
      className={`px-4 py-2 rounded-lg text-sm transition
        ${page === id ? "bg-[#1d232c] text-white" : "text-gray-400 hover:text-white"}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3 bg-[#11151a]">
      
      {/* Title */}
      <h1 className="text-xl font-bold tracking-wide text-white">
        PC<span className="text-blue-500">Wise</span>
      </h1>

      {/* Tabs */}
      <div className="flex items-center gap-4">
        {tab("products", "Products")}
        {tab("pcbuilder", "PC Builder")}
        {tab("chatbot", "Chatbot")}
      </div>
    </div>
  );
}
