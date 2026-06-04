"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ProductDto } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import {
  Package,
  Layers,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAdminProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalVariants = products.reduce((s, p) => s + p.variants.length, 0);
  const totalStock = products.reduce(
    (s, p) => s + p.variants.reduce((vs, v) => vs + v.stock, 0),
    0
  );
  const lowStockVariants = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock > 0 && v.stock <= 5)
      .map((v) => ({ ...v, productName: p.name }))
  );

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your Valsy store</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" /> New Product
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {[
                {
                  label: "Total Products",
                  value: products.length,
                  icon: <Package className="w-5 h-5 text-indigo-400" />,
                  color: "from-indigo-500/10 to-indigo-500/5",
                  border: "border-indigo-500/20",
                },
                {
                  label: "Total Variants",
                  value: totalVariants,
                  icon: <Layers className="w-5 h-5 text-purple-400" />,
                  color: "from-purple-500/10 to-purple-500/5",
                  border: "border-purple-500/20",
                },
                {
                  label: "Total Stock Units",
                  value: totalStock,
                  icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                  color: "from-emerald-500/10 to-emerald-500/5",
                  border: "border-emerald-500/20",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} p-6 flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Low Stock Alert */}
            {lowStockVariants.length > 0 && (
              <div className="mb-8 p-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 font-semibold text-sm">
                    {lowStockVariants.length} variant{lowStockVariants.length !== 1 ? "s" : ""} running low on stock
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {lowStockVariants.map((v) => (
                      <span key={v.id} className="text-xs text-amber-500/70">
                        {v.productName} — {v.size}/{v.color} ({v.stock} left)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Link
                href="/admin/products"
                className="group flex items-center justify-between p-5 rounded-2xl border border-white/8 bg-white/3 hover:border-indigo-500/30 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Manage Products</p>
                    <p className="text-gray-500 text-xs">{products.length} products total</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/admin/products/new"
                className="group flex items-center justify-between p-5 rounded-2xl border border-white/8 bg-white/3 hover:border-purple-500/30 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Add New Product</p>
                    <p className="text-gray-500 text-xs">Create a product with variants</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
