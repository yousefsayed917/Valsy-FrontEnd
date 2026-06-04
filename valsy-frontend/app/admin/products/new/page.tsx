"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { showToast } from "@/components/Toast";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, ChevronRight, Trash2 } from "lucide-react";

const ADMIN_USER = "admin";

interface VariantDraft {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Variant drafts
  const [variants, setVariants] = useState<VariantDraft[]>([
    { id: crypto.randomUUID(), size: "", color: "", stock: 0 },
  ]);

  const addVariant = () => {
    setVariants((v) => [
      ...v,
      { id: crypto.randomUUID(), size: "", color: "", stock: 0 },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants((v) => v.filter((d) => d.id !== id));
  };

  const updateVariant = (id: string, field: keyof Omit<VariantDraft, "id">, value: string | number) => {
    setVariants((v) =>
      v.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("error", "Please enter a valid price greater than 0.");
      return;
    }
    const filledVariants = variants.filter((v) => v.size.trim() && v.color.trim());
    if (filledVariants.length === 0) {
      showToast("error", "Add at least one variant with size and color.");
      return;
    }

    setSubmitting(true);
    try {
      const { productId } = await api.createProduct(name, description, priceNum, ADMIN_USER);

      for (const v of filledVariants) {
        await api.createProductVariant(productId, v.size.trim(), v.color.trim(), v.stock, ADMIN_USER);
      }

      showToast("success", `"${name}" created with ${filledVariants.length} variant(s)!`);
      router.push(`/admin/products/${productId}/variants`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product";
      showToast("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin" className="hover:text-gray-300 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-300">New Product</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/products" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black text-white">Create Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Product Details */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
            <h2 className="text-base font-bold text-white mb-5">Product Details</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Describe your product..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Price (USD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium hover:bg-indigo-500/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="grid grid-cols-10 gap-2 text-xs font-medium text-gray-600 px-1">
                <span className="col-span-4">Size</span>
                <span className="col-span-4">Color</span>
                <span className="col-span-1">Stock</span>
                <span className="col-span-1"></span>
              </div>

              {variants.map((variant) => (
                <div key={variant.id} className="grid grid-cols-10 gap-2 items-center">
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => updateVariant(variant.id, "size", e.target.value)}
                    placeholder="S, M, L, XL..."
                    maxLength={50}
                    className="col-span-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/40 transition-all"
                  />
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => updateVariant(variant.id, "color", e.target.value)}
                    placeholder="Black, White..."
                    maxLength={100}
                    className="col-span-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/40 transition-all"
                  />
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(variant.id, "stock", Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="col-span-1 px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/40 transition-all text-center"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    disabled={variants.length === 1}
                    className="col-span-1 flex justify-center text-gray-600 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link
              href="/admin/products"
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
