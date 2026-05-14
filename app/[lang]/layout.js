import { Tajawal, Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";
import Shell from "@/components/Shell";
import { getDictionary } from "@/dictionaries";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portes Blindées — Sécurité & Design",
  description: "Découvrez nos portes blindées de haute sécurité.",
};

export default async function RootLayout({ children, params }) {
  // Await params as required by Next.js 15+ 
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "fr";
  const dict = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  
  // Decide font based on language
  const fontClass = lang === "ar" ? `${tajawal.variable} font-sans` : `${geistSans.variable} ${geistMono.variable}`;

  return (
    <html lang={lang} dir={dir} className={`${fontClass} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <Providers>
          <Shell dict={dict} lang={lang}>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
