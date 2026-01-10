import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { ProductGrid, EmptyState } from "@/components/shop"
import { getAllProducts } from "@/lib/queries"

export const metadata = {
  title: "Shop | Nyce Days",
  description: "Shop Nyce Days merchandise, apparel, accessories, and event tickets.",
}

export default async function ShopPage() {
  const products = await getAllProducts()

  return (
    <main>
      <Section className="bg-nd-black pt-32">
        <FadeUp>
          <h1 className="text-center font-serif text-4xl font-bold text-nd-white md:text-5xl lg:text-6xl">
            Shop
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-nd-gray-400">
            Exclusive merch, apparel, and event tickets.
          </p>
        </FadeUp>

        <div className="mt-12">
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </Section>
    </main>
  )
}
