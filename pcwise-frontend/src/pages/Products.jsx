import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

export default function Products({ selectedParts, setSelectedParts }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Pagination
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
    "Case"
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, products]);

  useEffect(() => {
    scrollToTop();
  }, [page]);

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
    setPage(1); // Reset to page 1 when filters change
  }

  function paginatedProducts() {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isCompatible(product, selectedParts) {
    const category = product.category;
    const specs = product.specs || {};

    const CPU = selectedParts.CPU;
    const GPU = selectedParts.GPU;
    const Motherboard = selectedParts.Motherboard;
    const RAM = selectedParts.RAM;
    const PSU = selectedParts.PSU;
    const Case = selectedParts.Case;

    const get = (part, key) => part?.specs?.[key];

    if (category === "CPU" && Motherboard) {
      if (get(product, "socket") && get(Motherboard, "socket")) {
        if (get(product, "socket") !== get(Motherboard, "socket")) {
          return false;
        }
      }
    }

    if (category === "Motherboard" && CPU) {
      if (get(product, "socket") && get(CPU, "socket")) {
        if (get(product, "socket") !== get(CPU, "socket")) {
          return false;
        }
      }
    }

    if (category === "RAM" && Motherboard) {
      if (get(product, "ram_type") && get(Motherboard, "ram_type")) {
        if (get(product, "ram_type") !== get(Motherboard, "ram_type")) {
          return false;
        }
      }
    }

    if (category === "Motherboard" && RAM) {
      if (get(product, "ram_type") && get(RAM, "ram_type")) {
        if (get(product, "ram_type") !== get(RAM, "ram_type")) {
          return false;
        }
      }
    }

    if (category === "GPU" && PSU) {
      if (get(product, "power_requirement") && get(PSU, "wattage")) {
        if (get(PSU, "wattage") < get(product, "power_requirement")) {
          return false;
        }
      }
    }

    if (category === "PSU" && GPU) {
      if (get(product, "wattage") && get(GPU, "power_requirement")) {
        if (get(product, "wattage") < get(GPU, "power_requirement")) {
          return false;
        }
      }
    }

    if (category === "GPU" && Case) {
      if (get(product, "gpu_length") && get(Case, "max_gpu_length")) {
        if (get(product, "gpu_length") > get(Case, "max_gpu_length")) {
          return false;
        }
      }
    }

    if (category === "Case" && GPU) {
      if (get(product, "max_gpu_length") && get(GPU, "gpu_length")) {
        if (get(GPU, "gpu_length") > get(product, "max_gpu_length")) {
          return false;
        }
      }
    }

    const caseFF = get(Case, "supported_form_factors")?.split(",") || [];
    const prodFF = get(product, "supported_form_factors")?.split(",") || [];

    if (category === "Motherboard" && Case) {
      if (get(product, "form_factor") && caseFF.length > 0) {
        if (!caseFF.includes(get(product, "form_factor"))) {
          return false;
        }
      }
    }

    if (category === "Case" && Motherboard) {
      if (prodFF.length > 0 && get(Motherboard, "form_factor")) {
        if (!prodFF.includes(get(Motherboard, "form_factor"))) {
          return false;
        }
      }
    }

    const casePSU = get(Case, "supported_psu_types")?.split(",") || [];
    const prodPSU = get(product, "supported_psu_types")?.split(",") || [];

    if (category === "PSU" && Case) {
      if (get(product, "psu_type") && casePSU.length > 0) {
        if (!casePSU.includes(get(product, "psu_type"))) {
          return false;
        }
      }
    }

    if (category === "Case" && PSU) {
      if (prodPSU.length > 0 && get(PSU, "psu_type")) {
        if (!prodPSU.includes(get(PSU, "psu_type"))) {
          return false;
        }
      }
    }

    return true; // ALL GOOD
  }

  return (
    <div className="text-gray-200 p-4 bg-[#0d1117] min-h-screen">
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
            <p className="text-blue-400 text-sm">₱{product.price}</p>
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

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b1f26] rounded-xl w-full max-w-4xl shadow-lg relative flex flex-col md:flex-row h-[80vh] md:items-stretch">

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

            {/* RIGHT - Info */}
            <div className="md:w-1/2 w-full flex flex-col h-full">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{selectedProduct.category}</p>
                <p className="text-blue-400 text-lg font-semibold">₱{selectedProduct.price}</p>

            {/* ADD TO BUILD BUTTON */}
            <button
              onClick={() => {
                const cat = selectedProduct.category;

                // Compatibility checks
                if (cat === "CPU") {
                  const motherboard = selectedParts.Motherboard;
                  if (motherboard && selectedProduct.specs.socket !== motherboard.specs.socket) {
                    alert("Incompatible CPU socket with selected Motherboard!");
                    return;
                  }
                }

                if (cat === "Motherboard") {
                  const cpu = selectedParts.CPU;
                  if (cpu && cpu.specs.socket !== selectedProduct.specs.socket) {
                    alert("Incompatible Motherboard socket with selected CPU!");
                    return;
                  }

                  const ram = selectedParts.RAM;
                  if (ram && ram.specs.ram_type !== selectedProduct.specs.ram_type) {
                    alert("Incompatible RAM type with selected Motherboard!");
                    return;
                  }
                }

                if (cat === "RAM") {
                  const motherboard = selectedParts.Motherboard;
                  if (motherboard && selectedProduct.specs.ram_type !== motherboard.specs.ram_type) {
                    alert("Incompatible RAM type with selected Motherboard!");
                    return;
                  }
                }

                if (cat === "GPU") {
                  const psu = selectedParts.PSU;
                  if (psu && selectedProduct.specs.power > psu.specs.power) {
                    alert("Selected GPU requires more power than your PSU provides!");
                    return;
                  }
                }

                // Add part if compatible
                setSelectedParts(prev => ({
                  ...prev,
                  [cat]: selectedProduct
                }));
                alert(`${cat} added to your build!`);
              }}
              className="mt-3 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-center font-semibold"
            >
              Add to PC Build
            </button>
            
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
