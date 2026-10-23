import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { SearchExplorer } from "@/components/search-explorer";
import { filtersFromSearchParams } from "@/lib/filters";
import { getAllListings } from "@/lib/listings";
import { getDictionary, defaultLocale } from "@/lib/i18n";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Recherche",
  description: "Recherchez des biens immobiliers à Kinshasa sur la carte.",
};

export default async function RecherchePage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const dict = getDictionary(defaultLocale);
  const filters = filtersFromSearchParams(sp);

  // Immobilier: exclude vehicles unless explicitly filtered to vehicle
  if (!filters.type) {
    const all = await getAllListings(filters);
    const immobilier = all.filter((l) => l.type !== "vehicle");
    return (
      <div className="pt-24 pb-16">
        <Container>
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Immobilier à Kinshasa
            </h1>
            <p className="mt-2 text-muted-foreground">
              Carte interactive, filtres et contact WhatsApp direct.
            </p>
          </header>
          <Suspense fallback={<div className="text-muted-foreground">{dict.common.loading}</div>}>
            <SearchExplorer listings={immobilier} showVehicleFilters={false} />
          </Suspense>
        </Container>
      </div>
    );
  }

  const listings = await getAllListings(filters);

  return (
    <div className="pt-24 pb-16">
      <Container>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Recherche
          </h1>
          <p className="mt-2 text-muted-foreground">
            Affinez avec les filtres ou explorez la carte.
          </p>
        </header>
        <Suspense fallback={<div className="text-muted-foreground">{dict.common.loading}</div>}>
          <SearchExplorer listings={listings} />
        </Suspense>
      </Container>
    </div>
  );
}
