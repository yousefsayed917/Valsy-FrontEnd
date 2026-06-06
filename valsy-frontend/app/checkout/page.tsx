"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { api } from "@/lib/api";
import { showToast } from "@/components/Toast";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Loader2, User, MapPin, Phone } from "lucide-react";
import type { CheckoutFormData } from "@/types";

const SYSTEM_USER = "store-checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast("error", "Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create customer
      const { customerId } = await api.createCustomer(form, SYSTEM_USER);

      // 2. Create order
      const { orderId } = await api.createOrder(
        customerId,
        form.addressLine1,
        form.city,
        form.country,
        form.phoneNumber,
        SYSTEM_USER
      );

      // 3. Add each cart item
      for (const item of items) {
        await api.addOrderItem(
          orderId,
          item.productId,
          item.productVariantId,
          item.quantity,
          SYSTEM_USER
        );
      }

      // 4. Submit order
      await api.submitOrder(orderId, SYSTEM_USER);

      clearCart();
      showToast("success", "Order placed successfully!");
      router.push(`/orders/${orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      showToast("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="w-12 h-12 text-gray-600" />
        <p className="text-gray-400 text-xl">Your cart is empty</p>
        <Link href="/products" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Back to shopping
        </Link>
      </div>
    );
  }

  const fields = [
    {
      section: "Personal", icon: <User className="w-4 h-4" />, items: [
        { name: "firstName", label: "First Name", type: "text" },
        { name: "lastName", label: "Last Name", type: "text" },
        { name: "email", label: "Email Address", type: "email" },
      ]
    },
    {
      section: "Contact & Shipping", icon: <MapPin className="w-4 h-4" />, items: [
        { name: "phoneNumber", label: "Phone Number", type: "tel" },
        { name: "addressLine1", label: "Address", type: "text" },
        { name: "city", label: "City", type: "text" },
        { name: "country", label: "Country", type: "text" },
      ]
    },
  ];

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black text-white">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {fields.map((section) => (
                <div
                  key={section.section}
                  className="rounded-2xl border border-white/8 bg-white/3 p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-indigo-400">{section.icon}</span>
                    <h2 className="text-base font-bold text-white">{section.section}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {section.items.map((field) => (
                      <div key={field.name} className={field.name === "addressLine1" ? "sm:col-span-2" : ""}>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={(form as unknown as Record<string, string>)[field.name]}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-white/10 bg-white/3 p-5 flex flex-col gap-4">
                <h2 className="text-base font-bold text-white">Order Summary</h2>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productVariantId} className="flex justify-between text-sm">
                      <span className="text-gray-400 truncate flex-1">
                        {item.productName} ×{item.quantity}
                      </span>
                      <span className="text-white ml-2 flex-shrink-0">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
