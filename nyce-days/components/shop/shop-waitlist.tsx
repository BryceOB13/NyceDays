"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Mail, ShoppingBag } from "lucide-react"
import { isValidEmail } from "@/lib/schemas"
import { useAnalytics } from "@/hooks/use-analytics"
import { FadeUp } from "@/components/shared/fade-up"
import { VideoBackground } from "@/components/shared/video-background"
import { videos } from "@/lib/videos"

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function ShopWaitlist() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [phone, setPhone] = useState("")
  const [emailError, setEmailError] = useState("")
  const [smsConsent, setSmsConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { track } = useAnalytics()

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setEmailError(value && !isValidEmail(value) ? "Please enter a valid email" : "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email")
      return
    }

    setStatus("loading")
    setErrorMessage("")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName || null,
          phone: phone || null,
          source: "shop",
          email_consent: true,
          sms_consent: Boolean(phone) && smsConsent,
        }),
      })

      const data = await res.json()
      if (data.success) {
        track("shop_waitlist_signup", { source: "shop", sms: Boolean(phone) && smsConsent })
        setStatus("success")
        setEmail("")
        setFirstName("")
        setPhone("")
      } else {
        setStatus("error")
        setErrorMessage(data.message || "Something went wrong. Please try again.")
        setTimeout(() => setStatus("idle"), 4000)
      }
    } catch {
      setStatus("error")
      setErrorMessage("Network error. Please try again.")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-[#0A0A0A] py-16 md:py-24">
      {/* Ambient brand video background */}
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        poster={videos.hero.poster}
        overlay="bg-gradient-to-b from-[rgba(10,10,10,0.7)] via-[rgba(10,10,10,0.78)] to-[rgba(10,10,10,0.92)]"
      />

      {/* Subtle red glow accent over the video */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nd-red/8 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div
              key="form"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <FadeUp>
                <span className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.3em] text-nd-red">
                  <ShoppingBag className="h-4 w-4" />
                  Nyce Days Shop
                </span>
                <h2 className="mt-3 font-serif text-4xl italic text-white md:text-5xl">
                  Coming soon.
                </h2>
                <p className="mx-auto mt-4 max-w-sm font-serif text-base leading-relaxed text-white/60">
                  Apparel, accessories, and limited-edition pieces. Sign up below and you&apos;ll be first to know when we open.
                </p>
              </FadeUp>

              <FadeUp delay={0.15}>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
                  {/* Email - primary input */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      required
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`w-full rounded-lg border bg-white/5 py-4 pl-12 pr-4 font-serif text-lg text-white placeholder:text-white/30 transition-colors focus:outline-none ${
                        emailError ? "border-red-500" : "border-white/20 focus:border-nd-red"
                      }`}
                    />
                    {emailError && (
                      <p className="absolute left-0 top-full mt-1 text-xs text-red-400">{emailError}</p>
                    )}
                  </div>

                  {/* First name + phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-serif text-sm text-white placeholder:text-white/30 transition-colors focus:border-nd-red/50 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-serif text-sm text-white placeholder:text-white/30 transition-colors focus:border-nd-red/50 focus:outline-none"
                    />
                  </div>

                  {/* SMS consent - only relevant once a phone is entered */}
                  <AnimatePresence>
                    {phone && (
                      <motion.label
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex cursor-pointer items-start gap-3 overflow-hidden pt-1"
                      >
                        <input
                          type="checkbox"
                          checked={smsConsent}
                          onChange={(e) => setSmsConsent(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-nd-red"
                        />
                        <span className="font-serif text-sm text-white/60">
                          Text me when the shop drops
                        </span>
                      </motion.label>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={status === "loading" || !email}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-nd-red py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#B83D3D] disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {status === "loading" ? (
                      "Joining..."
                    ) : (
                      <>
                        <span>Notify me</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>

                  {status === "error" && (
                    <p className="text-center text-sm text-red-400">{errorMessage}</p>
                  )}

                  <p className="mt-4 text-center font-serif text-[10px] text-white/30">
                    No spam. Just the pieces. Unsubscribe anytime.
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
              className="py-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-nd-red/20">
                <Check className="h-8 w-8 text-nd-red" />
              </div>
              <h3 className="mb-3 font-serif text-3xl italic text-white md:text-4xl">
                You&apos;re on the list.
              </h3>
              <p className="font-serif text-white/60">
                We&apos;ll let you know the moment the shop opens.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
