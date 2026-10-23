import Link from "next/link";
import { Building2, Car, Home, LandPlot, MapPin } from "lucide-react";
import { HeroVideo } from "@/components/hero-video";
import { ListingCard } from "@/components/listing-card";
import { PaymentCalculator } from "@/components/payment-calculator";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig, whatsappUrl, formatUsd } from "@/config/site";
import {
  launchOfferUnits,
  launchOfferInclusions,
  offerHeadline,
  depositAmount,
  monthlyAmount,
} from "@/data/launch-offer";
import { LISTING_TYPE_LABELS, type ListingType } from "@/data/types";
import { getFeaturedListings } from "@/lib/listings";
import { getDictionary, defaultLocale } from "@/lib/i18n";

const categories: {
  type: ListingType;
  href: string;
  icon: typeof Home;
  blurb: string;
}[] = [
  {
    type: "apartment",
    href: "/recherche?type=apartment",
    icon: Building2,
    blurb: "Meublés et standing à Kinshasa",
  },
  {
    type: "house",
    href: "/recherche?type=house",
    icon: Home,
    blurb: "Villas et maisons familiales",
  },
  {
    type: "land",
    href: "/recherche?type=land",
    icon: LandPlot,
    blurb: "Terrains constructibles",
  },
  {
    type: "vehicle",
    href: "/vehicules",
    icon: Car,
    blurb: "4×4 et berlines sélectionnés",
  },
];

export default async function HomePage() {
  const dict = getDictionary(defaultLocale);
  const featured = await getFeaturedListings(6);

  return (
    <>
      {/* Hero — one composition: brand, headline, support, CTAs, visual */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-24 sm:pt-24">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2d]/90 via-[#14375e]/55 to-[#14375e]/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(242,140,40,0.22),_transparent_55%)]" />

        <Container className="relative z-10">
          <FadeIn>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              {siteConfig.name}
            </p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {dict.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/recherche"
                className="inline-flex items-center justify-center rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground transition hover:bg-cta/90 active:scale-[0.98]"
              >
                {dict.common.ctaPrimary}
              </Link>
              <Link
                href="/projet"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {dict.nav.projet}
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/65">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {dict.common.tagline}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Featured */}
      <Section className="bg-background">
        <Container>
          <FadeIn>
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {dict.home.featuredTitle}
                </h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  {dict.home.featuredSubtitle}
                </p>
              </div>
              <Link
                href="/recherche"
                className="text-sm font-semibold text-cta hover:underline"
              >
                {dict.common.viewAll}
              </Link>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing, i) => (
              <FadeIn key={listing.id} delay={0.05 * i}>
                <ListingCard listing={listing} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section className="bg-secondary/60">
        <Container>
          <FadeIn>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {dict.home.categoriesTitle}
            </h2>
            <p className="mb-10 max-w-xl text-muted-foreground">
              {dict.home.heroSubtitle}
            </p>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <FadeIn key={cat.type} delay={0.04 * i}>
                  <Link
                    href={cat.href}
                    className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white transition group-hover:bg-cta group-hover:text-cta-foreground">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {LISTING_TYPE_LABELS[cat.type]}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{cat.blurb}</p>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Launch offer */}
      <Section id="offre" className="bg-background">
        <Container>
          <FadeIn>
            <div className="mb-10 max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cta">
                {dict.home.offerTitle}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {offerHeadline}
              </h2>
              <p className="mt-3 text-muted-foreground">{dict.home.offerSubtitle}</p>
            </div>
          </FadeIn>

          <div className="grid gap-8 lg:grid-cols-2">
            <FadeIn>
              <div className="space-y-4">
                {launchOfferUnits.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`/biens/${unit.slug}`}
                    className="block rounded-2xl border border-border bg-card p-5 transition hover:border-cta/40 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{unit.label}</h3>
                      <p className="text-lg font-bold text-cta">
                        {formatUsd(unit.price_usd)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Acompte {formatUsd(depositAmount(unit))} ·{" "}
                      {formatUsd(monthlyAmount(unit))} / mois × {unit.months}
                      {unit.parking_spaces > 0
                        ? ` · ${unit.parking_spaces} parking`
                        : ""}
                    </p>
                  </Link>
                ))}

                <ul className="mt-6 space-y-2 rounded-2xl bg-secondary/80 p-5 text-sm text-foreground">
                  {launchOfferInclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <PaymentCalculator units={launchOfferUnits} />
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-navy text-white">
        <Container>
          <FadeIn>
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {dict.home.contactCta}
              </h2>
              <p className="mt-3 text-white/70">{dict.common.tagline}</p>
              <a
                href={whatsappUrl(
                  "Bonjour, je souhaite des informations sur vos biens."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-cta px-7 py-3.5 text-sm font-semibold text-cta-foreground transition hover:bg-cta/90"
              >
                {dict.common.whatsapp}
              </a>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
