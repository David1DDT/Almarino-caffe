"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase, SupabaseProduct, getSupabaseImageUrl } from "@/lib/supabase";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

interface MenuItem {
  id: number | string;
  name: string;
  name_en?: string;
  category: "espresso" | "specialty" | "cold" | "beans" | "tea";
  desc: string;
  desc_en?: string;
  basePrice: number;
  image: string;
}

export default function MenuPage() {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [dynamicProducts, setDynamicProducts] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  }, []);

  const menuCatalog: MenuItem[] = useMemo(
    () => [
      // 1. Espresso Bar
      {
        id: 101,
        name: "Espresso Artizanal",
        name_en: "Artisanal Espresso",
        category: "espresso",
        desc: "Extracție precisă cu corp plin, cremă densă de alună și note dulci de ciocolată neagră.",
        desc_en: "Precise extraction with full body, dense hazelnut crema, and sweet dark chocolate notes.",
        basePrice: 10,
        image: "/images/soho_artisan_cafe.jpg",
      },
      {
        id: 102,
        name: "Espresso Macchiato",
        name_en: "Espresso Macchiato",
        category: "espresso",
        desc: "Espresso scurt încununat cu o pată fină de spumă cremoasă de lapte proaspăt.",
        desc_en: "Single shot espresso topped with a smooth dash of creamy fresh milk foam.",
        basePrice: 12,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 103,
        name: "Flat White Doblu",
        name_en: "Double Flat White",
        category: "espresso",
        desc: "Doza dublă de espresso ristretto combinată cu lapte catifelat micro-spumat artizanal.",
        desc_en: "Double ristretto shot blended with silky micro-foamed artisanal milk.",
        basePrice: 16,
        image: "/images/soho_artisan_cafe.jpg",
      },
      {
        id: 104,
        name: "Cappuccino Special",
        name_en: "Specialty Cappuccino",
        category: "espresso",
        desc: "Echilibru perfect între espresso de origine, lapte cald și spumă fină densă.",
        desc_en: "Perfect balance between single-origin espresso, warm milk, and silky thick foam.",
        basePrice: 15,
        image: "/images/vanilla_latte.jpg",
      },

      // 2. Băuturi Speciale
      {
        id: 201,
        name: "Vanilla Velvet Latte",
        name_en: "Vanilla Velvet Latte",
        category: "specialty",
        desc: "Cremă delicată de vanilie de Madagascar, lapte spumat fin și shot dublu espresso.",
        desc_en: "Delicate Madagascar vanilla cream, silky micro-foamed milk, and double espresso shot.",
        basePrice: 18,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 202,
        name: "Caramel Sărat Macchiato",
        name_en: "Salted Caramel Macchiato",
        category: "specialty",
        desc: "Sirop artizanal de caramel sărat, lapte cald catifelat și espresso intensiv.",
        desc_en: "Artisanal salted caramel syrup, velvety warm milk, and rich intense espresso.",
        basePrice: 19,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 203,
        name: "Spanish Cortado",
        name_en: "Spanish Cortado",
        category: "specialty",
        desc: "Raport 1:1 de espresso dublu și lapte condensat dulce alături de spumă fină.",
        desc_en: "1:1 ratio of double espresso and sweet condensed milk with silky foam.",
        basePrice: 15,
        image: "/images/soho_artisan_cafe.jpg",
      },

      // 3. Cold Brew & Infuzii
      {
        id: 301,
        name: "Kyoto Cold Drip (14 Ore)",
        name_en: "Kyoto Cold Drip (14 Hours)",
        category: "cold",
        desc: "Extracție lentă Picătură cu Picătură timp de 14 ore. Note florale fine și aciditate citrică curată.",
        desc_en: "Slow drip-by-drip extraction over 14 hours. Delicate floral notes and clean citrus acidity.",
        basePrice: 19,
        image: "/images/cold_brew_nitro.jpg",
      },
      {
        id: 302,
        name: "Nitro Cold Brew Infuzat",
        name_en: "Infused Nitro Cold Brew",
        category: "cold",
        desc: "Cafea rece infuzată cu azot alimentar pentru o textură cremoasă identică cu berea stout.",
        desc_en: "Cold brew infused with food-grade nitrogen for a creamy, cascading stout-like texture.",
        basePrice: 20,
        image: "/images/cold_brew_nitro.jpg",
      },

      // 4. Pachete Cafea Boabe (250g)
      {
        id: 401,
        name: "Ethiopia Yirgacheffe (250g)",
        name_en: "Ethiopia Yirgacheffe (250g)",
        category: "beans",
        desc: "Boabe proaspăt prăjite artizanal. Profil aromatic cu note de iasomie, bergamotă și miere polifloră.",
        desc_en: "Freshly roasted single-origin beans. Aromatic profile with jasmine, bergamot, and wildflower honey notes.",
        basePrice: 35,
        image: "/images/ethiopian_yirgacheffe.jpg",
      },
      {
        id: 402,
        name: "Colombia Supremo (250g)",
        name_en: "Colombia Supremo (250g)",
        category: "beans",
        desc: "Pachet cafea organică. Note intense de ciocolată neagră, tutun dulce și condimente calde de nucșoară.",
        desc_en: "Organic coffee bag. Intense notes of dark chocolate, sweet tobacco, and warm nutmeg spice.",
        basePrice: 30,
        image: "/images/ethiopian_yirgacheffe.jpg",
      },

      // 5. Ceai & Ciocolată
      {
        id: 501,
        name: "Ciocolată Caldă Belgiană",
        name_en: "Belgian Hot Chocolate",
        category: "tea",
        desc: "Ciocolată caldă densă artizanală preparată din ciocolată neagră belgiană topită și spumă fină.",
        desc_en: "Rich artisanal hot chocolate made from melted Belgian dark chocolate and silky foam.",
        basePrice: 18,
        image: "/images/cold_brew_nitro.jpg",
      },
    ],
    []
  );

  useEffect(() => {
    async function loadSupabaseProducts() {
      try {
        const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
        if (!error && data && data.length > 0) {
          const normalized = data.map((item: Record<string, unknown>) => ({
            id: item.id as number | string,
            name: String(item.name || item.name_ro || ""),
            name_en: String(item.name_en || item.name || ""),
            category: (item.category || "espresso") as MenuItem["category"],
            desc: String(item.desc || item.desc_ro || item.description || ""),
            desc_en: String(item.desc_en || item.desc || item.description || ""),
            basePrice: Number(item.basePrice ?? item.base_price ?? item.price ?? 15),
            image: getSupabaseImageUrl(String(item.image || item.image_url || "")),
          }));
          setDynamicProducts(normalized);
        }
      } catch {
        // Fallback to static catalog
      }
    }
    loadSupabaseProducts();
  }, []);

  const categories = [
    { id: "all", label: t("menu.all") },
    { id: "espresso", label: t("menu.espresso") },
    { id: "specialty", label: t("menu.specialty") },
    { id: "cold", label: t("menu.cold") },
    { id: "beans", label: t("menu.beans") },
    { id: "tea", label: t("menu.tea") },
  ];

  const currentCatalog = useMemo(() => {
    return dynamicProducts.length > 0 ? dynamicProducts : menuCatalog;
  }, [dynamicProducts, menuCatalog]);

  const filteredCatalog = useMemo(() => {
    if (activeCategory === "all") return currentCatalog;
    return currentCatalog.filter((item) => item.category === activeCategory);
  }, [activeCategory, currentCatalog]);

  return (
    <div className="min-h-screen bg-[#1a0f0a] text-[#fdfbf7] selection:bg-[#d49b4b] selection:text-[#1a0f0a]">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#1a0f0a]/95 backdrop-blur-xl border-b border-[#b86b32]/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#d49b4b] text-[#1a0f0a] flex items-center justify-center font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-widest text-[#d49b4b] block leading-none">
                ALMARINO CAFFÈ
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#cd7b3c] block mt-0.5">
                {t("menu.badge")}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle />

            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#d49b4b] text-[#1a0f0a] font-mono text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {t("menu.back_home")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative py-16 px-6 bg-gradient-to-b from-[#25160d] to-[#1a0f0a] border-b border-[#b86b32]/25 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d49b4b]/15 border border-[#d49b4b]/30 text-[#d49b4b] font-mono text-xs font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t("menu.badge")}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#fdfbf7]">
            {t("menu.title_prefix")} <span className="text-[#d49b4b]">{t("menu.title_brand")}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#fdfbf7]/80 font-medium leading-relaxed max-w-2xl mx-auto">
            {t("menu.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-mono text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${activeCategory === cat.id
                ? "bg-[#d49b4b] text-[#1a0f0a] border-[#d49b4b] shadow-lg ring-2 ring-[#d49b4b]/40 scale-105"
                : "bg-[#25160d]/80 text-[#fdfbf7]/80 border-[#b86b32]/30 hover:border-[#d49b4b]/60 hover:text-[#fdfbf7]"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Cards Grid - Minimal Card Display: Image, Price, Title, Description ONLY */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCatalog.map((item) => {
            const displayName = lang === "en" && item.name_en ? item.name_en : item.name;
            const displayDesc = lang === "en" && item.desc_en ? item.desc_en : item.desc;

            return (
              <div
                key={item.id}
                className="bg-gradient-to-b from-[#25160d] to-[#1e100a] border border-[#b86b32]/30 rounded-3xl p-6 flex flex-col justify-between hover:border-[#d49b4b]/70 hover:shadow-[0_10px_30px_rgba(212,155,75,0.15)] transition-all duration-300 group"
              >
                <div>
                  {/* 1. Imaginea & 2. Prețul */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-[#d49b4b]/20">
                    <Image
                      src={item.image}
                      alt={displayName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/80 via-transparent to-transparent"></div>

                    <span className="absolute bottom-3 right-3 font-serif font-black text-xl text-[#d49b4b] bg-[#1a0f0a]/90 px-3 py-1 rounded-xl border border-[#d49b4b]/30 shadow-lg">
                      {item.basePrice.toFixed(2)} {t("menu.currency")}
                    </span>
                  </div>

                  {/* 3. Titlul */}
                  <h3 className="text-xl font-serif font-black text-[#fdfbf7] group-hover:text-[#d49b4b] transition-colors mb-2">
                    {displayName}
                  </h3>

                  {/* 4. Descrierea */}
                  <p className="text-xs text-[#fdfbf7]/80 leading-relaxed font-medium">
                    {displayDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a0f0a] text-[#fdfbf7] py-12 px-6 border-t border-[#b86b32]/30 mt-16 text-center font-mono text-xs text-[#fdfbf7]/60">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="font-serif font-black text-lg text-[#d49b4b]">ALMARINO CAFFÈ • ALBA IULIA</p>
          <p>Bulevardul 1 Decembrie 1918 M4, 510007 Alba Iulia | Telefon: 0732 445 005</p>
          <p>&copy; {new Date().getFullYear()} Almarino Caffè. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
}