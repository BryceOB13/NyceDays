import { InvitationalSignup } from "@/components/shop/invitational-signup"

export const metadata = {
  title: "Royalties DJ Signup | Nyce Days",
  description: "Sign up to spin at Royalties — the creative day party. Sunday, May 17 at Seta Oasis, DC.",
  openGraph: {
    title: "Royalties — Think You Got Next?",
    description: "The creative day party. Sunday, May 17 at Seta Oasis, DC. 3–10 PM. 1-hour sets.",
  },
  twitter: {
    title: "Royalties — Think You Got Next?",
    description: "The creative day party. Sunday, May 17 at Seta Oasis, DC. 3–10 PM. 1-hour sets.",
  },
}

export default async function ShopPage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] w-full bg-background pt-6 pb-6 md:pt-8 md:pb-10">
      <div className="w-full max-w-2xl mx-auto px-4">
        <InvitationalSignup />
      </div>
    </div>
  )
}
