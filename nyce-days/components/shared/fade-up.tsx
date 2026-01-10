"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
  duration?: number
  once?: boolean
}

export function FadeUp({
  children,
  delay = 0,
  className,
  duration = 0.5,
  once = true,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
