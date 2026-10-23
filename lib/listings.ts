import type { ListingFilters, Listing, ListingType } from "@/data/types";
import {
  mockListings,
  getListingBySlug as getMockBySlug,
  getSimilarListings as getMockSimilar,
} from "@/data/seed";

// ─── Supabase client (optional) ───────────────────────────────────────────────
// If NEXT_PUBLIC_SUPABASE_URL is set, queries go to Supabase.
// Otherwise we fall back to the mock seed data.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const useSupabase = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllListings(filters?: ListingFilters): Promise<Listing[]> {
  if (useSupabase) {
    // TODO: replace with Supabase query once credentials are set
    return applyFilters(mockListings, filters);
  }
  return applyFilters(mockListings, filters);
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const all = await getAllListings();
  return all.filter((l) => l.featured).slice(0, limit);
}

export async function getListingsByType(
  type: ListingType,
  filters?: ListingFilters,
  limit?: number
): Promise<Listing[]> {
  const all = await getAllListings({ ...filters, type });
  return limit ? all.slice(0, limit) : all;
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  if (useSupabase) {
    return getMockBySlug(slug) ?? null; // replace with supabase query
  }
  return getMockBySlug(slug) ?? null;
}

export async function getSimilarListings(listing: Listing, limit = 3): Promise<Listing[]> {
  return getMockSimilar(listing, limit);
}

// ─── Filter helpers ───────────────────────────────────────────────────────────

function applyFilters(listings: Listing[], filters?: ListingFilters): Listing[] {
  if (!filters) return listings;

  let result = [...listings];

  if (filters.type) result = result.filter((l) => l.type === filters.type);
  if (filters.commune) result = result.filter((l) => l.commune === filters.commune);
  if (filters.status) result = result.filter((l) => l.status === filters.status);
  if (filters.min_price !== undefined)
    result = result.filter((l) => l.price_usd >= filters.min_price!);
  if (filters.max_price !== undefined)
    result = result.filter((l) => l.price_usd <= filters.max_price!);
  if (filters.bedrooms !== undefined)
    result = result.filter((l) => (l.bedrooms ?? 0) >= filters.bedrooms!);
  if (filters.furnished !== undefined)
    result = result.filter((l) => l.furnished === filters.furnished);
  if (filters.parking)
    result = result.filter((l) => (l.parking_spaces ?? 0) > 0);

  // Vehicle-specific
  if (filters.brand)
    result = result.filter(
      (l) => l.vehicle_details?.brand?.toLowerCase() === filters.brand?.toLowerCase()
    );
  if (filters.fuel)
    result = result.filter((l) => l.vehicle_details?.fuel === filters.fuel);
  if (filters.gearbox)
    result = result.filter((l) => l.vehicle_details?.gearbox === filters.gearbox);
  if (filters.max_mileage !== undefined)
    result = result.filter(
      (l) => (l.vehicle_details?.mileage_km ?? 0) <= filters.max_mileage!
    );
  if (filters.year_from !== undefined)
    result = result.filter((l) => (l.vehicle_details?.year ?? 0) >= filters.year_from!);
  if (filters.year_to !== undefined)
    result = result.filter((l) => (l.vehicle_details?.year ?? 9999) <= filters.year_to!);

  // Bounding box
  if (filters.bbox) {
    const [minLng, minLat, maxLng, maxLat] = filters.bbox;
    result = result.filter(
      (l) =>
        l.lng >= minLng && l.lng <= maxLng && l.lat >= minLat && l.lat <= maxLat
    );
  }

  // Sorting
  if (filters.sort === "price_asc") result.sort((a, b) => a.price_usd - b.price_usd);
  else if (filters.sort === "price_desc") result.sort((a, b) => b.price_usd - a.price_usd);
  else result.sort((a, b) => (a.created_at > b.created_at ? -1 : 1)); // recent first

  return result;
}
