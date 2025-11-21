import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Hardcoded 8 PC part categories
  const categories = [
    "All",
    "CPU",
    "GPU",
    "Motherboard",
    "RAM",
    "Storage",
    "PSU",
    "Case"
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, products]);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading products:", error);
      setLoading(false);
      return;
    }

    setProducts(data);
    setLoading(false);
  }

  function applyFilters() {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }

  return (
    <div className="text-gray-200 p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-[#161b22] border border-gray-600 text-gray-200 focus:outline-none"
        />

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="p-2 rounded-lg bg-[#161b22] border border-gray-600 text-gray-200 focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400">Loading products...</p>}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-gray-400">No products found.</p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="bg-[#161b22] p-3 rounded-xl shadow hover:shadow-lg hover:bg-[#1e242d] transition cursor-pointer"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-32 object-contain rounded-md mb-3 bg-gray-700 p-1"
              />
            ) : (
              <div className="w-full h-32 bg-gray-700 rounded-md mb-3 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            <p className="font-semibold text-sm">{product.name}</p>
            <p className="text-blue-400 text-sm">₱{product.price}</p>
            <p className="text-xs text-gray-400 mt-1">{product.category}</p>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b1f26] rounded-xl w-full max-w-4xl shadow-lg relative flex flex-col md:flex-row h-[80vh] md:items-stretch">

            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl z-10"
            >
              ✕
            </button>

            {/* LEFT - Image */}
            <div className="md:w-1/2 w-full h-64 md:h-full flex items-center justify-center">
              {selectedProduct.image_url ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain rounded-xl bg-gray-100"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* RIGHT - Info + Description */}
            <div className="md:w-1/2 w-full flex flex-col h-full">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{selectedProduct.category}</p>
                <p className="text-blue-400 text-lg font-semibold">₱{selectedProduct.price}</p>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#11151b] p-4 rounded-tr-xl rounded-br-xl break-words whitespace-normal text-sm text-gray-300">
                {selectedProduct.description || "No description available."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
