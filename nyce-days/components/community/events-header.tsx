"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"
import { createClient } from "@/lib/supabase/client"
import { ChevronDown, X } from "lucide-react"

export function EventsHeader() {
  const sectionRef = useRef<HTMLElement>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [emailConsent, setEmailConsent] = useState(true)
  const [smsConsent, setSmsConsent] = useState(true)
  
  const [firstNameFocused, setFirstNameFocused] = useState(false)
  const [lastNameFocused, setLastNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const isFormFocused = firstNameFocused || lastNameFocused || emailFocused || phoneFocused

  const handleDismiss = () => {
    if (sectionRef.current) {
      const sectionHeight = sectionRef.current.offsetHeight
      window.scrollTo({
        top: sectionHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email && !phone) return

    setStatus("loading")
    try {
      const supabase = createClient()
      
      // Save to subscribers table with full info
      if (email) {
        await supabase.from("subscribers").upsert(
          { 
            email, 
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            source: "community", 
            email_consent: emailConsent,
            sms_consent: smsConsent,
            subscribed_at: new Date().toISOString() 
          },
          { onConflict: "email" }
        )
      }
      
      // Also save to sms_subscribers if phone provided
      if (phone && smsConsent) {
        await supabase.from("sms_subscribers").upsert(
          { 
            phone, 
            first_name: firstName,
            last_name: lastName,
            email: email || null,
            sms_consent: true,
            subscribed_at: new Date().toISOString() 
          },
          { onConflict: "phone" }
        )
      }
      
      setStatus("success")
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      // Scroll down after success
      setTimeout(() => {
        handleDismiss()
        setStatus("idle")
      }, 1500)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <section ref={sectionRef} className="relative min-h-[85vh] flex items-center justify-center py-20">
      <VideoBackground
        desktopSrc={videos.events.header.desktop}
        mobileSrc={videos.events.header.mobile}
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
      
      {/* Focus overlay */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFormFocused ? 0.4 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div 
        className="relative z-10 text-center px-6 w-full max-w-lg"
        animate={{ scale: isFormFocused ? 1.02 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <FadeUp>
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            Join The
          </p>
          <motion.h1 
            className="mt-2 font-serif text-5xl md:text-6xl font-bold text-white uppercase tracking-wide"
            initial={{ textShadow: "0 0 0px rgba(233, 69, 96, 0)" }}
            animate={{ 
              textShadow: isFormFocused 
                ? "0 0 30px rgba(233, 69, 96, 1), 0 0 60px rgba(233, 69, 96, 0.8), 0 0 90px rgba(233, 69, 96, 0.5)"
                : "0 0 0px rgba(233, 69, 96, 0)"
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            Nyce List
          </motion.h1>
          <p className="mt-4 text-base text-white/70">
            Get early access to events, drops, and exclusive content.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="relative">
                <motion.label
                  className="absolute left-0 text-white/50 pointer-events-none origin-left text-sm"
                  initial={false}
                  animate={{
                    y: firstNameFocused || firstName ? -20 : 12,
                    scale: firstNameFocused || firstName ? 0.75 : 1,
                    color: firstNameFocused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  First Name
                </motion.label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFirstNameFocused(true)}
                  onBlur={() => setFirstNameFocused(false)}
                  className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white focus:outline-none transition-colors text-sm"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-nd-red origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: firstNameFocused ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <motion.label
                  className="absolute left-0 text-white/50 pointer-events-none origin-left text-sm"
                  initial={false}
                  animate={{
                    y: lastNameFocused || lastName ? -20 : 12,
                    scale: lastNameFocused || lastName ? 0.75 : 1,
                    color: lastNameFocused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  Last Name
                </motion.label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setLastNameFocused(true)}
                  onBlur={() => setLastNameFocused(false)}
                  className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white focus:outline-none transition-colors text-sm"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-nd-red origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: lastNameFocused ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <motion.label
                className="absolute left-0 text-white/50 pointer-events-none origin-left text-sm"
                initial={false}
                animate={{
                  y: emailFocused || email ? -20 : 12,
                  scale: emailFocused || email ? 0.75 : 1,
                  color: emailFocused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Email *
              </motion.label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white focus:outline-none transition-colors text-sm"
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-nd-red origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: emailFocused ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Phone Input */}
            <div className="relative">
              <motion.label
                className="absolute left-0 text-white/50 pointer-events-none origin-left text-sm"
                initial={false}
                animate={{
                  y: phoneFocused || phone ? -20 : 12,
                  scale: phoneFocused || phone ? 0.75 : 1,
                  color: phoneFocused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Phone (for SMS)
              </motion.label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white focus:outline-none transition-colors text-sm"
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-nd-red origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phoneFocused ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={emailConsent}
                  onChange={(e) => setEmailConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/30 bg-transparent checked:bg-nd-red checked:border-nd-red focus:ring-nd-red focus:ring-offset-0"
                />
                <span className="text-xs text-white/60 text-left group-hover:text-white/80 transition-colors">
                  I agree to receive email updates about events, exclusive drops, and community news. Unsubscribe anytime.
                </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/30 bg-transparent checked:bg-nd-red checked:border-nd-red focus:ring-nd-red focus:ring-offset-0"
                />
                <span className="text-xs text-white/60 text-left group-hover:text-white/80 transition-colors">
                  I agree to receive SMS updates. Msg & data rates may apply. Reply STOP to unsubscribe.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={status === "loading" || !email}
              className="w-full mt-4 py-4 bg-white text-black font-medium uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
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
                  className="block"
                >
                  {status === "loading" ? "Joining..." : status === "success" ? "You're In! ✓" : "Join The List"}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <p className="text-[10px] text-white/40 mt-4">
              By joining, you agree to our Privacy Policy and Terms of Service.
            </p>
          </form>
        </FadeUp>

        {/* Skip to events - centered */}
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
      </motion.div>
    </section>
  )
}
