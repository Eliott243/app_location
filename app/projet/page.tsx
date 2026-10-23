import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PaymentCalculator } from "@/components/payment-calculator";
import { FadeIn } from "@/components/motion/fade-in";
import { formatUsd, whatsappUrl } from "@/config/site";
import {
  launchOfferUnits,
  launchOfferInclusions,
  offerHeadline,
  depositAmount,
  monthlyAmount,
} from "@/data/launch-offer";
import { getDictionary, defaultLocale } from "@/lib/i18n";

export const metadata = {
  title: "Offre de lancement",
  description:
    "Appartements meublés à Kinshasa — 10 % d'acompte et 45 mensualités.",
};

export default function ProjetPage() {
  const dict = getDictionary(defaultLocale);

  return (
    <div className="pt-20">
      <section className="bg-navy text-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cta">
              {dict.home.offerTitle}
            </p>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              {offerHeadline}
            </h1>
            <p className="mt-4 max-w-2xl text-white/75">{dict.home.offerSubtitle}</p>
          </FadeIn>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <FadeIn>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Unités disponibles</h2>
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

                <ul className="mt-6 space-y-2 rounded-2xl bg-secondary/80 p-5 text-sm">
                  {launchOfferInclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={whatsappUrl(
                    "Bonjour, je suis intéressé(e) par l'offre de lancement."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
                >
                  {dict.common.whatsapp} — demander une visite
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <PaymentCalculator units={launchOfferUnits} />
            </FadeIn>
          </div>
        </Container>
      </Section>
    </div>
  );
}
