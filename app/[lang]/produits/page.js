import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { getDictionary } from "@/dictionaries";

export const metadata = {
  title: "Produits — Portes Blindées",
  description: "Catalogue de portes blindées avec prix et ajout au panier.",
};

export const dynamic = "force-dynamic";

export default async function ProduitsPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "fr";
  const dict = await getDictionary(lang);
  const t = dict.produits || {};

  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {t.title || "Nos Portes Blindées"}
        </h1>
        <p className="mt-3 text-stone-600">
          {t.subtitle || "Découvrez notre collection de portes blindées certifiées."}
        </p>
      </div>
      
      {allProducts.length === 0 ? (
        <p className="text-center text-stone-500">{t.no_products || "Aucun produit trouvé."}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
