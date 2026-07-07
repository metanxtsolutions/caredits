export type PortfolioCategory =
  | "Cars"
  | "Bikes"
  | "Luxury Cars"
  | "Dealerships"
  | "Commercial Ads"
  | "Drone Videos"
  | "Cinematic Reels"
  | "Event Shoots";

export type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  type: "photo" | "video";
  aspect: "portrait" | "landscape" | "square";
};

export const portfolioCategories: PortfolioCategory[] = [
  "Cars",
  "Bikes",
  "Luxury Cars",
  "Dealerships",
  "Commercial Ads",
  "Drone Videos",
  "Cinematic Reels",
  "Event Shoots",
];

export const portfolioItems: PortfolioItem[] = [
  { id: "p1", title: "Midnight Sedan Delivery", category: "Cars", type: "photo", aspect: "portrait" },
  { id: "p2", title: "Coastal Road Handover", category: "Cars", type: "video", aspect: "landscape" },
  { id: "p3", title: "Cafe Racer Golden Hour", category: "Bikes", type: "photo", aspect: "portrait" },
  { id: "p4", title: "Adventure Tourer Walkaround", category: "Bikes", type: "video", aspect: "landscape" },
  { id: "p5", title: "Rolls Royce Studio Series", category: "Luxury Cars", type: "photo", aspect: "square" },
  { id: "p6", title: "Supercar Reveal Night", category: "Luxury Cars", type: "video", aspect: "landscape" },
  { id: "p7", title: "Premium Motors Showroom Day", category: "Dealerships", type: "photo", aspect: "landscape" },
  { id: "p8", title: "Horizon Auto Monthly Content", category: "Dealerships", type: "video", aspect: "portrait" },
  { id: "p9", title: "Velocity Bikes Campaign", category: "Commercial Ads", type: "video", aspect: "landscape" },
  { id: "p10", title: "Metro Network Brand Film", category: "Commercial Ads", type: "video", aspect: "landscape" },
  { id: "p11", title: "Top-Down Lot Survey", category: "Drone Videos", type: "video", aspect: "landscape" },
  { id: "p12", title: "Coastal Highway FPV Pass", category: "Drone Videos", type: "video", aspect: "landscape" },
  { id: "p13", title: "Delivery Day Reel: SUV", category: "Cinematic Reels", type: "video", aspect: "portrait" },
  { id: "p14", title: "First Ride Reel: Cruiser", category: "Cinematic Reels", type: "video", aspect: "portrait" },
  { id: "p15", title: "Kolkata Car Club Meet", category: "Event Shoots", type: "photo", aspect: "landscape" },
  { id: "p16", title: "Vehicle Launch: Reveal Night", category: "Event Shoots", type: "video", aspect: "landscape" },
  { id: "p17", title: "Hatchback First Drive", category: "Cars", type: "photo", aspect: "square" },
  { id: "p18", title: "Street Bike Detail Study", category: "Bikes", type: "photo", aspect: "square" },
  { id: "p19", title: "Convertible Sunset Session", category: "Luxury Cars", type: "photo", aspect: "landscape" },
  { id: "p20", title: "Eastern Wheels Inventory Day", category: "Dealerships", type: "photo", aspect: "square" },
  { id: "p21", title: "Product Launch Teaser", category: "Commercial Ads", type: "video", aspect: "portrait" },
  { id: "p22", title: "Aerial Convoy: Road Trip", category: "Drone Videos", type: "video", aspect: "landscape" },
  { id: "p23", title: "Test Drive Day Recap", category: "Event Shoots", type: "video", aspect: "landscape" },
  { id: "p24", title: "Modification Showcase Reel", category: "Cinematic Reels", type: "video", aspect: "portrait" },
];
