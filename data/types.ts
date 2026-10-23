// ─── Enums ────────────────────────────────────────────────────────────────────

export type ListingType = "apartment" | "house" | "building" | "land" | "vehicle";

export type ListingStatus = "available" | "reserved" | "sold";

export type FuelType = "essence" | "diesel" | "hybride" | "electrique";

export type GearboxType = "manuelle" | "automatique";

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface VehicleDetails {
  brand: string;
  model: string;
  year: number;
  mileage_km: number;
  fuel: FuelType;
  gearbox: GearboxType;
  color?: string;
}

export interface PaymentPlan {
  deposit_pct: number;   // e.g. 10 means 10%
  monthly_pct: number;   // e.g. 2 means 2%
  months: number;        // e.g. 45
}

export interface ListingImage {
  url: string;
  alt: string;
  position: number;
}

// ─── Listing ──────────────────────────────────────────────────────────────────

export interface Listing {
  id: string;
  type: ListingType;
  title: string;
  slug: string;
  description: string;
  price_usd: number;
  status: ListingStatus;
  commune: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  furnished?: boolean;
  parking_spaces?: number;
  features: string[];
  payment_plan?: PaymentPlan;
  vehicle_details?: VehicleDetails;
  featured: boolean;
  images: ListingImage[];
  created_at: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface ListingFilters {
  type?: ListingType;
  commune?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  parking?: boolean;
  status?: ListingStatus;
  // vehicle-specific
  brand?: string;
  fuel?: FuelType;
  gearbox?: GearboxType;
  max_mileage?: number;
  year_from?: number;
  year_to?: number;
  // sorting
  sort?: "price_asc" | "price_desc" | "recent";
  // bounding box (map)
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  apartment: "Appartement",
  house: "Maison",
  building: "Immeuble",
  land: "Terrain",
  vehicle: "Véhicule",
};

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

export const FUEL_LABELS: Record<FuelType, string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  electrique: "Électrique",
};

export const GEARBOX_LABELS: Record<GearboxType, string> = {
  manuelle: "Manuelle",
  automatique: "Automatique",
};
