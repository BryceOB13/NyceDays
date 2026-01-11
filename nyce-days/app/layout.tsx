import type { Metadata } from "next"
import "./globals.css"
import { Nav } from "@/components/layout/nav"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { AnalyticsProvider } from "@/components/shared/analytics-provider"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nycedays.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nyce Days | Event Curation & Community Marketing',
    template: '%s | Nyce Days',
  },
  description: 'Event curation, community marketing, and content creation in DC, NYC, and Baltimore. Have A Nyce Day!',
  keywords: ['event curation', 'community marketing', 'content creation', 'DC events', 'NYC events', 'Baltimore events', 'brand partnerships'],
  authors: [{ name: 'Nyce Days' }],
  creator: 'Nyce Days',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Nyce Days',
    title: 'Nyce Days | Event Curation & Community Marketing',
    description: 'Event curation, community marketing, and content creation. Have A Nyce Day!',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Nyce Days',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyce Days | Event Curation & Community Marketing',
    description: 'Event curation, community marketing, and content creation. Have A Nyce Day!',
    creator: '@nycedays',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            <Nav />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
