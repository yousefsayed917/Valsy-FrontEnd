"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { ShoppingBag, LayoutDashboard, Store } from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-shadow">
              <span className="text-white font-black text-sm">V</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Valsy
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Shop
            </Link>
            {isAdmin && (
              <Link
                href="/admin/products"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Products
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm text-gray-300 hover:text-white"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center animate-in">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {isAdmin ? (
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm text-gray-300 hover:text-white"
              >
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Store</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm text-gray-300 hover:text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
