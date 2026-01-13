import Image from "next/image"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { ProductGrid, EmptyState } from "@/components/shop"
import { getAllProducts } from "@/lib/queries"

export const metadata = {
  title: "Shop | Nyce Days",
  description: "Shop Nyce Days merchandise and apparel.",
}

export default async function ShopPage() {
  const products = await getAllProducts()

  return (
    <main>
      <Section className="bg-background pt-32">
        <FadeUp>
          <p className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            Shop
          </p>
          <div className="mt-6 flex justify-center">
            <Image
              src="/logos/stars-white.png"
              alt="Nyce Days"
              width={320}
              height={96}
              className="hidden dark:block object-contain h-24 md:h-28 w-auto"
            />
            <Image
              src="/logos/stars-black.png"
              alt="Nyce Days"
              width={320}
              height={96}
              className="dark:hidden object-contain h-24 md:h-28 w-auto"
            />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground">
            Exclusive merch and apparel.
          </p>
        </FadeUp>

        <div className="mt-12">
          {products.length === 0 ? (
            <EmptyState 
              title="Coming Soon"
              description="New drops loading. Stay tuned."
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </Section>
    </main>
  )
}
