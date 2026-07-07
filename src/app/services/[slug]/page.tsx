import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Star, AlertTriangle, Award } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Tabs } from "@/components/ui/Tabs";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicePriceBlock } from "@/components/services/ServicePriceBlock";
import { HowItWorksMini } from "@/components/services/HowItWorksMini";
import { StickyBookBar } from "@/components/services/StickyBookBar";
import { CitySelector } from "@/components/city/CitySelector";
import { services, getServiceBySlug } from "@/lib/data/services";
import { faqs } from "@/lib/data/faqs";
import { getAggregateRating } from "@/lib/reviews";
import { getWeeklyAvailability } from "@/lib/availability";
import { CtaSection } from "@/components/home/CtaSection";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const fallbackRelated = services.filter((s) => s.slug !== slug).slice(0, 3);

  const [{ average, count }, availability] = await Promise.all([
    getAggregateRating(),
    getWeeklyAvailability(service),
  ]);

  const relevantFaqs = faqs.slice(0, 3);

  return (
    <>
      <PageHero eyebrow={service.duration.toUpperCase()} title={service.tagline.toUpperCase()} />

      <section className="bg-white py-20 pb-28 md:py-28 md:pb-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[3fr_2fr]">
            <div>
              <Reveal>
                <PlaceholderMedia id={service.slug} className="aspect-video w-full" />
              </Reveal>
              <Reveal delay={0.05}>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <PlaceholderMedia
                      key={i}
                      id={`${service.slug}-gallery-${i}`}
                      className="aspect-square w-full"
                    />
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="font-display mt-10 text-4xl text-ink">{service.name}</h2>
                <p className="mt-4 text-base leading-relaxed text-grey">{service.description}</p>
              </Reveal>

              <Reveal delay={0.2} className="mt-10">
                <Tabs
                  tabs={[
                    {
                      label: "What's Included",
                      content: (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {service.features.map((f) => (
                            <div key={f} className="flex items-start gap-3">
                              <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                              <span className="text-sm text-ink/80">{f}</span>
                            </div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      label: "FAQs",
                      content: (
                        <div className="space-y-5">
                          {relevantFaqs.map((f) => (
                            <div key={f.question}>
                              <p className="font-label text-sm font-bold text-ink">{f.question}</p>
                              <p className="mt-1 text-sm text-grey">{f.answer}</p>
                            </div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      label: "Delivery & Turnaround",
                      content: (
                        <div className="space-y-3 text-sm text-ink/80">
                          <p>
                            <span className="font-semibold text-ink">Deliverables: </span>
                            {service.deliverables.join(", ")}
                          </p>
                          <p>
                            <span className="font-semibold text-ink">Shoot duration: </span>
                            {service.duration}
                          </p>
                          <p>
                            Standard delivery is within 48 hours. Add Express Same-Day Delivery
                            at checkout, or choose the Luxury package which includes it — see the{" "}
                            <a href="/pricing" className="text-accent underline">
                              Pricing page
                            </a>
                            .
                          </p>
                        </div>
                      ),
                    },
                    {
                      label: "Good To Know",
                      content: (
                        <ul className="list-disc space-y-2 pl-5 text-sm text-ink/80 marker:text-accent">
                          <li>Have the vehicle cleaned before our crew arrives for best results.</li>
                          <li>Outdoor and home shoots depend on daylight — we&apos;ll confirm timing in advance.</li>
                          <li>Reschedule free of charge up to 24 hours before your shoot.</li>
                        </ul>
                      ),
                    },
                  ]}
                />
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="sticky top-28 space-y-5">
                <div className="bg-grey-light p-8">
                  <span className="font-label inline-flex items-center gap-1.5 bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracked-tight text-white">
                    <Award className="size-3.5" /> #1 Automotive Content Brand
                  </span>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={i < Math.round(average) ? "size-4 text-accent" : "size-4 text-border"}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-ink">{average}</span>
                    <a href="/reviews" className="text-sm text-grey underline">
                      {count} Reviews
                    </a>
                  </div>

                  {availability.isLow && (
                    <div className="mt-4 flex items-center gap-2 border border-accent bg-white px-3 py-2 text-xs font-semibold text-accent">
                      <AlertTriangle className="size-4 shrink-0" />
                      Only {availability.remaining} slots left this week
                    </div>
                  )}

                  <div className="mt-5">
                    <ServicePriceBlock service={service} />
                  </div>

                  <div className="mt-5 border-t border-border pt-5">
                    <CitySelector />
                  </div>

                  <div className="mt-5 border-t border-border pt-5">
                    <HowItWorksMini />
                  </div>

                  <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-grey">Duration</dt>
                      <dd className="font-semibold text-ink">{service.duration}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-grey">Deliverables</dt>
                      <dd className="text-right font-semibold text-ink">
                        {service.deliverables.join(", ")}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 hidden gap-3 sm:flex">
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-label flex flex-1 items-center justify-center gap-2 bg-[#25D366] px-4 py-4 text-sm font-semibold text-white"
                    >
                      WhatsApp
                    </a>
                    <Button href={`/book?service=${service.slug}`} variant="primary" arrow className="flex-1">
                      {service.ctaLabel}
                    </Button>
                  </div>
                  <Button href={`/book?service=${service.slug}`} variant="primary" arrow className="mt-6 w-full sm:hidden">
                    {service.ctaLabel}
                  </Button>
                  <p className="mt-3 text-center text-xs text-grey">
                    Setup guaranteed · Same-day booking available · 5-min booking
                  </p>
                  <Button href="/pricing" variant="ghost" className="mt-2 w-full">
                    Compare All Packages
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-grey-light py-20 md:py-28">
        <Container>
          <h2 className="font-display text-4xl text-ink md:text-5xl">YOU MIGHT ALSO LIKE</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackRelated.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />

      <StickyBookBar service={service} ctaLabel={service.ctaLabel} />
    </>
  );
}
