import LoginForm from "@/components/LoginForm";
import { getDictionary } from "@/dictionaries";

export const metadata = {
  title: "Connexion — Portes Blindées",
  description: "Connectez-vous à votre compte pour commander.",
};

export default async function LoginPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "fr";
  const dict = await getDictionary(lang);
  const t = dict.auth || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {t.login_title || "Bon retour !"}
        </h1>
        <p className="mt-3 text-center text-stone-600">
          {t.login_subtitle || "Connectez-vous pour finaliser votre commande."}
        </p>
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <LoginForm t={t} lang={lang} />
        </div>
      </div>
    </div>
  );
}
