import { InvitationalSignup } from "@/components/shop/invitational-signup"

export const metadata = {
  title: "Nyce Invitational | Nyce Days",
  description: "Open-deck DJ showcase. Sunday, April 12 at The Wharf, DC. Sign up to spin.",
  openGraph: {
    title: "Nyce Invitational — Think You Got Next?",
    description: "Open-deck DJ showcase. Sunday, April 12 at The Wharf, DC. 3–8 PM. Sign up to spin.",
  },
  twitter: {
    title: "Nyce Invitational — Think You Got Next?",
    description: "Open-deck DJ showcase. Sunday, April 12 at The Wharf, DC. 3–8 PM. Sign up to spin.",
  },
}

export default async function ShopPage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-background px-4 pt-4 pb-4 md:pt-12 md:pb-10">
      <InvitationalSignup />
    </div>
  )
}
