import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import "./globals.css";

const dictionary = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} · ${dictionary.meta.title}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: dictionary.meta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteConfig.locale} className="h-full">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
