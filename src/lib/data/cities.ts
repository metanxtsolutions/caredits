export type City = {
  slug: string;
  name: string;
  state: string;
  local: boolean; // has a dedicated crew + standard local pricing, no travel fee
};

export const cities: City[] = [
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", local: true },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", local: true },
  { slug: "delhi-ncr", name: "Delhi NCR", state: "Delhi", local: true },
  { slug: "bangalore", name: "Bangalore", state: "Karnataka", local: true },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", local: true },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", local: true },
  { slug: "pune", name: "Pune", state: "Maharashtra", local: true },
];

export const DEFAULT_CITY_SLUG = "kolkata";

export function getCityBySlug(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function isKnownCity(name: string) {
  return cities.some((c) => c.name.toLowerCase() === name.toLowerCase());
}
