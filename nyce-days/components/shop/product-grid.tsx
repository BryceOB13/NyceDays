"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "./product-card"
import { FadeUp } from "@/components/shared/fade-up"
import type { ProductWithImages } from "@/types/database"

interface ProductGridProps {
  products: ProductWithImages[]
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "accessories", label: "Accessories" },
  { value: "tickets", label: "Tickets" },
] as const

export function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products
    }
    return products.filter((product) => product.category === activeCategory)
  }, [products, activeCategory])

  return (
    <div>
      <FadeUp>
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="bg-nd-gray-900 border border-nd-gray-800">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="data-[state=active]:bg-nd-amber data-[state=active]:text-nd-black text-nd-gray-400 hover:text-nd-white"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </FadeUp>

      {filteredProducts.length === 0 ? (
        <FadeUp>
          <div className="py-12 text-center">
            <p className="text-nd-gray-400">No products found in this category.</p>
          </div>
        </FadeUp>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <FadeUp key={product.id} delay={0.1 * (index % 8)}>
              <ProductCard product={product} />
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  )
}
