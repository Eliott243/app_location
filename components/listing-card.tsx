import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, MapPin, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/config/site";
import type { Listing } from "@/data/types";
import { LISTING_TYPE_LABELS, LISTING_STATUS_LABELS } from "@/data/types";

interface ListingCardProps {
  listing: Listing;
  /** If true, card is highlighted (e.g. hovered marker on map) */
  highlighted?: boolean;
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  reserved: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  sold: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function ListingCard({ listing, highlighted, className }: ListingCardProps) {
  const image = listing.images[0];
  const isVehicle = listing.type === "vehicle";

  return (
    <Link
      href={`/biens/${listing.slug}`}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden border border-border",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        highlighted && "ring-2 ring-cta shadow-lg -translate-y-0.5",
        className
      )}
      aria-label={listing.title}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Maximize2 className="w-8 h-8 opacity-30" />
          </div>
        )}

        {/* Type badge */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-navy/90 text-white text-xs font-semibold">
          {LISTING_TYPE_LABELS[listing.type]}
        </span>

        {/* Status badge */}
        <span
          className={cn(
            "absolute top-3 right-3 px-2 py-0.5 rounded-lg text-xs font-semibold",
            STATUS_COLORS[listing.status]
          )}
        >
          {LISTING_STATUS_LABELS[listing.status]}
        </span>

        {/* Featured ribbon */}
        {listing.featured && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-cta text-cta-foreground text-xs font-bold uppercase tracking-wide">
            Vedette
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Price */}
        <p className="text-cta font-bold text-xl mb-1">{formatUsd(listing.price_usd)}</p>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-2">
          {listing.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {listing.neighborhood}, {listing.commune}
          </span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {!isVehicle && listing.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} ch.`}
            </span>
          )}
          {!isVehicle && listing.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {listing.bathrooms} sdb
            </span>
          )}
          {!isVehicle && listing.area_m2 !== undefined && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              {listing.area_m2} m²
            </span>
          )}
          {listing.parking_spaces !== undefined && listing.parking_spaces > 0 && (
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              {listing.parking_spaces}P
            </span>
          )}

          {/* Vehicle-specific */}
          {isVehicle && listing.vehicle_details && (
            <>
              <span>{listing.vehicle_details.year}</span>
              <span>{listing.vehicle_details.mileage_km.toLocaleString("fr-FR")} km</span>
              <span className="capitalize">{listing.vehicle_details.fuel}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
