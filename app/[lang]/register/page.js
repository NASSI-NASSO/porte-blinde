import RegisterForm from "@/components/RegisterForm";
import { getDictionary } from "@/dictionaries";

export const metadata = {
  title: "Inscription — Portes Blindées",
  description: "Créez votre compte pour suivre vos commandes.",
};

export default async function RegisterPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "fr";
  const dict = await getDictionary(lang);
  const t = dict.auth || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {t.register_title || "Créer un compte"}
        </h1>
        <p className="mt-3 text-center text-stone-600">
          {t.register_subtitle || "Rejoignez-nous pour commander et gérer vos adresses."}
        </p>
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <RegisterForm t={t} lang={lang} />
        </div>
      </div>
    </div>
  );
}
