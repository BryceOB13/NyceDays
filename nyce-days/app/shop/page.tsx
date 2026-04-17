import { InvitationalSignup } from "@/components/shop/invitational-signup"

export const metadata = {
  title: "Something Nyce Open Decks | Nyce Days",
  description: "Open-deck DJ showcase. Sunday, April 19 at Looking Glass Lounge, DC. Sign up to spin.",
  openGraph: {
    title: "Something Nyce Open Decks — Think You Got Next?",
    description: "Open-deck DJ showcase. Sunday, April 19 at Looking Glass Lounge, DC. 7 PM–Midnight. Sign up to spin.",
  },
  twitter: {
    title: "Something Nyce Open Decks — Think You Got Next?",
    description: "Open-deck DJ showcase. Sunday, April 19 at Looking Glass Lounge, DC. 7 PM–Midnight. Sign up to spin.",
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
