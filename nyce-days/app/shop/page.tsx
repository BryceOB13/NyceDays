import { InvitationalSignup } from "@/components/shop/invitational-signup"

export const metadata = {
  title: "Shop | Nyce Days",
  description: "Sign up for the Nyce Invitational DJ showcase.",
}

export default async function ShopPage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-background px-4 pt-4 pb-4 md:pt-12 md:pb-10">
      <InvitationalSignup />
    </div>
  )
}
