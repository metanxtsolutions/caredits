import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Car Edits. WhatsApp, call, or email to discuss your car, bike or dealership shoot.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="CONTACT US"
        description="Have a question before booking? Reach out and our team will respond within 24 hours."
      />

      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[2fr_3fr]">
            <Reveal>
              <div className="space-y-8">
                <ContactItem icon={MapPin} label="Location">
                  {siteConfig.location} · {siteConfig.serviceArea}
                </ContactItem>
                <ContactItem icon={Phone} label="Phone">
                  <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-accent">
                    {siteConfig.phone}
                  </a>
                </ContactItem>
                <ContactItem icon={Mail} label="Email">
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                    {siteConfig.email}
                  </a>
                </ContactItem>
                <ContactItem icon={Clock} label="Response Time">
                  Within 24 hours, every day
                </ContactItem>

                <div className="flex gap-3 pt-4">
                  {[
                    { icon: InstagramIcon, href: siteConfig.social.instagram },
                    { icon: FacebookIcon, href: siteConfig.social.facebook },
                    { icon: YoutubeIcon, href: siteConfig.social.youtube },
                  ].map(({ icon: Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-11 items-center justify-center border border-border text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon className="size-4" />
                    </a>
                  ))}
                </div>

                <div className="aspect-video w-full overflow-hidden">
                  <iframe
                    title="Car Edits location map"
                    src="https://www.google.com/maps?q=Kolkata,West%20Bengal,India&output=embed"
                    className="h-full w-full border-0 grayscale"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-grey-light p-8 md:p-12">
                <h2 className="font-display text-4xl text-ink">SEND US A MESSAGE</h2>
                <p className="mt-2 mb-8 text-sm text-grey">
                  Prefer WhatsApp? Use the floating button in the corner for an instant reply.
                </p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

function ContactItem({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center bg-grey-light text-accent">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-label text-xs font-semibold uppercase tracked text-grey">{label}</p>
        <p className="mt-1 text-base text-ink">{children}</p>
      </div>
    </div>
  );
}
