import { FadeUp } from "@/components/shared/fade-up"

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  {
    value: "25+",
    label: "DJs",
  },
  {
    value: "10+",
    label: "Collaborators",
  },
  {
    value: "9",
    label: "Markets",
  },
]

export function StatsBar() {
  return (
    <section className="bg-nd-red py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <FadeUp key={stat.label} delay={0.1 * (index + 1)}>
              <div className="text-center">
                <p className="font-serif text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-sans text-sm uppercase tracking-widest text-white/80">
                  {stat.label}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
