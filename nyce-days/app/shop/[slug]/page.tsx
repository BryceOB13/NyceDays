import { notFound } from "next/navigation"
import Link from "next/link"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { Button } from "@/components/ui/button"
import { getProductBySlug } from "@/lib/queries"
import { formatPrice } from "@/lib/utils"
import { ProductImageGallery } from "./product-image-gallery"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found | Nyce Days",
    }
  }

  return {
    title: `${product.name} | Nyce Days Shop`,
    description: product.description || `Shop ${product.name} from Nyce Days`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const hasDiscount = product.compare_price && product.compare_price > product.price
  const images = product.images
    ?.sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return a.sort_order - b.sort_order
    })
    .map((img) => ({
      src: img.media.public_url || "",
      alt: img.media.alt_text || product.name,
    }))
    .filter((img) => img.src) || []

  return (
    <main>
      <Section className="bg-background pt-32">
        <div className="grid gap-12 lg:grid-cols-2">
          <FadeUp>
            {images.length > 0 ? (
              <ProductImageGallery images={images} productName={product.name} />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-secondary">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-col">
              {product.category && (
                <span className="text-sm font-medium uppercase tracking-wider text-nd-amber">
                  {product.category}
                </span>
              )}
              
              <h1 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.compare_price!)}
                    </span>
                    <span className="rounded bg-nd-red px-2 py-1 text-xs font-medium text-white">
                      Sale
                    </span>
                  </>
                )}
              </div>

              {product.description && (
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="mt-6">
                {product.inventory > 0 ? (
                  <span className="text-sm text-muted-foreground">
                    {product.inventory <= 5
                      ? `Only ${product.inventory} left in stock`
                      : "In stock"}
                  </span>
                ) : (
                  <span className="text-sm text-nd-red">Out of stock</span>
                )}
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="w-full bg-nd-amber text-black hover:bg-nd-amber/90 sm:w-auto"
                  disabled={product.inventory === 0}
                >
                  {product.inventory === 0 ? "Sold Out" : "Add to Cart"}
                </Button>
              </div>

              <div className="mt-12 border-t border-border pt-8">
                <Button
                  asChild
                  variant="outline"
                >
                  <Link href="/shop">← Back to Shop</Link>
                </Button>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>
    </main>
  )
}
