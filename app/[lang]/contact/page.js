import ContactForm from "@/components/ContactForm";
import { getDictionary } from "@/dictionaries";

export const metadata = {
  title: "Contact — Portes Blindées",
  description: "Formulaire de contact pour devis et informations.",
};

export default async function ContactPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "fr";
  const dict = await getDictionary(lang);
  const t = dict.contact || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {t.title || "Contact"}
        </h1>
        <p className="mt-3 text-center text-stone-600">
          {t.subtitle || "Une question sur nos portes blindées ou un devis ? Écrivez-nous."}
        </p>
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm text-start">
          <ContactForm t={t} lang={lang} />
        </div>
      </div>
    </div>
  );
}
