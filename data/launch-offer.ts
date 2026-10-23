export interface ApartmentUnit {
  id: string;
  bedrooms: number;
  label: string;
  price_usd: number;
  /** Deposit percentage (e.g. 10 → 10 %) */
  deposit_pct: number;
  /** Monthly instalment as % of price */
  monthly_pct: number;
  /** Number of monthly instalments */
  months: number;
  parking_spaces: number;
  slug: string; // links to the listing fiche
}

/** Computed helpers */
export function depositAmount(unit: ApartmentUnit): number {
  return Math.round(unit.price_usd * (unit.deposit_pct / 100));
}

export function monthlyAmount(unit: ApartmentUnit): number {
  return Math.round(unit.price_usd * (unit.monthly_pct / 100));
}

/** Main offer table data */
export const launchOfferUnits: ApartmentUnit[] = [
  {
    id: "lancement-1ch",
    bedrooms: 1,
    label: "1 chambre",
    price_usd: 114_900,
    deposit_pct: 10,
    monthly_pct: 2,
    months: 45,
    parking_spaces: 0,
    slug: "appartement-meuble-1ch-gombe",
  },
  {
    id: "lancement-2ch",
    bedrooms: 2,
    label: "2 chambres",
    price_usd: 239_000,
    deposit_pct: 10,
    monthly_pct: 2,
    months: 45,
    parking_spaces: 1,
    slug: "appartement-meuble-2ch-gombe",
  },
  {
    id: "lancement-3ch",
    bedrooms: 3,
    label: "3 chambres",
    price_usd: 299_000,
    deposit_pct: 10,
    monthly_pct: 2,
    months: 45,
    parking_spaces: 1,
    slug: "appartement-meuble-3ch-gombe",
  },
];

/** Benefits included with every apartment */
export const launchOfferInclusions: string[] = [
  "Accès à vie au clubhouse",
  "2 ans de charges de syndic et de maintenance offerts",
  "Appartement entièrement meublé (offre de lancement)",
];

/** Offer headline */
export const offerHeadline =
  "Appartements entièrement meublés — 10 % d'acompte + 45 mensualités";
