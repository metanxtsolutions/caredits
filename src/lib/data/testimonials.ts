export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  vehicle?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Rohan Mehta",
    role: "Dealer Principal, Premium Motors",
    quote:
      "Our delivery reels started pulling real showroom walk-ins within a week. The quality speaks for itself.",
    rating: 5,
    vehicle: "Social Media Content",
  },
  {
    name: "Aritra Sen",
    role: "Car Owner",
    quote:
      "I've never had my delivery day look this cinematic. The team was in and out in under an hour and the reel was ready by evening.",
    rating: 5,
    vehicle: "Car Delivery Shoot",
  },
  {
    name: "Priya Kapoor",
    role: "Content Creator",
    quote:
      "Booked them for a bike shoot on a whim, ended up being some of the best content on my page this year.",
    rating: 5,
    vehicle: "Bike Delivery Shoot",
  },
  {
    name: "Vikram Malhotra",
    role: "Marketing Head, Horizon Auto Group",
    quote:
      "We moved our entire showroom content calendar to Car Edits. Consistent quality, fast turnaround, zero chasing.",
    rating: 5,
    vehicle: "Monthly Social Media Content",
  },
  {
    name: "Sourav Banerjee",
    role: "Car Club Organiser",
    quote:
      "The drone footage from our road trip meet made the entire event look like a feature film. Members are still sharing it.",
    rating: 5,
    vehicle: "Custom Shoot",
  },
];

export const brandsWorkedWith = [
  "Premium Motors",
  "Horizon Auto Group",
  "Eastern Wheels",
  "Metro Dealership Network",
  "Velocity Bikes",
  "Kolkata Car Club",
  "MG",
  "BYD",
  "Jaguar Land Rover",
  "Audi",
  "BMW",
  "MINI",
  "Mercedes-Benz",
  "Porsche",
  "Volvo",
];
