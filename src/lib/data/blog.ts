export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-delivery-day-content-matters",
    title: "Why Your Delivery Day Is the Most Valuable Content You're Not Capturing",
    excerpt:
      "Dealerships spend lakhs on ad creative but skip the one moment customers actually want to share: the handover.",
    category: "Behind The Scenes",
    date: "2026-05-12",
    readTime: "4 min read",
    content: [
      "The delivery moment is the highest-emotion touchpoint in the entire ownership journey, and it's almost always undocumented beyond a shaky phone video.",
      "A cinematic delivery reel does two things at once: it gives your customer a shareable memory, and it gives your dealership authentic, repeatable content that outperforms studio ads on engagement.",
      "We've shot over a thousand deliveries across Kolkata and PAN India, and the pattern holds. Reels featuring real customer reactions consistently pull more saves and shares than product-only cuts.",
    ],
  },
  {
    slug: "drone-shoot-checklist",
    title: "5 Things To Check Before Booking a Drone Shoot",
    excerpt:
      "Aerial footage can make or break a launch film. Here's what to confirm before your shoot day.",
    category: "Photography Tips",
    date: "2026-04-28",
    readTime: "5 min read",
    content: [
      "Location permissions, no-fly zones, and time-of-day lighting all affect what's possible on shoot day. Confirm these before you lock a date.",
      "Golden hour (the hour after sunrise or before sunset) is non-negotiable for cinematic aerial reveals. Flat midday light rarely cuts it.",
      "Always ask for a backup ground-camera plan in case weather grounds the drone on the day.",
    ],
  },
  {
    slug: "vehicle-launch-coverage-guide",
    title: "What Full Launch Event Coverage Actually Includes",
    excerpt:
      "A breakdown of what a professional production crew captures at a vehicle reveal, and why it's more than just photos.",
    category: "Vehicle Launch Coverage",
    date: "2026-03-15",
    readTime: "6 min read",
    content: [
      "A launch film isn't just B-roll of the car. It's the story of the reveal: anticipation, unveiling, reaction, and detail.",
      "Multi-camera coverage means you're never left with a single angle of the one moment that mattered.",
      "The best launch films are delivered within days, not weeks, while the moment is still shareable.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
