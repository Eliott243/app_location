import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  Bed,
  Car,
  MapPin,
  Maximize2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ListingCard } from "@/components/listing-card";
import { ListingGallery } from "@/components/listing-gallery";
import { PaymentCalculator } from "@/components/payment-calculator";
import { formatUsd, whatsappUrl } from "@/config/site";
import {
  FUEL_LABELS,
  GEARBOX_LABELS,
  LISTING_STATUS_LABELS,
  LISTING_TYPE_LABELS,
} from "@/data/types";
import { launchOfferUnits } from "@/data/launch-offer";
import { getListingBySlug, getSimilarListings } from "@/lib/listings";
import { getDictionary, defaultLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Bien introuvable" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
  };
}

export default async function BienPage({ params }: PageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const dict = getDictionary(defaultLocale);
  const similar = await getSimilarListings(listing, 3);
  const isVehicle = listing.type === "vehicle";
  const offerUnit = launchOfferUnits.find((u) => u.slug === listing.slug);

  const visitMsg = `Bonjour, je souhaite une visite pour : ${listing.title} (${formatUsd(listing.price_usd)}) — ${listing.commune}.`;

  return (
    <div className="pt-24 pb-16">
      <Container>
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={isVehicle ? "/vehicules" : "/recherche"}
            className="hover:text-foreground"
          >
            {isVehicle ? "Véhicules" : "Immobilier"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground line-clamp-1">{listing.title}</span>
        </nav>

        <ListingGallery images={listing.images} title={listing.title} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-lg bg-navy px-2 py-0.5 text-xs font-semibold text-white">
                {LISTING_TYPE_LABELS[listing.type]}
              </span>
              <span className="rounded-lg bg-secondary px-2 py-0.5 text-xs font-semibold text-foreground">
                {LISTING_STATUS_LABELS[listing.status]}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {listing.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {listing.address || `${listing.neighborhood}, ${listing.commune}`}
            </p>

            <p className="mt-4 text-3xl font-bold text-cta">
              {formatUsd(listing.price_usd)}
            </p>

            {!isVehicle && (
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {listing.bedrooms !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-4 w-4" />
                    {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} ch.`}
                  </span>
                )}
                {listing.bathrooms !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4" />
                    {listing.bathrooms} sdb
                  </span>
                )}
                {listing.area_m2 !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="h-4 w-4" />
                    {listing.area_m2} m²
                  </span>
                )}
                {(listing.parking_spaces ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Car className="h-4 w-4" />
                    {listing.parking_spaces} parking
                  </span>
                )}
              </div>
            )}

            {isVehicle && listing.vehicle_details && (
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
                <Spec label={dict.vehicle.brand} value={listing.vehicle_details.brand} />
                <Spec label={dict.vehicle.model} value={listing.vehicle_details.model} />
                <Spec label={dict.vehicle.year} value={String(listing.vehicle_details.year)} />
                <Spec
                  label={dict.vehicle.mileage}
                  value={`${listing.vehicle_details.mileage_km.toLocaleString("fr-FR")} km`}
                />
                <Spec
                  label={dict.vehicle.fuel}
                  value={FUEL_LABELS[listing.vehicle_details.fuel]}
                />
                <Spec
                  label={dict.vehicle.gearbox}
                  value={GEARBOX_LABELS[listing.vehicle_details.gearbox]}
                />
              </dl>
            )}

            <section className="mt-10">
              <h2 className="text-lg font-semibold mb-3">{dict.listing.description}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </section>

            {listing.features.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-semibold mb-3">{dict.listing.features}</h2>
                <ul className="flex flex-wrap gap-2">
                  {listing.features.map((f) => (
                    <li
                      key={f}
                      className="rounded-xl bg-secondary px-3 py-1.5 text-sm text-foreground"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(listing.payment_plan || offerUnit) && (
              <section className="mt-10">
                <PaymentCalculator
                  units={offerUnit ? [offerUnit] : launchOfferUnits}
                  initialUnit={offerUnit}
                />
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-1">{dict.listing.priceLabel}</p>
              <p className="text-2xl font-bold text-cta mb-6">
                {formatUsd(listing.price_usd)}
              </p>
              <a
                href={whatsappUrl(visitMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
              >
                {dict.listing.requestVisit}
              </a>
              <a
                href={whatsappUrl(`Partage : ${listing.title} — ${formatUsd(listing.price_usd)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary"
              >
                {dict.listing.shareWhatsapp}
              </a>
            </div>

            {listing.lat && listing.lng && (
              <div className="rounded-2xl border border-border overflow-hidden bg-muted aspect-[4/3] relative">
                <Image
                  src={
                    listing.images[0]?.url ??
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&h=600&q=80"
                  }
                  alt={`${listing.neighborhood}, ${listing.commune}`}
                  fill
                  className="object-cover opacity-80"
                  sizes="340px"
                />
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-navy/80 to-transparent">
                  <p className="text-sm text-white font-medium">
                    {listing.neighborhood}, {listing.commune}
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-6">{dict.common.similarListings}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
