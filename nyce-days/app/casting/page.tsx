import type { Metadata } from 'next'
import Image from 'next/image'
import { CastingForm } from '@/components/casting/casting-form'

export const metadata: Metadata = {
  title: 'Casting · Nyce Days',
  description: "who's trying to work? big things coming. dc + md, all july. apply to be on camera, on the crew, or featured.",
  robots: { index: false, follow: false },
}

export default function CastingPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#0A0A0A] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-10 pt-16 md:pt-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-nd-red/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <Image
            src="/logos/stars-white.png"
            alt="Nyce Days"
            width={140}
            height={48}
            className="mx-auto h-11 w-auto opacity-90"
            priority
          />
          <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.3em] text-nd-red">
            summer 2026 · casting
          </p>
          <h1 className="mt-4 font-serif text-5xl italic leading-[1.05] text-white md:text-6xl">
            who&apos;s trying to work?
          </h1>
          <p className="mx-auto mt-5 max-w-md font-sans text-base leading-relaxed text-white/60">
            big things coming. dc + md, all july. we&apos;re pulling together the people who
            make it move: on camera, behind it, and out front. drop your info and we&apos;ll
            reach out.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="relative z-10 px-6 pb-24">
        <CastingForm />
      </section>
    </main>
  )
}
