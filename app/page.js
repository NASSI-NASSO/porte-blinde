import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-24 sm:px-6 lg:py-32">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
            Portes pliantes sur mesure
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Gagnez de l’espace avec élégance
          </h1>
          <p className="max-w-xl text-lg text-stone-300">
            Bois, laqué, vitré ou acoustique : parcourez notre catalogue, ajoutez au panier et
            contactez-nous en un clic via WhatsApp.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/produits"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:bg-amber-500"
            >
              Voir les produits
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:py-24">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-900">Large choix</h2>
          <p className="mt-2 text-stone-600">
            Plusieurs finitions et styles pour s’adapter à votre intérieur.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-900">Panier simple</h2>
          <p className="mt-2 text-stone-600">
            Ajoutez vos articles, modifiez les quantités et suivez le total en temps réel.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-900">WhatsApp</h2>
          <p className="mt-2 text-stone-600">
            Bouton flottant pour une réponse rapide à vos questions et devis.
          </p>
        </div>
      </section>
    </div>
  );
}
