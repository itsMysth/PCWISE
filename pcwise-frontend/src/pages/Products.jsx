import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import supabase from "../supabaseClient";

export default function Products({ selectedParts, setSelectedParts }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const categories = [
    "All",
    "CPU",
    "GPU",
    "Motherboard",
    "RAM",
    "Storage",
    "PSU",
    "Case",
    "Cooler"
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  async function loadProducts() {
    setLoading(true);
    // 🗑️ PRICE REMOVAL 1: Only select necessary fields (excluding 'price')
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, image_url, description, created_at, specs")
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
    setPage(1);
  }

  function paginatedProducts() {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }

  function isCompatible(product) {
    const cat = product.category;
    const get = (part, key) => part?.specs?.[key];

    const CPU = selectedParts.CPU;
    const Motherboard = selectedParts.Motherboard;
    const RAM = selectedParts.RAM;
    const GPU = selectedParts.GPU;
    const PSU = selectedParts.PSU;
    const Case = selectedParts.Case;
    const Cooler = selectedParts.Cooler;
    const Storage = selectedParts.Storage;

    // CPU <-> Motherboard
    if (cat === "CPU" && Motherboard) {
      if (get(product, "socket") !== get(Motherboard, "socket")) return false;
    }
    if (cat === "Motherboard" && CPU) {
      if (get(product, "socket") !== get(CPU, "socket")) return false;
    }

    // RAM <-> Motherboard
    if (cat === "RAM" && Motherboard) {
      if (get(product, "ram_type") !== get(Motherboard, "ram_type")) return false;
    }
    if (cat === "Motherboard" && RAM) {
      if (get(product, "ram_type") !== get(RAM, "ram_type")) return false;
    }

    // GPU <-> PSU & Case
    // ⚠️ NOTE: Power checks based on specs.power are still here. This is good!
    if (cat === "GPU" && PSU) {
      if (get(GPU, "power") > get(PSU, "power")) return false;
    }
    if (cat === "PSU" && GPU) {
      if (get(PSU, "power") < get(GPU, "power")) return false;
    }
    if (cat === "GPU" && Case) {
      if (get(GPU, "gpu_length") > get(Case, "max_gpu_length")) return false;
    }
    if (cat === "Case" && GPU) {
      if (get(GPU, "gpu_length") > get(Case, "max_gpu_length")) return false;
    }

    // Cooler <-> CPU
    if (cat === "Cooler" && CPU) {
      if (get(product, "socket") && get(CPU, "socket")) {
        if (get(product, "socket") !== get(CPU, "socket")) return false;
      }
    }

    // Storage <-> Motherboard
    if (cat === "Storage" && Motherboard) {
      const storageType = get(product, "type"); // e.g., "SATA" or "NVMe"
      let mbSupports = get(Motherboard, "storage_type") || [];
      if (typeof mbSupports === "string") mbSupports = JSON.parse(mbSupports);
      if (!mbSupports.includes(storageType)) return false;
    }
    if (cat === "Motherboard" && Storage) {
      let mbSupports = get(product, "storage_type") || [];
      if (typeof mbSupports === "string") mbSupports = JSON.parse(mbSupports);
      const storageType = get(Storage, "type");
      if (!mbSupports.includes(storageType)) return false;
    }

    return true;
  }



  return (
    <div className="text-gray-200 p-4 bg-[#0d1117] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search + Filter UI */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-[#161b22] border border-gray-600 text-gray-200"
        />

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="p-2 rounded-lg bg-[#161b22] border border-gray-600 text-gray-200"
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
        {paginatedProducts().map(product => (
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
            {/* 🗑️ PRICE REMOVAL 2: Remove price display from grid item */}
            {/* <p className="text-blue-400 text-sm">₱{product.price}</p> */}
            <p className="text-xs text-gray-400 mt-1">{product.category}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredProducts.length > pageSize && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-30"
          >
            Previous
          </button>

          <span className="text-gray-400">
            Page {page} of {Math.ceil(filteredProducts.length / pageSize)}
          </span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(filteredProducts.length / pageSize)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b1f26] rounded-xl w-full max-w-4xl shadow-lg relative flex flex-col md:flex-row h-[80vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

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

            <div className="md:w-1/2 w-full flex flex-col h-full">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{selectedProduct.category}</p>
                {/* 🗑️ PRICE REMOVAL 3: Remove price display from modal */}
                {/* <p className="text-blue-400 text-lg font-semibold">₱{selectedProduct.price}</p> */}

                <button
                  onClick={() => {
                    const cat = selectedProduct.category;

                    if (!isCompatible(selectedProduct)) {
                      toast.error("This part is not compatible with your build", { position: "top-center" });
                      return;
                    }

                    setSelectedParts(prev => ({
                      ...prev,
                      [cat]: selectedProduct
                    }));

                    toast.success(`${cat} added to your build`, { position: "top-center" });
                    setSelectedProduct(null);
                  }}
                  className="mt-3 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Add to PC Build
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#11151b] p-4 rounded-tr-xl rounded-br-xl break-words text-sm text-gray-300">
                {selectedProduct.description || "No description available."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}