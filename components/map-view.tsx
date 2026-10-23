"use client";

import { useEffect, useRef, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/data/types";
import { formatUsd, siteConfig } from "@/config/site";

interface MapViewProps {
  listings: Listing[];
  /** Slug of currently hovered/selected listing */
  highlightedSlug?: string | null;
  onListingSelect?: (slug: string) => void;
  /** Called when user moves the map — with new bounding box */
  onBoundsChange?: (bbox: [number, number, number, number]) => void;
  /** If true, shows "Search in this area" button */
  showSearchArea?: boolean;
  onSearchArea?: (bbox: [number, number, number, number]) => void;
  className?: string;
}

type LeafletNS = typeof import("leaflet");

function statusColor(status: Listing["status"]): string {
  if (status === "available") return "#14375E";
  if (status === "reserved") return "#B45309";
  return "#6B7280";
}

function pillHtml(listing: Listing, price: string): string {
  const color = statusColor(listing.status);
  const title = listing.title.replace(/"/g, "&quot;");
  return `<button type="button" class="leaflet-price-pill" data-slug="${listing.slug}" aria-label="${title}" style="
    display:inline-flex;align-items:center;padding:5px 10px;
    background:${color};color:#fff;font-size:11px;font-weight:700;
    border-radius:20px;cursor:pointer;white-space:nowrap;border:2px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,.28);font-family:'Plus Jakarta Sans','Segoe UI',sans-serif;
    line-height:1.2;transition:transform .15s,background .15s;
  ">${price}</button>`;
}

/**
 * Leaflet map (DOM tiles, no WebGL) — price-pill marker per listing + fitBounds.
 */
export function MapView({
  listings,
  highlightedSlug,
  onListingSelect,
  onBoundsChange,
  showSearchArea = false,
  onSearchArea,
  className = "",
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<LeafletNS | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());
  const listingsRef = useRef(listings);
  const onSelectRef = useRef(onListingSelect);
  const onBoundsRef = useRef(onBoundsChange);

  listingsRef.current = listings;
  onSelectRef.current = onListingSelect;
  onBoundsRef.current = onBoundsChange;

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((entry) => entry.marker.remove());
    markersRef.current.clear();
  }, []);

  const syncMarkers = useCallback(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    clearMarkers();

    for (const listing of listingsRef.current) {
      if (!Number.isFinite(listing.lat) || !Number.isFinite(listing.lng)) continue;

      const price = formatUsd(listing.price_usd);
      const icon = L.divIcon({
        className: "leaflet-price-pill-wrap",
        html: pillHtml(listing, price),
        iconSize: [72, 28],
        iconAnchor: [36, 14],
      });

      const marker = L.marker([listing.lat, listing.lng], {
        icon,
        riseOnHover: true,
      }).addTo(map);

      marker.bindPopup(
        `<a href="/biens/${listing.slug}" style="display:block;text-decoration:none;color:inherit;font-family:'Plus Jakarta Sans',sans-serif;padding:2px;min-width:160px">
          <p style="font-size:13px;font-weight:700;color:#F28C28;margin:0 0 4px">${price}</p>
          <p style="font-size:12px;font-weight:600;color:#14375E;margin:0 0 2px;line-height:1.3">${listing.title}</p>
          <p style="font-size:11px;color:#5a6b80;margin:0">${listing.neighborhood}, ${listing.commune}</p>
          <p style="font-size:11px;font-weight:600;color:#14375E;margin:8px 0 0">Voir la fiche →</p>
        </a>`,
        { offset: [0, -8], maxWidth: 280 }
      );

      marker.on("mouseover", () => {
        const el = marker.getElement()?.querySelector(
          ".leaflet-price-pill"
        ) as HTMLElement | null;
        if (el) {
          el.style.transform = "scale(1.12)";
          el.style.background = "#F28C28";
        }
        onSelectRef.current?.(listing.slug);
      });
      marker.on("mouseout", () => {
        const el = marker.getElement()?.querySelector(
          ".leaflet-price-pill"
        ) as HTMLElement | null;
        if (!el) return;
        const highlighted = el.getAttribute("data-highlighted") === "1";
        el.style.transform = highlighted ? "scale(1.15)" : "scale(1)";
        el.style.background = statusColor(listing.status);
      });
      marker.on("click", () => {
        onSelectRef.current?.(listing.slug);
      });

      markersRef.current.set(listing.slug, { marker, listing });
    }
  }, [clearMarkers]);

  const fitToListings = useCallback(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    const items = listingsRef.current.filter(
      (l) => Number.isFinite(l.lat) && Number.isFinite(l.lng)
    );
    if (!map || !L || items.length === 0) return;

    if (items.length === 1) {
      map.setView([items[0].lat, items[0].lng], 14, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(
      items.map((l) => [l.lat, l.lng] as [number, number])
    );
    map.fitBounds(bounds.pad(0.12), { maxZoom: 13, animate: true });
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    (async () => {
      const leafletMod = await import("leaflet");
      const L = (leafletMod.default ?? leafletMod) as LeafletNS;
      if (cancelled || !containerRef.current) return;

      // Avoid default marker asset 404s under Next/Webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(
        [siteConfig.defaultMapCenter.lat, siteConfig.defaultMapCenter.lng],
        siteConfig.defaultMapCenter.zoom
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      if (cancelled) {
        map.remove();
        return;
      }

      leafletRef.current = L;
      mapRef.current = map;

      map.on("moveend", () => {
        const b = map.getBounds();
        onBoundsRef.current?.([
          b.getWest(),
          b.getSouth(),
          b.getEast(),
          b.getNorth(),
        ]);
      });

      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize({ animate: false });
      });
      resizeObserver.observe(containerRef.current);

      map.invalidateSize();
      syncMarkers();
      fitToListings();
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      clearMarkers();
      mapRef.current?.remove?.();
      mapRef.current = null;
      leafletRef.current = null;
    };
  }, [clearMarkers, fitToListings, syncMarkers]);

  useEffect(() => {
    if (!mapRef.current) return;
    syncMarkers();
    fitToListings();
    mapRef.current.invalidateSize?.();
  }, [listings, syncMarkers, fitToListings]);

  useEffect(() => {
    markersRef.current.forEach(({ marker, listing }, slug) => {
      const el = marker.getElement()?.querySelector(
        ".leaflet-price-pill"
      ) as HTMLElement | null;
      if (!el) return;
      const isHighlighted = slug === highlightedSlug;
      el.setAttribute("data-highlighted", isHighlighted ? "1" : "0");
      el.style.transform = isHighlighted ? "scale(1.15)" : "scale(1)";
      el.style.zIndex = isHighlighted ? "20" : "1";
      el.style.background = isHighlighted
        ? "#F28C28"
        : statusColor(listing.status);
    });
  }, [highlightedSlug]);

  const getCurrentBbox = (): [number, number, number, number] | null => {
    if (!mapRef.current) return null;
    const b = mapRef.current.getBounds();
    return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="h-full w-full min-h-[280px] rounded-2xl overflow-hidden z-0"
      />

      {showSearchArea && onSearchArea && (
        <div className="absolute top-4 left-1/2 z-[1000] -translate-x-1/2">
          <button
            type="button"
            onClick={() => {
              const bbox = getCurrentBbox();
              if (bbox) onSearchArea(bbox);
            }}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-lg hover:bg-secondary"
          >
            Rechercher dans cette zone
          </button>
        </div>
      )}
    </div>
  );
}
