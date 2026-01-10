import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { ProductWithImages } from "@/types/database"

interface ProductCardProps {
  product: ProductWithImages
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary)?.media 
    || product.images?.[0]?.media

  const hasDiscount = product.compare_price && product.compare_price > product.price

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-border"
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
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-nd-red px-2 py-1 rounded text-xs font-medium text-white">
            Sale
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      </div>
      <div className="p-5">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-widest text-nd-amber">
            {product.category}
          </span>
        )}
        <h3 className="mt-2 font-serif text-lg font-semibold text-foreground group-hover:text-nd-red transition-colors duration-200">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-sans font-medium text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="font-sans text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
