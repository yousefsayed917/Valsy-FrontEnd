import type { ProductDto } from "@/types";
import Link from "next/link";
import { Tag, Layers } from "lucide-react";

interface ProductCardProps {
  product: ProductDto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-4 hover:border-indigo-500/50 hover:bg-white/8 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
        {/* Status Badge */}
        <div className="flex items-start justify-between">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              inStock
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Product Image Placeholder */}
        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/5 flex items-center justify-center group-hover:from-indigo-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300">
          <div className="text-5xl font-black text-white/10 group-hover:text-white/20 transition-colors select-none">
            {product.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-auto">
          <Tag className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-indigo-400 font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
