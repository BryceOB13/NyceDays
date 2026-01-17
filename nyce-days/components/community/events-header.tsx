"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"
import { isValidEmail } from "@/lib/schemas"
import { ChevronDown, X, ArrowRight, Check, Smartphone } from "lucide-react"

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function EventsHeader() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [smsConsent, setSmsConsent] = useState(true)
  const [emailConsent, setEmailConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleDismiss = () => {
    if (sectionRef.current) {
      const sectionHeight = sectionRef.current.offsetHeight
      window.scrollTo({
        top: sectionHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value && !isValidEmail(value)) {
      setEmailError("Please enter a valid email")
    } else {
      setEmailError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!smsConsent || !phone) return
    
    // Validate email if provided
    if (email && !isValidEmail(email)) {
      setEmailError("Please enter a valid email")
      return
    }

    setStatus("loading")
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          first_name: firstName || null,
          email: email || null,
          source: 'community',
          sms_consent: smsConsent,
          email_consent: emailConsent,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus("success")
        setPhone("")
        setFirstName("")
        setEmail("")
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
      }
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen md:min-h-[85vh] flex items-center justify-center py-10 md:py-20">
      <VideoBackground
        desktopSrc={videos.events.header.desktop}
        mobileSrc={videos.events.header.mobile}
        poster={videos.events.header.poster}
        overlay="bg-black/50"
      />
      
      {/* Dismiss button - top right (desktop only) */}
      <button
        onClick={handleDismiss}
        className="absolute top-6 right-6 z-20 p-2 text-white/50 hover:text-white transition-colors hidden md:block"
        aria-label="Skip to events"
      >
        <X className="w-6 h-6" />
      </button>

      <motion.div className="relative z-10 text-center px-6 w-full max-w-md">
        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FadeUp>
                <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-nd-red">
                  You&apos;re Invited
                </p>
                <h1 className="mt-3 font-serif text-5xl md:text-6xl text-white italic whitespace-nowrap">
                  The Nyce List
                </h1>
                <p className="mt-4 font-serif text-base text-white/60 leading-relaxed max-w-sm mx-auto">
                  This is how you hear first. Event announcements before they&apos;re public. 
                  Drops before they sell out. The things we only tell our people.
                </p>
              </FadeUp>

              <FadeUp delay={0.2}>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Phone - PRIMARY INPUT */}
                  <div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <Smartphone className="w-5 h-5" />
                      </span>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        required
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-nd-red transition-colors font-serif"
                      />
                    </div>
                  </div>

                  {/* First Name + Email - Secondary row */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-nd-red/50 transition-colors font-serif"
                    />
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none transition-colors font-serif ${
                          emailError ? 'border-red-500' : 'border-white/10 focus:border-nd-red/50'
                        }`}
                      />
                      {emailError && (
                        <p className="absolute left-0 top-full text-red-400 text-xs mt-1">{emailError}</p>
                      )}
                    </div>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-3 pt-2 text-left">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsConsent}
                        onChange={(e) => setSmsConsent(e.target.checked)}
                        required
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-nd-red focus:ring-nd-red focus:ring-offset-0 accent-nd-red"
                      />
                      <span className="text-white/50 text-sm font-serif">
                        Text me about events and drops
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailConsent}
                        onChange={(e) => setEmailConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-nd-red focus:ring-nd-red focus:ring-offset-0 accent-nd-red"
                      />
                      <span className="text-white/50 text-sm font-serif">
                        Email me too
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={status === "loading" || !smsConsent || !phone}
                    className="w-full mt-2 py-4 bg-nd-red text-white font-medium uppercase tracking-wider text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative flex items-center justify-center gap-2 hover:bg-[#B83D3D] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={status}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        {status === "loading" ? "Joining..." : (
                          <>
                            I&apos;m In
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>

                  <p className="text-[10px] text-white/30 mt-4 font-serif text-center">
                    Msg & data rates may apply. Reply STOP to unsubscribe.
                  </p>
                </form>
              </FadeUp>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-nd-red/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-nd-red" />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-3">
                You&apos;re on the list.
              </h3>
              <p className="font-serif text-white/50">
                We&apos;ll text you when something&apos;s worth your time.
              </p>
              <button
                onClick={() => {
                  setStatus("idle")
                  handleDismiss()
                }}
                className="mt-8 px-6 py-2 text-white/50 font-medium text-xs uppercase tracking-wider hover:text-white transition-colors"
              >
                See Events
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip to events - centered (only show when form is visible) */}
        {status !== "success" && (
          <motion.button
            onClick={handleDismiss}
            className="mt-8 mx-auto flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs uppercase tracking-widest">Skip to Events</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>
    </section>
  )
}
