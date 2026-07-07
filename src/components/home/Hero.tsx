"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

const ticker = [
  "CAR DELIVERY SHOOTS",
  "BIKE DELIVERY SHOOTS",
  "VEHICLE LAUNCH EVENTS",
  "DRONE CINEMATOGRAPHY",
  "CORPORATE EVENTS",
  "SOCIAL MEDIA CONTENT",
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-deep">
      {/* Cinematic backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 50% 30%, #1c1c1c 0%, #111111 55%, #0a0a0a 100%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="streak" x1="0" x2="1">
            <stop offset="0%" stopColor="#E10600" stopOpacity="0" />
            <stop offset="50%" stopColor="#E10600" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E10600" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[220, 340, 460].map((y, i) => (
          <motion.line
            key={y}
            x1="-200"
            y1={y}
            x2="1640"
            y2={y - 60}
            stroke="url(#streak)"
            strokeWidth={i === 1 ? 2 : 1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

      <Container className="relative z-10 flex flex-1 flex-col justify-center pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex w-fit items-center gap-2 border-2 border-accent px-4 py-2"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="font-label text-xs font-bold uppercase tracked-tight text-white">
            Starts From ₹{siteConfig.startingPrice.toLocaleString("en-IN")} Only
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[16vw] leading-[0.82] text-white sm:text-[13vw] md:text-[10vw] lg:text-[8.5vw]"
        >
          CAPTURE EVERY
          <br />
          <span className="text-accent">DRIVE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
        >
          Premium automotive photography &amp; cinematic video production. Book professional
          car, bike &amp; dealership shoots across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button href="/book" size="lg" variant="primary" arrow>
            Book Your Shoot
          </Button>
          <Button href="/portfolio" size="lg" variant="outline-light">
            View Portfolio
          </Button>
        </motion.div>
      </Container>

      {/* Ticker */}
      <div className="relative z-10 overflow-hidden border-t border-white/10 py-5">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...ticker, ...ticker].map((t, i) => (
            <span
              key={i}
              className="font-label flex items-center gap-10 text-sm font-semibold uppercase tracked text-white/35"
            >
              {t}
              <span className="text-accent">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
