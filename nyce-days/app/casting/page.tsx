import type { Metadata } from 'next'
import Image from 'next/image'
import { CastingForm } from '@/components/casting/casting-form'
import { VideoBackground } from '@/components/shared/video-background'
import { videos } from '@/lib/videos'

export const metadata: Metadata = {
  title: 'Casting · Nyce Days',
  description: "nyce days is casting for a month of shoots across dc + md this july. faces, crew, and people worth featuring. throw your name in.",
  robots: { index: false, follow: false },
}

export default function CastingPage() {
  return (
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-[#0A0A0A] text-white">
      {/* Ambient brand video background */}
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        poster={videos.hero.poster}
        overlay="bg-gradient-to-b from-[rgba(10,10,10,0.82)] via-[rgba(10,10,10,0.88)] to-[rgba(10,10,10,0.96)]"
      />

      {/* Red glow accent over the video */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-nd-red/10 blur-[120px]" />

      {/* Hero */}
      <section className="relative z-10 px-6 pb-10 pt-16 md:pt-24">
        <div className="mx-auto max-w-xl text-center">
          <Image
            src="/logos/stars-white.png"
            alt="Nyce Days"
            width={140}
            height={48}
            className="mx-auto h-11 w-auto opacity-90"
            priority
          />
          <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.3em] text-nd-red">
            nyce days · now casting
          </p>
          <h1 className="mt-4 font-serif text-5xl italic leading-[1.05] text-white md:text-6xl">
            we&apos;re casting the summer.
          </h1>
          <p className="mx-auto mt-5 max-w-md font-sans text-base leading-relaxed text-white/60">
            a full month of shoots across dc + md this july. we&apos;re casting faces, crew,
            and the people worth featuring. if that&apos;s you, throw your name in.
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
