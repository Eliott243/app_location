import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { SearchExplorer } from "@/components/search-explorer";
import { filtersFromSearchParams } from "@/lib/filters";
import { getAllListings } from "@/lib/listings";
import { getDictionary, defaultLocale } from "@/lib/i18n";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Véhicules",
  description: "Véhicules sélectionnés à Kinshasa — 4×4, berlines, utilitaires.",
};

export default async function VehiculesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const dict = getDictionary(defaultLocale);
  const filters = filtersFromSearchParams(sp);
  const listings = await getAllListings({ ...filters, type: "vehicle" });

  return (
    <div className="pt-24 pb-16">
      <Container>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Véhicules
          </h1>
          <p className="mt-2 text-muted-foreground">
            4×4 et berlines sélectionnés à Kinshasa. Filtrez par marque, carburant, année.
          </p>
        </header>
        <Suspense fallback={<div className="text-muted-foreground">{dict.common.loading}</div>}>
          <SearchExplorer
            listings={listings}
            showVehicleFilters
            emptyLabel="Aucun véhicule trouvé"
          />
        </Suspense>
      </Container>
    </div>
  );
}
