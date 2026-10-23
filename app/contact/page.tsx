import { Container } from "@/components/layout/container";
import { siteConfig, whatsappUrl } from "@/config/site";
import { getDictionary, defaultLocale } from "@/lib/i18n";

export const metadata = {
  title: "Contact",
  description: `Contactez ${siteConfig.name} à Kinshasa via WhatsApp.`,
};

export default function ContactPage() {
  const dict = getDictionary(defaultLocale);

  return (
    <div className="pt-24 pb-16">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {dict.common.contact}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {siteConfig.name} — Kinshasa. Réponse rapide sur WhatsApp.
          </p>
          <a
            href={whatsappUrl("Bonjour, je vous contacte depuis la page Contact.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-cta px-8 py-3.5 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
          >
            {dict.common.whatsapp}
          </a>
        </div>
      </Container>
    </div>
  );
}
