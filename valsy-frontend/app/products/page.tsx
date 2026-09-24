"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ProductDto, ProductFiltersDto } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [availableFilters, setAvailableFilters] = useState<ProductFiltersDto | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMinPrice, setSelectedMinPrice] = useState<string>("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>("");

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    api
      .getProducts({
        search: search || undefined,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        minPrice: selectedMinPrice ? Number(selectedMinPrice) : undefined,
        maxPrice: selectedMaxPrice ? Number(selectedMaxPrice) : undefined,
      })
      .then((res) => {
        setProducts(res.products);
        setAvailableFilters(res.filters);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [search]); // Re-fetch on search change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue);
  };

  const applyFilters = () => {
    setShowFilters(false);
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedSize("");
    setSelectedColor("");
    setSelectedMinPrice("");
    setSelectedMaxPrice("");
    // We don't fetch immediately here, they click "Apply" to confirm.
  };

  return (
    <div className="min-h-screen px-4 py-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Shop All Products</h1>
          <p className="text-gray-500">
            {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} available`}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              showFilters || selectedSize || selectedColor || selectedMinPrice || selectedMaxPrice
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && availableFilters && (
          <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSize("")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                      !selectedSize ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  {availableFilters.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                        selectedSize === size ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedColor("")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                      !selectedColor ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  {availableFilters.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border capitalize ${
                        selectedColor === color ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price Range</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={selectedMinPrice}
                    onChange={(e) => setSelectedMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={selectedMaxPrice}
                    onChange={(e) => setSelectedMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-gray-600 text-sm">Make sure the backend is running on port 7156</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-gray-400 font-medium">No products found</p>
            {(search || selectedSize || selectedColor || selectedMinPrice || selectedMaxPrice) && (
              <button
                onClick={() => { setSearch(""); setInputValue(""); clearFilters(); applyFilters(); }}
                className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
              >
                Clear filters and search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
