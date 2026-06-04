"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { ProductDto } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { Plus, Search, Layers, Tag, ChevronRight, RefreshCw } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api
      .getAdminProducts(search || undefined)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-300">Products</span>
            </div>
            <h1 className="text-3xl font-black text-white">Products</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
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
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setInputValue(""); }}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-all"
            >
              Clear
            </button>
          )}
        </form>

        {/* Table */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">📦</div>
            <p className="text-gray-400 font-medium">No products found</p>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create your first product
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-white/3 border-b border-white/8">
              <div className="col-span-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Variants</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide"></div>
            </div>

            {/* Rows */}
            {products.map((product, i) => {
              const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
              const isLowStock = totalStock > 0 && totalStock <= 10;
              const isOutOfStock = totalStock === 0;
              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/3 transition-colors ${
                    i !== products.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-black text-white/25">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                      {product.description && (
                        <p className="text-gray-600 text-xs truncate">{product.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-indigo-400 font-bold text-sm">
                    <Tag className="w-3 h-3" />${product.price.toFixed(2)}
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-gray-400 text-sm">
                    <Layers className="w-3 h-3" />{product.variants.length}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      isOutOfStock
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : isLowStock
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}>
                      {isOutOfStock ? "Out of Stock" : `${totalStock} units`}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Link
                      href={`/admin/products/${product.id}/variants`}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                      title="Manage variants"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
