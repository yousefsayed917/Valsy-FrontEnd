import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

export default async function HomePage() {
  let featuredProducts = [];
  try {
    const all = await api.getProducts();
    featuredProducts = all.slice(0, 4);
  } catch {
    // Backend may not be running
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="animate-float-slow-delay absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-pink-600/8 blur-3xl" />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          New Collection Available
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 max-w-4xl leading-none">
          Dress with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Purpose
          </span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          Discover premium fashion crafted for those who value quality, style, and authenticity.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            Browse Catalog
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-12">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "500+", label: "Premium Products" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Truck className="w-5 h-5 text-indigo-400" />,
              title: "Free Shipping",
              desc: "On all orders over $50. Fast delivery worldwide.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
              title: "Quality Guaranteed",
              desc: "Every item is inspected for premium quality before shipment.",
            },
            {
              icon: <Sparkles className="w-5 h-5 text-purple-400" />,
              title: "Exclusive Designs",
              desc: "Unique styles you won't find anywhere else.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-white">Featured Products</h2>
                <p className="text-gray-500 mt-1">Handpicked favourites from our collection</p>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-transparent p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
            <div className="relative">
              <h2 className="text-4xl font-black text-white mb-4">
                Start Shopping Today
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of fashion-forward customers who trust Valsy.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
