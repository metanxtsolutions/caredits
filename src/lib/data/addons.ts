export type AddOn = {
  key: string;
  label: string;
  price: number;
};

export const addOns: AddOn[] = [
  { key: "drone-coverage", label: "Drone Aerial Coverage", price: 1999 },
  { key: "express-delivery", label: "Express Same-Day Delivery", price: 999 },
  { key: "additional-vehicle", label: "Additional Vehicle", price: 1500 },
  { key: "extra-reel", label: "Extra Edited Reel", price: 999 },
  { key: "raw-footage", label: "Raw Footage Handover", price: 1499 },
];

export function getAddOnByKey(key: string) {
  return addOns.find((a) => a.key === key);
}
