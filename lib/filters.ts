import type {
  FuelType,
  GearboxType,
  ListingFilters,
  ListingType,
} from "@/data/types";

const LISTING_TYPES: ListingType[] = [
  "apartment",
  "house",
  "building",
  "land",
  "vehicle",
];

function num(v: string | undefined | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Parse URL search params (FilterBar keys) into ListingFilters. */
export function filtersFromSearchParams(
  sp: URLSearchParams | Record<string, string | string[] | undefined>
): ListingFilters {
  const get = (key: string): string | undefined => {
    if (sp instanceof URLSearchParams) {
      return sp.get(key) ?? undefined;
    }
    const raw = sp[key];
    if (Array.isArray(raw)) return raw[0];
    return raw;
  };

  const typeRaw = get("type");
  const type =
    typeRaw && LISTING_TYPES.includes(typeRaw as ListingType)
      ? (typeRaw as ListingType)
      : undefined;

  const furnishedRaw = get("furnished");
  const furnished =
    furnishedRaw === "true" ? true : furnishedRaw === "false" ? false : undefined;

  const sortRaw = get("sort");
  const sort =
    sortRaw === "price_asc" || sortRaw === "price_desc" || sortRaw === "recent"
      ? sortRaw
      : "recent";

  const bboxRaw = get("bbox");
  let bbox: ListingFilters["bbox"];
  if (bboxRaw) {
    const parts = bboxRaw.split(",").map(Number);
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      bbox = parts as [number, number, number, number];
    }
  }

  return {
    type,
    commune: get("commune") || undefined,
    min_price: num(get("minPrice")),
    max_price: num(get("maxPrice")),
    bedrooms: num(get("bedrooms")),
    furnished,
    brand: get("brand") || undefined,
    fuel: (get("fuel") as FuelType | undefined) || undefined,
    gearbox: (get("gearbox") as GearboxType | undefined) || undefined,
    year_from: num(get("yearFrom")),
    year_to: num(get("yearTo")),
    sort,
    bbox,
  };
}
