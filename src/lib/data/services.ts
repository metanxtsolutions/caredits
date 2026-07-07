export type CitySlug =
  | "kolkata"
  | "mumbai"
  | "delhi-ncr"
  | "bangalore"
  | "chennai"
  | "pune"
  | "hyderabad";

/** slot = pick a start time, discuss = "schedule finalized after discussion", contact = "team will contact you" */
export type SchedulingMode = "slot" | "contact" | "discuss";

export type PackageTier = "STANDARD" | "PREMIUM";

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  features: string[];
  deliverables: string[];
  duration: string;
  /** Minutes auto-blocked on the crew calendar from the chosen start time. Null when not slot-based. */
  blockMinutes: number | null;
  /** Per-tier override — only Vehicle Launch Event uses this (half day vs full day). */
  blockMinutesByTier?: Partial<Record<PackageTier, number>>;
  /** Standard-tier price per city. Premium = price + premiumAddOn. */
  pricingByCity: Record<CitySlug, number>;
  /** Null => no package tiers at all (Custom Shoot is single custom-quoted price). */
  premiumAddOn: number | null;
  schedulingMode: SchedulingMode;
  ctaLabel: string;
  featured: boolean;
};

export const services: Service[] = [
  {
    slug: "bike-delivery-shoot",
    name: "Bike Delivery Shoot",
    tagline: "Make Every Bike Look Epic",
    shortDescription: "Dynamic photography and reels for motorcycle deliveries and showroom handovers.",
    description:
      "Two wheels deserve the same cinematic treatment as four. We shoot bike deliveries with a focus on motion, detail, and the emotion of the handover — perfect for dealership feeds and rider communities alike.",
    features: [
      "Low-angle dynamic photography",
      "Slow-motion detail shots",
      "Rider + bike walkaround reel",
      "Showroom or outdoor backdrop",
      "Same-day delivery of edits",
    ],
    deliverables: ["12-15 edited photos", "1 reel (20-45s)", "Story-ready crops"],
    duration: "60-120 min on location",
    blockMinutes: 120,
    pricingByCity: {
      kolkata: 3999,
      mumbai: 9999,
      "delhi-ncr": 7999,
      bangalore: 9999,
      chennai: 9999,
      pune: 9999,
      hyderabad: 9999,
    },
    premiumAddOn: 3000,
    schedulingMode: "slot",
    ctaLabel: "Book Your Bike Shoot",
    featured: true,
  },
  {
    slug: "car-delivery-shoot",
    name: "Car Delivery Shoot",
    tagline: "Make Every Delivery Memorable",
    shortDescription: "Cinematic photo & video coverage the moment your customer takes ownership.",
    description:
      "Your customer's delivery day is the single most shareable moment in their ownership journey. We capture it with cinematic photography and walkaround video so it becomes content worth posting — and a reel your dealership can reuse for months.",
    features: [
      "Cinematic walkaround video",
      "Ribbon & key handover coverage",
      "Interior & detail photography",
      "Customer reaction shots",
      "Same-day edited highlight reel",
      "Vertical + horizontal exports for social",
    ],
    deliverables: ["15-20 edited photos", "1 cinematic reel (30-60s)", "Raw walkaround clip"],
    duration: "60-120 min on location",
    blockMinutes: 120,
    pricingByCity: {
      kolkata: 4999,
      mumbai: 9999,
      "delhi-ncr": 8999,
      bangalore: 9999,
      chennai: 9999,
      pune: 9999,
      hyderabad: 9999,
    },
    premiumAddOn: 3000,
    schedulingMode: "slot",
    ctaLabel: "Book Your Delivery Shoot",
    featured: true,
  },
  {
    slug: "vehicle-launch-event",
    name: "Vehicle Launch Event",
    tagline: "Launch Your Vehicle In Style",
    shortDescription: "Full-scale cinematic coverage for new model launches and reveal events.",
    description:
      "A launch is a brand moment — we treat it like one. Multi-camera coverage, drone establishing shots, and a same-week hero film that captures the reveal, the crowd, and every angle of the vehicle itself.",
    features: [
      "Multi-camera event coverage",
      "Drone establishing shots",
      "Reveal moment cinematography",
      "Guest & press interviews",
      "Hero launch film + short-form cutdowns",
    ],
    deliverables: ["Hero film (2-4 min)", "5-8 social cutdowns", "Full photo gallery"],
    duration: "Half-day to full-day event",
    blockMinutes: 360,
    blockMinutesByTier: { STANDARD: 360, PREMIUM: 600 },
    pricingByCity: {
      kolkata: 14999,
      mumbai: 20999,
      "delhi-ncr": 20999,
      bangalore: 20999,
      chennai: 20999,
      pune: 20999,
      hyderabad: 20999,
    },
    premiumAddOn: 3000,
    schedulingMode: "slot",
    ctaLabel: "Plan Your Launch Shoot",
    featured: false,
  },
  {
    slug: "drone-shoot",
    name: "Drone Shoot",
    tagline: "Every Angle. Especially The Sky.",
    shortDescription: "FPV and aerial drone cinematography for vehicles, events, and locations.",
    description:
      "Aerial footage turns a good shoot into an unforgettable one. Our licensed drone pilots capture sweeping reveals, road-trip landscapes, and top-down showroom shots that ground cameras simply can't.",
    features: [
      "Licensed drone pilots",
      "FPV cinematic passes",
      "Top-down showroom / lot shots",
      "Road & landscape establishing shots",
      "4K stabilised footage",
    ],
    deliverables: ["Edited aerial reel", "Raw 4K aerial clips"],
    duration: "30-90 min flight window",
    blockMinutes: 90,
    pricingByCity: {
      kolkata: 5999,
      mumbai: 6999,
      "delhi-ncr": 6999,
      bangalore: 6999,
      chennai: 6999,
      pune: 6999,
      hyderabad: 6999,
    },
    premiumAddOn: 1000,
    schedulingMode: "slot",
    ctaLabel: "Book a Drone Shoot",
    featured: true,
  },
  {
    slug: "corporate-event",
    name: "Corporate Event",
    tagline: "Every Detail, Documented",
    shortDescription: "Coverage for automotive brand corporate events and conferences.",
    description:
      "From dealer conferences to internal brand events — professional photo and video coverage that captures the program, the people, and the moments worth reusing in internal and external comms.",
    features: [
      "Full-day event coverage",
      "Speaker & session photography",
      "Highlight recap film",
      "Same-week delivery",
    ],
    deliverables: ["Edited photo gallery", "Recap film (2-3 min)"],
    duration: "Half-day to full-day",
    blockMinutes: 300,
    pricingByCity: {
      kolkata: 9999,
      mumbai: 12999,
      "delhi-ncr": 12999,
      bangalore: 12999,
      chennai: 12999,
      pune: 12999,
      hyderabad: 12999,
    },
    premiumAddOn: 1000,
    schedulingMode: "slot",
    ctaLabel: "Book Event Coverage",
    featured: false,
  },
  {
    slug: "social-media-content",
    name: "Social Media Content",
    tagline: "A Full Month, Handled",
    shortDescription: "Monthly content retainers for dealerships, brands, and creators.",
    description:
      "Consistent content is what actually grows a following. Our monthly packages bundle shoot days, editing, and delivery on a schedule — so your feed never goes quiet.",
    features: [
      "Monthly shoot day scheduling",
      "Reels, photos & stories bundle",
      "Content calendar planning",
      "Brand-consistent editing",
    ],
    deliverables: ["12 reels / month", "30+ photos / month"],
    duration: "Monthly retainer",
    blockMinutes: null,
    pricingByCity: {
      kolkata: 19999,
      mumbai: 19999,
      "delhi-ncr": 19999,
      bangalore: 19999,
      chennai: 19999,
      pune: 19999,
      hyderabad: 19999,
    },
    premiumAddOn: 10000,
    schedulingMode: "contact",
    ctaLabel: "Start a Monthly Package",
    featured: false,
  },
  {
    slug: "custom-shoot",
    name: "Custom Shoot",
    tagline: "Tell Us What You're Building",
    shortDescription: "A tailored production for briefs that don't fit a standard package.",
    description:
      "Modification showcases, product launches, influencer collaborations, or anything in between — tell us the brief and we'll scope a crew, timeline, and deliverables to match.",
    features: [
      "Custom crew & equipment scoping",
      "Flexible locations & timing",
      "Tailored deliverable list",
      "Dedicated project lead",
    ],
    deliverables: ["Scoped to your brief"],
    duration: "Scoped to brief",
    blockMinutes: null,
    pricingByCity: {
      kolkata: 499,
      mumbai: 19999,
      "delhi-ncr": 19999,
      bangalore: 19999,
      chennai: 19999,
      pune: 19999,
      hyderabad: 19999,
    },
    premiumAddOn: null,
    schedulingMode: "discuss",
    ctaLabel: "Request a Custom Quote",
    featured: false,
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

/** Sheet prices are already "including 30% discount" — derive the pre-discount price for the strikethrough. */
export function getDiscountPricing(price: number) {
  const originalPrice = Math.round(price / 0.7 / 100) * 100;
  const percentOff = Math.round(((originalPrice - price) / originalPrice) * 100);
  return { originalPrice, percentOff };
}
