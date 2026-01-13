"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"
import { createClient } from "@/lib/supabase/client"
import { ChevronDown, X, ArrowRight, Check } from "lucide-react"

export function EventsHeader() {
  const sectionRef = useRef<HTMLElement>(null)
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  
  const [firstNameFocused, setFirstNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const isFormFocused = firstNameFocused || emailFocused

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
    if (!email) return

    setStatus("loading")
    try {
      const supabase = createClient()
      
      await supabase.from("subscribers").upsert(
        { 
          email, 
          first_name: firstName,
          source: "community", 
          email_consent: true,
          subscribed_at: new Date().toISOString() 
        },
        { onConflict: "email" }
      )
      
      setStatus("success")
      setFirstName("")
      setEmail("")
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
                <motion.h1 
                  className="mt-3 font-serif text-5xl md:text-6xl text-white italic"
                  initial={{ textShadow: "0 0 0px rgba(233, 69, 96, 0)" }}
                  animate={{ 
                    textShadow: isFormFocused 
                      ? "0 0 30px rgba(233, 69, 96, 1), 0 0 60px rgba(233, 69, 96, 0.8), 0 0 90px rgba(233, 69, 96, 0.5)"
                      : "0 0 0px rgba(233, 69, 96, 0)"
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  The Nyce List
                </motion.h1>
                <p className="mt-4 font-serif text-base text-white/60 leading-relaxed max-w-sm mx-auto">
                  This is how you hear first. Event announcements before they&apos;re public. 
                  Drops before they sell out. The things we only tell our people.
                </p>
              </FadeUp>

              <FadeUp delay={0.2}>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="relative">
                      <motion.label
                        className="absolute left-0 text-white/50 pointer-events-none origin-left text-sm font-serif"
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
                        className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white focus:outline-none transition-colors text-sm font-serif"
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-nd-red origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: firstNameFocused ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <motion.label
                        className="absolute left-0 text-white/50 pointer-events-none origin-left text-sm font-serif"
                        initial={false}
                        animate={{
                          y: emailFocused || email ? -20 : 12,
                          scale: emailFocused || email ? 0.75 : 1,
                          color: emailFocused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        Email
                      </motion.label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        required
                        className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white focus:outline-none transition-colors text-sm font-serif"
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-nd-red origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: emailFocused ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={status === "loading" || !email}
                    className="w-full mt-6 py-4 bg-nd-red text-white font-medium uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative flex items-center justify-center gap-2 hover:bg-[#B83D3D] transition-colors"
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

                  <p className="text-xs text-white/30 mt-4 font-serif">
                    We don&apos;t spam. We barely email.
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
                We&apos;ll be in touch when something&apos;s worth your time.
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
