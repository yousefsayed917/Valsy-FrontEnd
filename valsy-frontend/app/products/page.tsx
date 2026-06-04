"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ProductDto } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getProducts(search || undefined)
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue);
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Shop All Products</h1>
          <p className="text-gray-500">
            {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} available`}
          </p>
        </div>

        {/* Search */}
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
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </form>

        {/* Content */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-gray-600 text-sm">Make sure the backend is running on port 5220</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-gray-400 font-medium">No products found</p>
            {search && (
              <button
                onClick={() => { setSearch(""); setInputValue(""); }}
                className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
              >
                Clear search
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
