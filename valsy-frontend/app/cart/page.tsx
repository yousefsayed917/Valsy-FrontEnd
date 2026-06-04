"use client";

import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Add some products to get started.</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
        >
          Shop Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black text-white">Your Cart</h1>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            {totalItems}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.productVariantId}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all"
              >
                {/* Thumb */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-white/5 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-white/15">
                    {item.productName.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{item.productName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {item.size} · {item.color}
                  </p>
                  <p className="text-indigo-400 font-bold text-sm mt-1">
                    ${item.unitPrice.toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-1 border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                    className="w-8 h-8 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-white text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                    className="w-8 h-8 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-white font-bold text-sm w-16 text-right">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productVariantId)}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-white/10 bg-white/3 p-5 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white">Order Summary</h2>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products"
                className="text-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
