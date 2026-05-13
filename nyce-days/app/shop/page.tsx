import { VendorSignup } from '@/components/shop/vendor-signup'

export const metadata = {
  title: 'Sell plates at THE YARD · Nyce Days',
  description: 'Apply to vend at THE YARD, a Nyce Days cookout. Sunday, May 24 at Rock Creek Park.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Sell plates at THE YARD',
    description: 'Apply to vend at THE YARD. Sunday, May 24 · Rock Creek Park.',
  },
}

export default function ShopPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] px-4 sm:px-6 py-10 sm:py-14">
      <VendorSignup />
    </main>
  )
}
