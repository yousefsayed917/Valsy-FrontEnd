"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { OrderDto } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { CheckCircle, Package, MapPin, Phone, ArrowRight } from "lucide-react";

const STATUS_STEPS = ["Pending", "Paid", "Shipped", "Delivered"];

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    api
      .getOrderById(Number(params.id))
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-xl">Order not found</p>
        <Link href="/" className="text-indigo-400">Return home</Link>
      </div>
    );
  }

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-400">
            Thank you for your purchase. Order{" "}
            <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded text-gray-300">
              #{order.id}
            </span>
          </p>
        </div>

        {/* Status Progress */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
            Order Status
          </h2>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      i <= stepIndex
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-white/5 border-white/15 text-gray-600"
                    }`}
                  >
                    {i < stepIndex ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs text-center ${
                      i <= stepIndex ? "text-indigo-300" : "text-gray-600"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 mb-4 transition-colors ${
                      i < stepIndex ? "bg-indigo-600" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 mb-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Order Items</h2>
          </div>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-white font-medium">{item.productName}</p>
                  <p className="text-gray-500 text-xs">{item.size} · {item.color} · ×{item.quantity}</p>
                </div>
                <p className="text-indigo-400 font-bold">${item.totalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 mb-8 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-bold text-white">Shipping Details</h2>
          </div>
          <p className="text-gray-400 text-sm">{order.shippingAddressLine1}</p>
          <p className="text-gray-400 text-sm">{order.shippingCity}, {order.shippingCountry}</p>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <Phone className="w-3.5 h-3.5" />
            {order.contactPhone}
          </div>
        </div>

        <Link
          href="/products"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
