import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — Portes pliantes",
  description: "Formulaire de contact pour devis et informations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Contact
        </h1>
        <p className="mt-3 text-center text-stone-600">
          Une question sur nos portes pliantes ou un devis ? Écrivez-nous.
        </p>
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
