import type { Metadata } from "next"
import "./globals.css"
import { Nav } from "@/components/layout/nav"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Nyce Days | Event Curation & Community Marketing",
  description: "Event curation, community marketing, and content creation. Have A Nyce Day!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-nd-black text-nd-white antialiased min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
