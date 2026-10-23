const fallbackName = "Agence";
const fallbackWhatsapp = "243000000000";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_AGENCY_NAME?.trim() || fallbackName,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP?.trim() || fallbackWhatsapp,
  locale: "fr" as const,
  currency: "USD" as const,
  defaultMapCenter: {
    lat: -4.325,
    lng: 15.3222,
    zoom: 11,
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Format USD as "114 900 $". */
export function formatUsd(amount: number): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} $`;
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
