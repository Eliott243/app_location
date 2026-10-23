"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Listing } from "@/data/types";
import { FilterBar } from "@/components/filter-bar";
import { ListingCard } from "@/components/listing-card";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const MapView = dynamic(() => import("@/components/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] lg:h-[min(70vh,640px)] w-full rounded-2xl border border-border bg-muted animate-pulse" />
  ),
});

interface SearchExplorerProps {
  listings: Listing[];
  showVehicleFilters?: boolean;
  /** Hide vehicle type in default immobilier search messaging */
  emptyLabel?: string;
}

export function SearchExplorer({
  listings,
  showVehicleFilters = true,
  emptyLabel = "Aucun bien trouvé",
}: SearchExplorerProps) {
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const onSearchArea = (bbox: [number, number, number, number]) => {
    const next = new URLSearchParams(params.toString());
    next.set("bbox", bbox.join(","));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4">
      <FilterBar showVehicleFilters={showVehicleFilters} />

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(320px,42%)] lg:items-start">
        <div className="order-2 lg:order-1">
          <p className="mb-3 text-sm text-muted-foreground">
            {listings.length} résultat{listings.length !== 1 ? "s" : ""}
          </p>
          {listings.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
              {emptyLabel}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  onMouseEnter={() => setHighlightedSlug(listing.slug)}
                  onMouseLeave={() => setHighlightedSlug(null)}
                >
                  <ListingCard
                    listing={listing}
                    highlighted={highlightedSlug === listing.slug}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2 lg:sticky lg:top-20">
          <MapView
            listings={listings}
            highlightedSlug={highlightedSlug}
            onListingSelect={setHighlightedSlug}
            showSearchArea
            onSearchArea={onSearchArea}
            className="h-[360px] lg:h-[min(70vh,640px)] w-full rounded-2xl overflow-hidden border border-border"
          />
        </div>
      </div>
    </div>
  );
}
