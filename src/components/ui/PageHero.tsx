import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-ink-deep pt-40 pb-20 md:pt-48 md:pb-28", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(90% 100% at 50% 0%, #1c1c1c 0%, #111111 55%, #0a0a0a 100%)",
        }}
      />
      <Container className="relative z-10">
        <Reveal>
          <span className="font-label text-xs font-semibold tracked text-accent">{eyebrow}</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display mt-4 max-w-4xl text-6xl leading-[0.88] text-white sm:text-7xl md:text-8xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
