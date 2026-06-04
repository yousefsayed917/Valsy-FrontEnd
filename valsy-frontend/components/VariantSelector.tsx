"use client";

import type { ProductVariantDto } from "@/types";

interface VariantSelectorProps {
  variants: ProductVariantDto[];
  selectedVariant: ProductVariantDto | null;
  onSelect: (variant: ProductVariantDto) => void;
}

/**
 * Renders size and color pill selectors for a product.
 * Sizes are derived from all available variants; colors filter by the selected size.
 */
export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size))];

  const colorsForSelectedSize = selectedVariant
    ? variants.filter((v) => v.size === selectedVariant.size)
    : [];

  const handleSizeClick = (size: string) => {
    const next =
      variants.find((v) => v.size === size && v.stock > 0) ||
      variants.find((v) => v.size === size);
    if (next) onSelect(next);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Size Pills */}
      {sizes.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2.5">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedVariant?.size === size;
              const hasStock = variants.some(
                (v) => v.size === size && v.stock > 0
              );

              return (
                <button
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  disabled={!hasStock}
                  title={!hasStock ? "Out of stock" : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isSelected
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : hasStock
                      ? "bg-white/5 border-white/10 text-gray-300 hover:border-indigo-500/50 hover:bg-white/8"
                      : "bg-white/2 border-white/5 text-gray-600 line-through cursor-not-allowed opacity-50"
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Pills */}
      {colorsForSelectedSize.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2.5">
            Color:{" "}
            <span className="text-white normal-case font-bold">
              {selectedVariant?.color}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colorsForSelectedSize.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => onSelect(variant)}
                  disabled={variant.stock === 0}
                  title={
                    variant.stock === 0
                      ? "Out of stock"
                      : `${variant.stock} left`
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                    : variant.stock > 0
                      ? "bg-white/5 border-white/10 text-gray-300 hover:border-indigo-500/40 hover:bg-white/8"
                      : "bg-white/2 border-white/5 text-gray-600 line-through cursor-not-allowed opacity-50"
                    }`}
                >
                  {variant.color}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
