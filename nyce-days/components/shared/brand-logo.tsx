"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  variant?: "stars" | "full"
  className?: string
  width?: number
  height?: number
  linkToHome?: boolean
}

/**
 * Brand logo component that automatically switches between light/dark versions
 * 
 * @param variant - "stars" for navbar stars logo, "full" for complete logo with text
 * @param className - Additional CSS classes
 * @param width - Logo width (default: 120 for stars, 200 for full)
 * @param height - Logo height (default: 40 for stars, 80 for full)
 * @param linkToHome - Wrap logo in link to homepage
 */
export function BrandLogo({
  variant = "stars",
  className,
  width,
  height,
  linkToHome = false,
}: BrandLogoProps) {
  const isStars = variant === "stars"
  
  const defaultWidth = isStars ? 120 : 200
  const defaultHeight = isStars ? 40 : 80
  
  const logoWidth = width ?? defaultWidth
  const logoHeight = height ?? defaultHeight

  // Logo paths - dark version shows on light bg, light version shows on dark bg
  const darkLogo = isStars ? "/logos/stars-black.png" : "/logos/full-black.png"
  const lightLogo = isStars ? "/logos/stars-white.png" : "/logos/full-white.png"

  const logoElement = (
    <div className={cn("relative", className)}>
      {/* Light mode: show dark logo */}
      <Image
        src={darkLogo}
        alt="Nyce Days"
        width={logoWidth}
        height={logoHeight}
        className="dark:hidden object-contain"
        priority
      />
      {/* Dark mode: show light logo */}
      <Image
        src={lightLogo}
        alt="Nyce Days"
        width={logoWidth}
        height={logoHeight}
        className="hidden dark:block object-contain"
        priority
      />
    </div>
  )

  if (linkToHome) {
    return (
      <Link 
        href="/" 
        className="inline-flex items-center transition-opacity hover:opacity-80"
        aria-label="Nyce Days - Home"
      >
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
