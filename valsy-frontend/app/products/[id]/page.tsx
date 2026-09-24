"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useCart } from "@/components/CartProvider";
import { showToast } from "@/components/Toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import VariantSelector from "@/components/VariantSelector";
import type { ProductDto, ProductVariantDto } from "@/types";
import { ShoppingBag, ArrowLeft, Tag, CheckCircle } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    api
      .getProductById(Number(params.id))
      .then((p) => {
        setProduct(p);
        if (p?.variants?.length) {
          const inStock = p.variants.find((v) => v.stock > 0) || p.variants[0];
          setSelectedVariant(inStock);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return <LoadingSpinner size="lg" />;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-xl">Product not found</p>
        <button
          onClick={() => router.push("/products")}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          Back to catalog
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    if (selectedVariant.stock < quantity) {
      showToast("error", "Not enough stock available.");
      return;
    }
    setAdding(true);
    addItem({
      productId: product.id,
      productVariantId: selectedVariant.id,
      productName: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      unitPrice: product.price,
      quantity,
    });
    showToast("success", `${product.name} added to cart!`);
    setTimeout(() => setAdding(false), 600);
  };

  // Group variants by size
  // (kept for reference; VariantSelector handles the logic internally)

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/8 flex items-center justify-center">
            <span className="text-[120px] font-black text-white/8 select-none">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-gray-400 leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-400" />
              <span className="text-3xl font-bold text-indigo-400">${product.price.toFixed(2)}</span>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}

            {/* Stock */}
            {selectedVariant && (
              <div className="flex items-center gap-2 text-sm">
                {selectedVariant.stock > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">
                      {selectedVariant.stock} in stock
                    </span>
                  </>
                ) : (
                  <span className="text-red-400">Out of stock</span>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-400 font-medium">Qty:</p>
              <div className="flex items-center gap-2 border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  −
                </button>
                <span className="w-8 text-center text-white font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0 || adding}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <ShoppingBag className="w-5 h-5" />
              {adding ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
