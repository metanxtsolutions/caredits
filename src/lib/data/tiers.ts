import type { PackageTier } from "@/lib/data/services";

export type TierInfo = {
  tier: PackageTier;
  label: string;
  blurb: string;
  features: string[];
  highlighted: boolean;
};

export const tiers: TierInfo[] = [
  {
    tier: "STANDARD",
    label: "Standard",
    blurb: "Core coverage, professionally shot and edited.",
    features: [
      "Full service coverage as described",
      "Professionally edited photos & reel",
      "Standard 48-hour turnaround",
      "Email support",
    ],
    highlighted: false,
  },
  {
    tier: "PREMIUM",
    label: "Premium",
    blurb: "The full cinematic package — drone coverage included.",
    features: [
      "Everything in Standard",
      "Drone aerial coverage included",
      "Raw footage handover included",
      "24-hour express turnaround",
      "Priority WhatsApp support",
      "Dedicated senior crew",
    ],
    highlighted: true,
  },
];

export function getTierInfo(tier: PackageTier) {
  return tiers.find((t) => t.tier === tier)!;
}
