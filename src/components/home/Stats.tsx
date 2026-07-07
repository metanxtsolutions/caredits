import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { stats } from "@/lib/data/stats";

export function Stats() {
  return (
    <section className="bg-accent py-20">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={0.06 * i} className="text-center md:text-left">
              <p className="font-display text-6xl text-white md:text-7xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-label mt-2 text-xs font-semibold uppercase tracked text-white/75">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
