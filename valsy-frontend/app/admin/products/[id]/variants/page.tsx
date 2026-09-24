"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { showToast } from "@/components/Toast";
import type { ProductDto, ProductVariantDto } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ChevronRight,
  Loader2,
  RefreshCw,
  Layers,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ADMIN_USER = "admin";

export default function ProductVariantsPage() {
  const params = useParams();
  const productId = Number(params?.id);

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // New variant form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newStock, setNewStock] = useState("0");
  const [addingVariant, setAddingVariant] = useState(false);

  const load = useCallback(() => {
    if (!productId) return;
    setLoading(true);
    api
      .getProductById(productId)
      .then((p) => {
        setProduct(p);
        if (p) {
          const edits: Record<string, string> = {};
          p.variants.forEach((v) => {
            edits[v.id] = String(v.stock);
          });
          setStockEdits(edits);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveStock = async (variant: ProductVariantDto) => {
    const newStockVal = parseInt(stockEdits[variant.id] ?? "0", 10);
    if (isNaN(newStockVal) || newStockVal < 0) {
      showToast("error", "Stock must be a non-negative number.");
      return;
    }
    setSaving((s) => ({ ...s, [variant.id]: true }));
    try {
      await api.adjustStock(variant.id, newStockVal, ADMIN_USER);
      showToast("success", `Stock updated to ${newStockVal}`);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update stock";
      showToast("error", msg);
    } finally {
      setSaving((s) => ({ ...s, [variant.id]: false }));
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const stockNum = parseInt(newStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showToast("error", "Stock must be a non-negative number.");
      return;
    }
    setAddingVariant(true);
    try {
      await api.createProductVariant(product.id, newSize.trim(), newColor.trim(), stockNum, ADMIN_USER);
      showToast("success", "Variant added successfully!");
      setNewSize("");
      setNewColor("");
      setNewStock("0");
      setShowAddForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add variant";
      showToast("error", msg);
    } finally {
      setAddingVariant(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-xl">Product not found</p>
        <Link href="/admin/products" className="text-indigo-400">Back to products</Link>
      </div>
    );
  }

  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin" className="hover:text-gray-300 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-300">{product.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin/products" className="text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white">{product.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="text-indigo-400 font-semibold">${product.price.toFixed(2)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {product.variants.length} variants
                </span>
                <span>·</span>
                <span>{totalStock} units total</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddForm((s) => !s)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          </div>
        </div>

        {/* Add Variant Form */}
        {showAddForm && (
          <div className="mb-6 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-5">
            <h3 className="text-sm font-bold text-indigo-300 mb-4">New Variant</h3>
            <form onSubmit={handleAddVariant} className="grid sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Size *</label>
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  required
                  maxLength={50}
                  placeholder="S, M, L..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Color *</label>
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="Black, White..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Initial Stock</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/40 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addingVariant}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {addingVariant ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Variants Table */}
        {product.variants.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">📦</div>
            <p className="text-gray-400">No variants yet. Add one above.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-white/3 border-b border-white/8">
              <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Size</div>
              <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Color</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</div>
              <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</div>
              <div className="col-span-1"></div>
            </div>

            {product.variants.map((variant, i) => {
              const isLow = variant.stock > 0 && variant.stock <= 5;
              const isOut = variant.stock === 0;
              const isDirty = stockEdits[variant.id] !== undefined && parseInt(stockEdits[variant.id], 10) !== variant.stock;

              return (
                <div
                  key={variant.id}
                  className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/2 transition-colors ${
                    i !== product.variants.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <div className="col-span-3 text-white font-semibold text-sm">{variant.size}</div>
                  <div className="col-span-3 text-gray-300 text-sm">{variant.color}</div>
                  <div className="col-span-2">
                    {isOut ? (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <XCircle className="w-3.5 h-3.5" />Out
                      </span>
                    ) : isLow ? (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />Low
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />OK
                      </span>
                    )}
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={stockEdits[variant.id] ?? variant.stock}
                      onChange={(e) =>
                        setStockEdits((s) => ({ ...s, [variant.id]: e.target.value }))
                      }
                      min="0"
                      className={`w-20 px-2 py-1.5 rounded-lg bg-white/5 border text-white text-sm text-center focus:outline-none focus:ring-1 transition-all ${
                        isDirty
                          ? "border-indigo-500/50 focus:ring-indigo-500/20"
                          : "border-white/10 focus:border-indigo-500/40"
                      }`}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => handleSaveStock(variant)}
                      disabled={!isDirty || saving[variant.id]}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {saving[variant.id] ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
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
