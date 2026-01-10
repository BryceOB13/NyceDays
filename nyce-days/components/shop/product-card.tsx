import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { ProductWithImages } from "@/types/database"

interface ProductCardProps {
  product: ProductWithImages
}

export function ProductCard({ product }: ProductCardProps) {
  // Get primary image or first image
  const primaryImage = product.images?.find((img) => img.is_primary)?.media 
    || product.images?.[0]?.media

  const hasDiscount = product.compare_price && product.compare_price > product.price

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-lg bg-nd-gray-900"
    >
      <div className="relative aspect-square overflow-hidden">
        {primaryImage?.public_url ? (
          <Image
            src={primaryImage.public_url}
            alt={primaryImage.alt_text || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-nd-gray-800">
            <span className="text-nd-gray-500">No image</span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-nd-red px-2 py-1 rounded text-xs font-medium text-nd-white">
            Sale
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wider text-nd-amber">
            {product.category}
          </span>
        )}
        <h3 className="mt-1 font-serif text-lg font-semibold text-nd-white group-hover:text-nd-cream transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-sans text-nd-white">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="font-sans text-sm text-nd-gray-500 line-through">
              {formatPrice(product.compare_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
