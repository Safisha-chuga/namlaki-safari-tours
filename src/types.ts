export interface SafariPackage {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  durationDays: number;
  durationNights: number;
  priceUSD: number;
  difficulty: string;
  groupSize: string;
  startingPoint: string;
  endingPoint: string;
  bestMonths: string;
  heroImage: string;
  galleryImages: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  safariStyle: "Luxury Lodge" | "Tented Camp" | "Mid-range" | "Fly-in Safari";
  badge?: string;
  parks: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  location: string;
  description: string;
  highlights: string[];
  meals: string;
  accommodation: string;
  gameDriveTime: string;
  image: string;
}

export interface Inquiry {
  id: string;
  packageId: string;
  packageName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  travelersCount: number;
  travelStyle: string;
  specialRequests: string;
  addons: string[];
  estimatedTotal: number;
  createdAt: string;
  status: "New" | "Contacted" | "Confirmed";
  dispatchedToEmail: string;
}

export interface Founder {
  name: string;
  role: string;
  experienceYears: number;
  bio: string;
  specialty: string;
  quote: string;
  photoUrl: string;
  sightings?: string[];
}

export interface WildlifeSighting {
  id: string;
  species: string;
  location: string;
  image: string;
  fact: string;
  status: string;
}

export interface Review {
  id: string;
  author: string;
  country: string;
  rating: number;
  text: string;
  packageName: string;
  date: string;
}

export interface PricingTier {
  label: string;
  priceUSD: number;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}