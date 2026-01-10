import { FadeUp } from "@/components/shared/fade-up"

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  {
    value: "100K+",
    label: "Impressions",
  },
  {
    value: "10+",
    label: "Team Members",
  },
  {
    value: "3",
    label: "Markets",
  },
]

export function StatsBar() {
  return (
    <section className="bg-nd-red py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <FadeUp key={stat.label} delay={0.1 * (index + 1)}>
              <div className="text-center">
                <p className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-sans text-lg text-white/80">
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
