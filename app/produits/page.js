import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata = {
  title: "Produits — Portes pliantes",
  description: "Catalogue de portes pliantes avec prix et ajout au panier.",
};

export default function ProduitsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Nos portes pliantes
        </h1>
        <p className="mt-3 text-stone-600">
          Prix affichés en haut de chaque carte — ajoutez au panier en un clic.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
