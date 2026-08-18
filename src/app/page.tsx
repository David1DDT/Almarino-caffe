"use client";

import CinematicCoffeeScroll from "@/components/CinematicCoffeeScroll";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { getSupabaseImageUrl } from "@/lib/supabase";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

// Accessible ScrollReveal component that respects prefers-reduced-motion
function ScrollReveal({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRoast, setSelectedRoast] = useState<"light" | "medium" | "dark">("medium");

  // Customizer State
  const [customName, setCustomName] = useState("Almarino Special Blend");
  const [customGrind, setCustomGrind] = useState("whole");
  const [customSize, setCustomSize] = useState("250");
  const [customOrderSuccess, setCustomOrderSuccess] = useState(false);

  // Menu Item Selections
  const [itemSelections, setItemSelections] = useState<Record<number, string>>({
    1: "250g",
    2: "250g",
    3: "250g",
    4: "16 oz",
    5: "16 oz",
    6: "16 oz",
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  }, []);

  const menuItems = useMemo(() => [
    {
      id: 1,
      name: "Ethiopian Yirgacheffe Bloom",
      category: "filter",
      itemKind: "beans" as const,
      desc: "Note florale elegante cu bergamotă proaspătă și dulceață de miere sălbatică.",
      basePrice: 28,
      origin: "Ethiopia",
      type: "Light Roast Beans",
      badge: "Single Origin",
      notes: ["Iasomie", "Bergamotă", "Miere Sălbatică"],
      options: ["250g", "500g", "1kg"],
      image: getSupabaseImageUrl("/images/ethiopian_yirgacheffe.jpg"),
    },
    {
      id: 2,
      name: "Colombian Supremo Reserve",
      category: "espresso",
      itemKind: "beans" as const,
      desc: "Corp catifelat cu accente de ciocolată, nuci prăjite și cremă bogată de caramel.",
      basePrice: 26,
      origin: "Colombia",
      type: "Medium Roast Beans",
      badge: "Popular",
      notes: ["Caramel", "Nuci Prăjite", "Cacao"],
      options: ["250g", "500g", "1kg"],
      image: getSupabaseImageUrl("/images/ethiopian_yirgacheffe.jpg"),
    },
    {
      id: 3,
      name: "Guatemalan Antigua Dark",
      category: "espresso",
      itemKind: "beans" as const,
      desc: "Note intense de ciocolată neagră și condimente calde de nucșoară.",
      basePrice: 30,
      origin: "Guatemala",
      type: "Dark Roast Beans",
      badge: "Organic",
      notes: ["Ciocolată Neagră", "Nucșoară", "Zahăr Brun"],
      options: ["250g", "500g", "1kg"],
      image: getSupabaseImageUrl("/images/ethiopian_yirgacheffe.jpg"),
    },
    {
      id: 4,
      name: "Kyoto Drip Cold Brew",
      category: "cold",
      itemKind: "beverage" as const,
      desc: "Extracție picătură cu picătură timp de 14 ore peste lemn de stejar ars.",
      basePrice: 22,
      origin: "Almarino Drip Bar",
      type: "Medium Roast Beverage",
      badge: "Ediție Limitată",
      notes: ["Stejar", "Cireșe", "Cacao Pură"],
      options: ["12 oz", "16 oz", "20 oz"],
      image: getSupabaseImageUrl("/images/cold_brew_nitro.jpg"),
    },
    {
      id: 5,
      name: "Madagascar Vanilla Latte",
      category: "specialty",
      itemKind: "beverage" as const,
      desc: "Espresso dublu cu sirop artizanal de păstăi de vanilie de Madagascar și lapte cremos.",
      basePrice: 24,
      origin: "Specialitatea Casei",
      type: "Prepared Espresso Beverage",
      badge: "Recomandarea Alexandru",
      notes: ["Păstăi Vanilie", "Double Espresso", "Cremă Lapte"],
      options: ["12 oz", "16 oz", "20 oz"],
      image: getSupabaseImageUrl("/images/vanilla_latte.jpg"),
    },
    {
      id: 6,
      name: "Nitro Draft Mocha",
      category: "cold",
      itemKind: "beverage" as const,
      desc: "Cold brew la dozator infuzat cu azot și ciocolată bio cremoasă.",
      basePrice: 25,
      origin: "Draft Bar",
      type: "Cold Draft Beverage",
      badge: "Răcoritor",
      notes: ["Ciocolată", "Spumă Azot", "Dozator Cold Brew"],
      options: ["12 oz", "16 oz", "20 oz"],
      image: getSupabaseImageUrl("/images/cold_brew_nitro.jpg"),
    },
  ], []);

  const getNoteStyles = (note: string) => {
    const n = note.toLowerCase();
    if (n.includes("iasomie") || n.includes("floral")) {
      return "bg-amber-100/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300/60";
    }
    if (n.includes("bergamot") || n.includes("citrus") || n.includes("cireșe")) {
      return "bg-rose-100/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300/60";
    }
    if (n.includes("miere") || n.includes("caramel") || n.includes("zahăr")) {
      return "bg-amber-50/90 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border-amber-200/50";
    }
    return "bg-amber-100/60 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 border-amber-300/40";
  };

  const calculateItemPrice = (item: typeof menuItems[0], option: string) => {
    if (item.itemKind === "beans") {
      if (option === "500g") return item.basePrice * 1.8;
      if (option === "1kg") return item.basePrice * 3.2;
      return item.basePrice;
    } else {
      if (option === "16 oz") return item.basePrice + 3;
      if (option === "20 oz") return item.basePrice + 6;
      return item.basePrice;
    }
  };

  const handleSelectionChange = (itemId: number, option: string) => {
    setItemSelections((prev) => ({ ...prev, [itemId]: option }));
  };

  const handleCustomOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomOrderSuccess(true);
    setTimeout(() => setCustomOrderSuccess(false), 4500);
  };

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return menuItems;
    return menuItems.filter((i) => i.category === activeTab);
  }, [activeTab, menuItems]);

  return (
    <div className="min-h-screen bg-frost-alabaster dark:bg-emerald-dark text-emerald-dark dark:text-frost-alabaster selection:bg-champagne selection:text-emerald-dark transition-colors duration-500">

      {/* 1. Header & Floating Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-frost-alabaster/90 dark:bg-emerald-dark/90 backdrop-blur-xl border-b border-sage/15 dark:border-champagne/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-sage dark:bg-champagne text-frost-alabaster dark:text-emerald-dark flex items-center justify-center font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-widest text-emerald-dark dark:text-champagne block leading-none">
                ALMARINO CAFFÈ
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-sage dark:text-champagne-light block">
                  Deschis • Alba Iulia • 5.0 Rating
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-wider text-emerald-dark/80 dark:text-frost-alabaster/80">
            <Link href="/menu" className="text-sage dark:text-champagne font-extrabold hover:underline">{t("nav.menu")}</Link>
            <Link href="#cinema" className="hover:text-sage dark:hover:text-champagne transition-colors">{t("nav.cinema")}</Link>
            <Link href="#reviews" className="hover:text-sage dark:hover:text-champagne transition-colors">{t("nav.reviews")}</Link>
            <Link href="#location" className="hover:text-sage dark:hover:text-champagne transition-colors">{t("nav.location")}</Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* 2. Mostar 3D Cinematic Scroll Section */}
      <section id="cinema" className="pt-20">
        <CinematicCoffeeScroll />
      </section>

      {/* 3. Main Content Surface */}
      <main className="relative z-20 bg-frost-alabaster dark:bg-emerald-dark">

        {/* 5. Authentic Reviews Section (5.0 ★ Google & Tripadvisor) */}
        <section id="reviews" className="py-24 px-6 bg-sage/10 dark:bg-eucalyptus-dark/60 border-y border-sage/15">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-champagne font-mono text-xs font-black uppercase tracking-widest mb-3">
                  <span>{t("home.reviews_badge")}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-black mb-4">
                  {t("home.reviews_title")} <span className="italic font-light text-sage dark:text-champagne">{t("home.reviews_title_italic")}</span>
                </h2>
                <p className="text-sm md:text-base text-emerald-dark/80 dark:text-frost-alabaster/80 font-medium">
                  {t("home.reviews_sub")}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Liana Aruncutean",
                  stars: "★★★★★ 5/5",
                  source: "Google Review",
                  time: "1 month ago",
                  text: t("home.review1"),
                },
                {
                  name: "Gabriela Cristina Hale",
                  stars: "★★★★★ 5/5",
                  source: "Google Review",
                  time: "1 month ago",
                  text: t("home.review2"),
                },
                {
                  name: "Teodor T",
                  stars: "★★★★★ 5/5",
                  source: "Google Review",
                  time: "1 month ago",
                  text: t("home.review3"),
                },
              ].map((rev, idx) => (
                <ScrollReveal key={idx} delay={idx * 120} className="h-full">
                  <div className="bg-white/80 dark:bg-eucalyptus-dark/80 backdrop-blur-md p-8 rounded-3xl border border-sage/20 dark:border-champagne/20 shadow-lg flex flex-col justify-between h-full hover:border-sage transition-all">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-amber-500 font-bold text-sm tracking-widest">{rev.stars}</span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-dark/60 dark:text-frost-alabaster/60 font-extrabold">{rev.source}</span>
                      </div>
                      <p className="text-sm text-emerald-dark/90 dark:text-frost-alabaster/90 italic font-medium leading-relaxed mb-6">
                        "{rev.text}"
                      </p>
                    </div>
                    <div className="border-t border-sage/15 pt-4 flex justify-between items-center font-mono">
                      <span className="text-xs font-black text-sage dark:text-champagne">{rev.name}</span>
                      <span className="text-[9px] text-emerald-dark/60 dark:text-frost-alabaster/60 font-semibold">{rev.time}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Location Showcase Section (Alba Iulia) */}
        <section id="location" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage/10 dark:bg-champagne/15 border border-sage/30 dark:border-champagne/30 font-mono text-xs font-bold text-sage dark:text-champagne uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{t("home.location_badge")}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-black leading-tight">
                  {t("home.location_title")}
                </h2>
                <p className="text-sm md:text-base text-emerald-dark/80 dark:text-frost-alabaster/80 font-medium leading-relaxed">
                  {t("home.location_sub")}
                </p>
              </ScrollReveal>

              <div className="space-y-4 font-mono text-sm">
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-eucalyptus-dark/70 border border-sage/20 dark:border-champagne/20 shadow-md hover:border-sage dark:hover:border-champagne transition-all flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-sage/10 dark:bg-champagne/15 text-sage dark:text-champagne flex items-center justify-center font-bold text-xl shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-emerald-dark/60 dark:text-frost-alabaster/60 uppercase tracking-widest font-extrabold block">Adresă Oficială</span>
                    <a
                      href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x474ea7d1de5e4ae7:0xc5b5cb3aee156c34"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif font-black text-lg text-emerald-dark dark:text-frost-alabaster hover:text-sage dark:hover:text-champagne transition-colors block mt-0.5"
                    >
                      Bulevardul 1 Decembrie 1918 M4, 510007 Alba Iulia
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-eucalyptus-dark/70 border border-sage/20 dark:border-champagne/20 shadow-md hover:border-sage dark:hover:border-champagne transition-all flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sage/10 dark:bg-champagne/15 text-sage dark:text-champagne flex items-center justify-center font-bold text-lg shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-dark/60 dark:text-frost-alabaster/60 uppercase tracking-widest font-extrabold block">{t("home.phone_label")}</span>
                      <a href="tel:0732445005" className="font-mono font-bold text-xs text-sage dark:text-champagne hover:underline transition-colors block mt-0.5">
                        0732 445 005
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-eucalyptus-dark/70 border border-sage/20 dark:border-champagne/20 shadow-md hover:border-sage dark:hover:border-champagne transition-all flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sage/10 dark:bg-champagne/15 text-sage dark:text-champagne flex items-center justify-center font-bold text-lg shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-dark/60 dark:text-frost-alabaster/60 uppercase tracking-widest font-extrabold block">{t("home.hours_title")}</span>
                      <span className="font-mono font-bold text-xs text-emerald-dark dark:text-frost-alabaster block mt-0.5">
                        {t("home.hours_time")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal delay={200}>
                <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-sage/30 dark:border-champagne/30 shadow-2xl group">
                  <Image
                    src={getSupabaseImageUrl("/images/soho_artisan_cafe.jpg")}
                    alt="Almarino Caffè Interior Alba Iulia"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                    <div>
                      <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#d49b4b] block mb-1">
                        5.0 Rating • Google Verified • Alba Iulia
                      </span>
                      <h3 className="text-2xl font-serif font-black">Almarino Caffè</h3>
                      <p className="text-xs text-white/80 font-medium">Bulevardul 1 Decembrie 1918 M4</p>
                    </div>
                    <a
                      href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x474ea7d1de5e4ae7:0xc5b5cb3aee156c34"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#d49b4b] text-[#1a0f0a] font-mono text-xs font-black uppercase tracking-wider rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer className="bg-[#1a0f0a] text-frost-alabaster py-16 px-6 border-t border-[#b86b32]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-black tracking-widest text-[#d49b4b] mb-4">
              {t("footer.title")}
            </h3>
            <p className="text-xs text-frost-alabaster/75 max-w-sm leading-relaxed mb-6 font-sans font-medium">
              {t("footer.desc")}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d49b4b] mb-4">{t("footer.nav")}</h4>
            <div className="flex flex-col gap-2.5 text-xs text-frost-alabaster/80 font-sans font-semibold">
              <Link href="#cinema" className="hover:text-[#d49b4b] transition-colors">{t("footer.link_cinema")}</Link>
              <Link href="/menu" className="hover:text-[#d49b4b] transition-colors">{t("footer.link_menu")}</Link>
              <Link href="#reviews" className="hover:text-[#d49b4b] transition-colors">{t("footer.link_reviews")}</Link>
              <Link href="#location" className="hover:text-[#d49b4b] transition-colors">{t("footer.link_location")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d49b4b] mb-4">Contact</h4>
            <div className="flex flex-col gap-2.5 text-xs text-frost-alabaster/80 font-sans font-semibold">
              <p>Bulevardul 1 Decembrie 1918 M4, Alba Iulia</p>
              <p>Telefon: <a href="tel:0732445005" className="hover:text-[#d49b4b]">0732 445 005</a></p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center font-mono text-xs text-frost-alabaster/50 border-t border-[#b86b32]/20 pt-8 mt-12 font-semibold">
          &copy; {new Date().getFullYear()} Almarino Caffè. Bulevardul 1 Decembrie 1918 M4, Alba Iulia.
        </div>
      </footer>
    </div>
  );
}