"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { communeNames } from "@/data/communes";
import type { ListingFilters, ListingType } from "@/data/types";

const TYPES: { value: ListingType | ""; label: string }[] = [
  { value: "", label: "Tous les types" },
  { value: "apartment", label: "Appartements" },
  { value: "house", label: "Maisons" },
  { value: "building", label: "Immeubles" },
  { value: "land", label: "Terrains" },
  { value: "vehicle", label: "Véhicules" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Plus récents" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

interface FilterBarProps {
  /** If true, shows vehicle-specific filters when type=vehicle */
  showVehicleFilters?: boolean;
}

export function FilterBar({ showVehicleFilters = true }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const get = (key: string) => params.get(key) ?? "";

  const update = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
    },
    [params, pathname, router]
  );

  const clearAll = () => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  };

  const hasFilters = params.toString() !== "";
  const currentType = get("type") as ListingType | "";
  const isVehicle = currentType === "vehicle";

  return (
    <div className="flex flex-wrap gap-2 items-center p-3 bg-card border border-border rounded-2xl">
      <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />

      {/* Type */}
      <Select
        id="filter-type"
        value={currentType}
        onChange={(v) => update({ type: v })}
        options={TYPES}
        aria-label="Type de bien"
      />

      {/* Commune */}
      <Select
        id="filter-commune"
        value={get("commune")}
        onChange={(v) => update({ commune: v })}
        options={[
          { value: "", label: "Toutes communes" },
          ...communeNames.map((c) => ({ value: c, label: c })),
        ]}
        aria-label="Commune"
      />

      {/* Price range */}
      <input
        id="filter-min-price"
        type="number"
        placeholder="Prix min ($)"
        value={get("minPrice")}
        onChange={(e) => update({ minPrice: e.target.value })}
        className="h-9 rounded-xl border border-border bg-background px-3 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-cta"
        aria-label="Prix minimum"
        min={0}
        step={1000}
      />
      <input
        id="filter-max-price"
        type="number"
        placeholder="Prix max ($)"
        value={get("maxPrice")}
        onChange={(e) => update({ maxPrice: e.target.value })}
        className="h-9 rounded-xl border border-border bg-background px-3 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-cta"
        aria-label="Prix maximum"
        min={0}
        step={1000}
      />

      {/* Bedrooms (non-vehicle) */}
      {!isVehicle && (
        <Select
          id="filter-bedrooms"
          value={get("bedrooms")}
          onChange={(v) => update({ bedrooms: v })}
          options={[
            { value: "", label: "Chambres" },
            { value: "0", label: "Studio" },
            { value: "1", label: "1+" },
            { value: "2", label: "2+" },
            { value: "3", label: "3+" },
            { value: "4", label: "4+" },
          ]}
          aria-label="Nombre de chambres"
        />
      )}

      {/* Furnished (non-vehicle) */}
      {!isVehicle && (
        <Select
          id="filter-furnished"
          value={get("furnished")}
          onChange={(v) => update({ furnished: v })}
          options={[
            { value: "", label: "Meublé ?" },
            { value: "true", label: "Meublé" },
            { value: "false", label: "Non meublé" },
          ]}
          aria-label="Meublé"
        />
      )}

      {/* Vehicle filters */}
      {showVehicleFilters && isVehicle && (
        <>
          <input
            id="filter-brand"
            type="text"
            placeholder="Marque"
            value={get("brand")}
            onChange={(e) => update({ brand: e.target.value })}
            className="h-9 rounded-xl border border-border bg-background px-3 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-cta"
            aria-label="Marque"
          />
          <Select
            id="filter-fuel"
            value={get("fuel")}
            onChange={(v) => update({ fuel: v })}
            options={[
              { value: "", label: "Carburant" },
              { value: "essence", label: "Essence" },
              { value: "diesel", label: "Diesel" },
              { value: "hybride", label: "Hybride" },
              { value: "electrique", label: "Électrique" },
            ]}
            aria-label="Carburant"
          />
          <Select
            id="filter-gearbox"
            value={get("gearbox")}
            onChange={(v) => update({ gearbox: v })}
            options={[
              { value: "", label: "Boîte" },
              { value: "manuelle", label: "Manuelle" },
              { value: "automatique", label: "Automatique" },
            ]}
            aria-label="Boîte de vitesses"
          />
          <input
            id="filter-year-from"
            type="number"
            placeholder="Année min"
            value={get("yearFrom")}
            onChange={(e) => update({ yearFrom: e.target.value })}
            className="h-9 rounded-xl border border-border bg-background px-3 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-cta"
            aria-label="Année minimum"
            min={2000}
            max={2026}
          />
        </>
      )}

      {/* Sort */}
      <Select
        id="filter-sort"
        value={get("sort") || "recent"}
        onChange={(v) => update({ sort: v })}
        options={SORT_OPTIONS}
        aria-label="Tri"
      />

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 h-9 px-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors"
          aria-label="Réinitialiser les filtres"
        >
          <X className="w-3.5 h-3.5" />
          Réinitialiser
        </button>
      )}
    </div>
  );
}

// ─── Shared Select ────────────────────────────────────────────────────────────

function Select({
  id,
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  "aria-label"?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-9 appearance-none rounded-xl border border-border bg-background pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cta cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
    </div>
  );
}
