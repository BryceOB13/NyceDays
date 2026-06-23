"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { NewsletterForm } from "@/components/community/newsletter-form"

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if already shown this session or dismissed before
    const dismissed = localStorage.getItem("nd-newsletter-dismissed")
    const subscribed = localStorage.getItem("nd-newsletter-subscribed")
    
    if (dismissed || subscribed) {
      setHasShown(true)
      return
    }

    const handleScroll = () => {
      if (hasShown) return
      
      // Show modal after scrolling 50% of the page
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent > 50) {
        setIsOpen(true)
        setHasShown(true)
        window.removeEventListener("scroll", handleScroll)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasShown])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("nd-newsletter-dismissed", "true")
  }

  const handleSuccess = () => {
    localStorage.setItem("nd-newsletter-subscribed", "true")
    setTimeout(() => setIsOpen(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md"
          >
            <div className="bg-foreground text-background rounded-lg p-6 sm:p-8 relative">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-background/60 hover:text-background transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-nd-red mb-2">
                  Join The
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                  Nyce List
                </h2>
                <p className="text-background/70 mb-5 sm:mb-6 text-sm sm:text-base">
                  Get early access to events, pieces, and exclusive content.
                </p>
                
                <NewsletterForm 
                  source="modal" 
                  onSuccess={handleSuccess}
                  variant="dark"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
