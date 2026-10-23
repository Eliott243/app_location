import Link from "next/link";
import { Container } from "@/components/layout/container";
import { formatUsd } from "@/config/site";
import { LISTING_STATUS_LABELS, LISTING_TYPE_LABELS } from "@/data/types";
import { getAllListings } from "@/lib/listings";

export const metadata = {
  title: "Administration",
  description: "Espace admin — liste des biens (aperçu local).",
};

export default async function AdminPage() {
  const listings = await getAllListings({ sort: "recent" });

  return (
    <div className="pt-24 pb-16">
      <Container>
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Administration
            </h1>
            <p className="mt-2 text-muted-foreground">
              Aperçu local des biens (données seed). Connexion Supabase à brancher plus tard.
            </p>
          </div>
          <span className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-medium">
            {listings.length} biens
          </span>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Titre</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Commune</th>
                <th className="px-4 py-3 font-semibold">Prix</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium max-w-[240px]">
                    <span className="line-clamp-2">{l.title}</span>
                    {l.featured && (
                      <span className="ml-2 text-xs font-bold uppercase text-cta">
                        Vedette
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {LISTING_TYPE_LABELS[l.type]}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.commune}</td>
                  <td className="px-4 py-3 font-semibold text-cta whitespace-nowrap">
                    {formatUsd(l.price_usd)}
                  </td>
                  <td className="px-4 py-3">{LISTING_STATUS_LABELS[l.status]}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/biens/${l.slug}`}
                      className="text-sm font-medium text-navy underline-offset-2 hover:underline"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
