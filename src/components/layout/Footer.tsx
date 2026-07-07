import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-ink-deep text-white">
      <Container className="py-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-6">
          <div className="col-span-2">
            <Logo variant="light" height={26} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: InstagramIcon, href: siteConfig.social.instagram, label: "Instagram" },
                { icon: FacebookIcon, href: siteConfig.social.facebook, label: "Facebook" },
                { icon: YoutubeIcon, href: siteConfig.social.youtube, label: "YouTube" },
                { icon: LinkedinIcon, href: siteConfig.social.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-accent hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Company" links={siteConfig.footerLinks.company} />
          <FooterColumn title="Services" links={siteConfig.footerLinks.services} />
          <FooterColumn title="Legal" links={siteConfig.footerLinks.legal} />

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-label text-xs font-semibold uppercase tracked-tight text-white/40">
              Get In Touch
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                {siteConfig.location} · {siteConfig.serviceArea}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-accent" />
                <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-accent" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <Button href="/book" variant="outline-light" size="md" arrow>
            Book Today · Starts From ₹3,999
          </Button>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-label text-xs font-semibold uppercase tracked-tight text-white/40">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
