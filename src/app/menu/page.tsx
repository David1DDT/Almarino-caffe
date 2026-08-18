"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase, SupabaseProduct, getSupabaseImageUrl } from "@/lib/supabase";

interface MenuItem {
  id: number | string;
  name: string;
  category: "espresso" | "specialty" | "cold" | "beans" | "tea";
  desc: string;
  basePrice: number;
  image: string;
}

export default function MenuPage() {
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
        category: "espresso",
        desc: "Extracție precisă cu corp plin, cremă densă de alună și note dulci de ciocolată neagră.",
        basePrice: 10,
        image: "/images/soho_artisan_cafe.jpg",
      },
      {
        id: 102,
        name: "Espresso Macchiato",
        category: "espresso",
        desc: "Espresso scurt încununat cu o pată fină de spumă cremoasă de lapte proaspăt.",
        basePrice: 12,
        image: "/images/soho_artisan_cafe.jpg",
      },
      {
        id: 103,
        name: "Cappuccino Artizanal",
        category: "espresso",
        desc: "Espresso echilibrat cu lapte mătăsos texturat la micro-spumă catifelată.",
        basePrice: 16,
        image: "/images/soho_artisan_cafe.jpg",
      },
      {
        id: 104,
        name: "Flat White Dual-Origin",
        category: "espresso",
        desc: "Doza dublă de espresso ristretto cu strat subțire de lapte cremos fierbinte.",
        basePrice: 18,
        image: "/images/soho_artisan_cafe.jpg",
      },
      {
        id: 105,
        name: "Caffè Latte Velvet",
        category: "espresso",
        desc: "Espresso fin combinat generos cu lapte cald texturat mătăsos.",
        basePrice: 17,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 106,
        name: "Americano Pure Roast",
        category: "espresso",
        desc: "Espresso dublu diluat delicat cu apă fierbinte purificată.",
        basePrice: 12,
        image: "/images/soho_artisan_cafe.jpg",
      },

      // 2. Băuturi Speciale
      {
        id: 201,
        name: "Madagascar Vanilla Latte",
        category: "specialty",
        desc: "Espresso dublu infuzat cu sirop artizanal din păstăi de vanilie de Madagascar și lapte cremos.",
        basePrice: 24,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 202,
        name: "Pistachio Cream Cappuccino",
        category: "specialty",
        desc: "Cappuccino cremos îmbogățit cu pastă pură de fistic sicilian și fulgi crocanti.",
        basePrice: 26,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 203,
        name: "Salted Caramel Latte",
        category: "specialty",
        desc: "Espresso intens cu sos artizanal de caramel sărat și praf de sare roz de Himalaya.",
        basePrice: 23,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 204,
        name: "Mocha Ciocolată Bio",
        category: "specialty",
        desc: "Espresso dublu armonios combinat cu ciocolată neagră bio 70% și spumă de lapte.",
        basePrice: 22,
        image: "/images/cold_brew_nitro.jpg",
      },

      // 3. Cold Brew & Infuzii
      {
        id: 301,
        name: "Kyoto Drip Cold Brew",
        category: "cold",
        desc: "Extracție picătură cu picătură timp de 14 ore peste lemn de stejar ars, servită peste cuburi masive de gheață.",
        basePrice: 22,
        image: "/images/cold_brew_nitro.jpg",
      },
      {
        id: 302,
        name: "Nitro Draft Mocha",
        category: "cold",
        desc: "Cold brew infuzat cu azot la dozator, oferind o spumă densă ca de bere stout și ciocolată bio cremoasă.",
        basePrice: 25,
        image: "/images/cold_brew_nitro.jpg",
      },
      {
        id: 303,
        name: "Iced Latte Artizanal",
        category: "cold",
        desc: "Espresso proaspăt turnat peste gheață și lapte rece proaspăt de fermă.",
        basePrice: 19,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 304,
        name: "Tonic Espresso Citric",
        category: "cold",
        desc: "Espresso floral infuzat peste apă tonică premium cu aromă de bergamotă și coajă de portocală bio.",
        basePrice: 21,
        image: "/images/cold_brew_nitro.jpg",
      },

      // 4. Pachete Cafea de Origine (Boabe / Măcinată)
      {
        id: 401,
        name: "Ethiopian Yirgacheffe Bloom",
        category: "beans",
        desc: "Pachet cafea proaspăt prăjită. Note florale elegante cu bergamotă proaspătă și dulceață de miere sălbatică.",
        basePrice: 28,
        image: "/images/ethiopian_yirgacheffe.jpg",
      },
      {
        id: 402,
        name: "Colombian Supremo Reserve",
        category: "beans",
        desc: "Pachet cafea de origine. Corp catifelat cu accente de ciocolată, nuci prăjite și cremă bogată de caramel.",
        basePrice: 26,
        image: "/images/soho_artisan_cafe.jpg",
      },
      {
        id: 403,
        name: "Guatemalan Antigua Dark",
        category: "beans",
        desc: "Pachet cafea organică. Note intense de ciocolată neagră, tutun dulce și condimente calde de nucșoară.",
        basePrice: 30,
        image: "/images/ethiopian_yirgacheffe.jpg",
      },
      {
        id: 404,
        name: "Costa Rica Tarrazu Honey",
        category: "beans",
        desc: "Micro-lot procesat prin metoda honey. Aromă fină de piersici coapte, sirop de arțar și alune de pădure.",
        basePrice: 32,
        image: "/images/ethiopian_yirgacheffe.jpg",
      },

      // 5. Ceai & Ciocolată
      {
        id: 501,
        name: "Ciocolată Caldă Belgiană",
        category: "tea",
        desc: "Ciocolată caldă densă artizanală preparată din ciocolată neagră belgiană topită și spumă fină.",
        basePrice: 18,
        image: "/images/cold_brew_nitro.jpg",
      },
      {
        id: 502,
        name: "Matcha Ceremonial Latte",
        category: "tea",
        desc: "Pudră Matcha ceremonială Uji din Japonia spumată cu lapte vegetal de ovăz.",
        basePrice: 22,
        image: "/images/vanilla_latte.jpg",
      },
      {
        id: 503,
        name: "Ceai Bio Iasomie & Ceai Verde",
        category: "tea",
        desc: "Infuzie din frunze întregi de ceai verde chinezesc parfumate natural cu flori proaspete de iasomie.",
        basePrice: 15,
        image: "/images/ethiopian_yirgacheffe.jpg",
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
            name: String(item.name || ""),
            category: (item.category || "espresso") as MenuItem["category"],
            desc: String(item.desc || item.description || ""),
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
    { id: "all", label: "Toate Produsele" },
    { id: "espresso", label: "Espresso Bar" },
    { id: "specialty", label: "Băuturi Speciale" },
    { id: "cold", label: "Cold Brew & Infuzii" },
    { id: "beans", label: "Pachete Cafea Boabe" },
    { id: "tea", label: "Ceai & Ciocolată" },
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
                Meniu Oficial • Alba Iulia
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#d49b4b] text-[#1a0f0a] font-mono text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              ← ACASĂ
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative py-16 px-6 bg-gradient-to-b from-[#25160d] to-[#1a0f0a] border-b border-[#b86b32]/25 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d49b4b]/15 border border-[#d49b4b]/30 text-[#d49b4b] font-mono text-xs font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Meniu Proaspăt Prăjit & Preparat pe Loc</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#fdfbf7]">
            Meniu Artizanal <span className="text-[#d49b4b]">Almarino Caffè</span>
          </h1>
          <p className="text-sm sm:text-base text-[#fdfbf7]/80 font-medium leading-relaxed max-w-2xl mx-auto">
            Descoperă selecția noastră completă de cafele de origine de la espresso bar, băuturi cold brew infuzate timp de 14 ore, pachete de cafea proaspăt prăjită și preparate artizanale.
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
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-b from-[#25160d] to-[#1e100a] border border-[#b86b32]/30 rounded-3xl p-6 flex flex-col justify-between hover:border-[#d49b4b]/70 hover:shadow-[0_10px_30px_rgba(212,155,75,0.15)] transition-all duration-300 group"
            >
              <div>
                {/* 1. Imaginea & 2. Prețul */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-[#d49b4b]/20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/80 via-transparent to-transparent"></div>

                  <span className="absolute bottom-3 right-3 font-serif font-black text-xl text-[#d49b4b] bg-[#1a0f0a]/90 px-3 py-1 rounded-xl border border-[#d49b4b]/30 shadow-lg">
                    {item.basePrice.toFixed(2)} lei
                  </span>
                </div>

                {/* 3. Titlul */}
                <h3 className="text-xl font-serif font-black text-[#fdfbf7] group-hover:text-[#d49b4b] transition-colors mb-2">
                  {item.name}
                </h3>

                {/* 4. Descrierea */}
                <p className="text-xs text-[#fdfbf7]/80 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
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