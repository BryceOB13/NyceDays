"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Smartphone } from "lucide-react"
import { isValidEmail } from "@/lib/schemas"
import { FadeUp } from "@/components/shared/fade-up"

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function NyceListSection() {
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [smsConsent, setSmsConsent] = useState(true)
  const [emailConsent, setEmailConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

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
    <section
      id="nyce-list"
      className="relative bg-[#0A0A0A] py-16 md:py-24 overflow-hidden"
    >
      {/* Subtle red glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nd-red/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-md px-6">
        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <FadeUp>
                <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-nd-red">
                  You&apos;re Invited
                </p>
                <h2 className="mt-3 font-serif text-4xl md:text-5xl text-white italic whitespace-nowrap">
                  The Nyce List
                </h2>
                <p className="mt-4 font-serif text-base text-white/60 leading-relaxed max-w-sm mx-auto">
                  This is how you hear first. Event announcements before they&apos;re public. Drops
                  before they sell out. The things we only tell our people.
                </p>
              </FadeUp>

              <FadeUp delay={0.15}>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
                  {/* Phone - PRIMARY INPUT */}
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

                  {/* First Name + Email */}
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

                  {/* Consent */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsConsent}
                        onChange={(e) => setSmsConsent(e.target.checked)}
                        required
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-nd-red focus:ring-nd-red focus:ring-offset-0 accent-nd-red"
                      />
                      <span className="text-white/60 text-sm font-serif">
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
                      <span className="text-white/60 text-sm font-serif">
                        Email me too
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={status === "loading" || !smsConsent || !phone}
                    className="w-full mt-2 py-4 bg-nd-red text-white font-medium uppercase tracking-wider text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#B83D3D] transition-colors"
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
                    Msg &amp; data rates may apply. Reply STOP to unsubscribe.
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
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-nd-red/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-nd-red" />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-3">
                You&apos;re on the list.
              </h3>
              <p className="font-serif text-white/60">
                We&apos;ll text you when something&apos;s worth your time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
