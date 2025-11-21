export default function ProductModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1a1f25] p-6 rounded-xl w-80">
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-300 mb-2">Category: {product.category}</p>
        <p className="text-blue-400 mb-4">₱{product.price.toLocaleString()}</p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
