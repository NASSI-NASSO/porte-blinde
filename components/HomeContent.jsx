"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useI18n } from "./Shell";

// --- Animation variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

// For RTL, slideInRight means sliding from the physical right (which is logical start in RTL).
const slideInStart = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const slideInEnd = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

// --- Counter component ---
function Counter({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} dir="ltr" className="inline-block">
      {count}
      {suffix}
    </span>
  );
}

export default function HomeContent() {
  const { dict, lang } = useI18n();
  const t = dict.home || {};
  const isRtl = lang === "ar";

  // --- Dynamic data ---
  const services = [
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t.srv_1_title,
      description: t.srv_1_desc,
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t.srv_2_title,
      description: t.srv_2_desc,
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t.srv_3_title,
      description: t.srv_3_desc,
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: t.srv_4_title,
      description: t.srv_4_desc,
    },
  ];

  const showcaseProducts = [
    {
      src: "/porte5.avif",
      title: t.sc_1_title,
      desc: t.sc_1_desc,
    },
    {
      src: "/porte1.jpg",
      title: t.sc_2_title,
      desc: t.sc_2_desc,
    },
    {
      src: "/porte3.avif",
      title: t.sc_3_title,
      desc: t.sc_3_desc,
    },
    {
      src: "/porte2.avif",
      title: t.sc_4_title,
      desc: t.sc_4_desc,
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden text-start">
      {/* ====== HERO SECTION ====== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-stone-900 text-white">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/faire-installer-porte-blindee-nice.jpg"
            alt="Portes Blindées"
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/60 to-stone-900" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-amber-400/10"
              style={{
                width: 200 + i * 100,
                height: 200 + i * 100,
                top: `${10 + i * 15}%`,
                [isRtl ? "left" : "right"]: `${-5 + i * 8}%`, 
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32 w-full">
          <motion.div
            className="flex items-center gap-3 mb-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-stone-900">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400">
              {t.hero_badge}
            </p>
          </motion.div>

          <motion.h1
            className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl leading-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
          >
            {t.hero_title_1}
            <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t.hero_title_2}
            </span>
            {t.hero_title_3}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg text-stone-300 leading-relaxed font-medium"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            {t.hero_subtitle}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 mt-8"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.45}
          >
            <Link
              href={`/${lang}/produits`}
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-amber-600 px-8 py-4 font-bold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-900/40"
            >
              {t.hero_btn_products}
              <motion.svg
                className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, isRtl ? -4 : 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold backdrop-blur-sm transition-all hover:bg-white/15"
            >
              {t.hero_btn_contact}
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-16 flex flex-wrap items-center gap-8 border-t border-white/10 pt-8"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
          >
            {[t.trust_1, t.trust_2, t.trust_3].map((badge, i) => (
              <div key={badge} className="flex items-center gap-2 text-sm font-medium text-stone-400">
                <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== STATS SECTION ====== */}
      <section className="relative bg-stone-900 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: 15, suffix: "+", label: t.stats_1 },
              { value: 5000, suffix: "+", label: t.stats_2 },
              { value: 100, suffix: "%", label: t.stats_3 },
              { value: 10, suffix: t.stats_4_suffix, label: t.stats_4 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
              >
                <p className="text-3xl font-bold text-amber-500 sm:text-4xl">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-stone-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== À PROPOS SECTION ====== */}
      <section className="bg-stone-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image side */}
            <motion.div
              className="relative"
              variants={isRtl ? slideInStart : slideInEnd} // Swap animation direction logically
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/porte-blindee-pavillonnaire.jpg"
                  alt="Workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
              </div>
              <motion.div
                className="absolute -bottom-6 -start-4 sm:-start-8 rounded-2xl bg-amber-600 px-6 py-4 text-white shadow-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-3xl font-bold">15+</p>
                <p className="text-sm font-medium text-amber-100">{isRtl ? "سنة من الخبرة" : "ans d'expertise"}</p>
              </motion.div>
            </motion.div>

            {/* Text side */}
            <motion.div
              variants={isRtl ? slideInEnd : slideInStart}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-3">{t.about_badge}</p>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {t.about_title}
              </h2>
              <p className="mt-6 text-lg text-stone-600 leading-relaxed font-medium">
                {t.about_p1}
              </p>
              <p className="mt-4 text-stone-600 leading-relaxed">
                {t.about_p2}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: t.about_feat_1, icon: "🛡️" },
                  { label: t.about_feat_2, icon: "🌡️" },
                  { label: t.about_feat_3, icon: "🔒" },
                  { label: t.about_feat_4, icon: "✨" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-stone-100">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-bold text-stone-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== SERVICES SECTION ====== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-3">{t.services_badge}</p>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {t.services_title}
            </h2>
            <p className="mt-4 text-lg text-stone-600 font-medium">
              {t.services_subtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                className="group relative rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-amber-200 hover:-translate-y-1"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-200">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">{service.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRODUCTS SHOWCASE ====== */}
      <section className="bg-stone-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-3">{t.showcase_badge}</p>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {t.showcase_title}
            </h2>
            <p className="mt-4 text-lg text-stone-600 font-medium">
              {t.showcase_subtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {showcaseProducts.map((product, i) => (
              <motion.div
                key={product.title}
                className="group relative overflow-hidden rounded-3xl shadow-md"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={product.src}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                    {product.desc}
                  </p>
                  <h3 className="text-lg font-bold text-white">{product.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.4}
          >
            <Link
              href={`/${lang}/produits`}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-stone-800 hover:shadow-xl"
            >
              {t.showcase_btn}
              <svg className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="relative overflow-hidden bg-stone-900 py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/porte-blindee-pavillonnaire.jpg"
            alt=""
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/95 to-stone-900/90" />
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 end-10 w-72 h-72 rounded-full bg-amber-500/5"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl leading-tight"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t.cta_title_1}
            <span className="block text-amber-500 mt-2">{t.cta_title_2}</span>
          </motion.h2>
          <motion.p
            className="mt-6 text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.15}
          >
            {t.cta_subtitle}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
          >
            <Link
              href={`/${lang}/produits`}
              className="rounded-xl bg-amber-600 px-8 py-4 font-bold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-xl"
            >
              {t.cta_btn_1}
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15"
            >
              {t.cta_btn_2}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
