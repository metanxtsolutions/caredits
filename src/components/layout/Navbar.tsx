"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        solid ? "bg-ink/95 backdrop-blur-md border-b border-white/10" : "bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Logo variant="light" height={27} />

          <nav className="hidden items-center gap-5 xl:flex">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-label text-xs font-semibold uppercase tracked-tight text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <Button href="/book" size="md" variant="primary" arrow className="px-6 py-3.5 text-xs">
              Book Your Shoot
            </Button>
          </div>

          <button
            aria-label="Toggle menu"
            className="text-white xl:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-ink xl:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-6">
              {siteConfig.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-label py-3 text-sm font-semibold uppercase tracked-tight text-white/80 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <Button href="/book" size="md" variant="primary" arrow className="mt-4 w-full">
                Book Your Shoot
              </Button>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
