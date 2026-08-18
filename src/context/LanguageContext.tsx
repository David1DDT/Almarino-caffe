"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ro" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ro: {
    // Nav Header
    "nav.home": "Acasă",
    "nav.menu": "Meniu Complet",
    "nav.cinema": "Almarino 3D Stage",
    "nav.reviews": "Recenzii 5.0",
    "nav.location": "Locație",
    "nav.status": "Deschis • Alba Iulia • 5.0 Rating",
    "nav.admin": "Admin Panel",

    // Cinema Scroll Story Panels
    "cinema.hero_tag": "Cafenea Artizanală & Espresso Bar • Alba Iulia",
    "cinema.hero_reviews": "455+ Recenzii",
    "cinema.panel2_title": "Pasiune. Cafea de Origine.",
    "cinema.panel2_desc": "Experiență artizanală proaspătă și atmosferă caldă creată de o echipă dedicată pasionată de espresso.",
    "cinema.panel2_stat_reviews": "Recenzii Clienți",
    "cinema.complete_menu": "Meniu complet",
    "cinema.stage_title": "Experiență Espresso & Specialități Artizanale.",
    "cinema.stage_subtitle": "Selecții speciale espresso, Kyoto cold drip 14 ore și băuturi de origine preparate cu măiestrie.",
    "cinema.prev": "Selecție anterioară",
    "cinema.next": "Selecție următoare",
    "cinema.kicker_espresso": "Espresso Bar • Premium",
    "cinema.kicker_specialty": "Băutură Specială • Recomandat",
    "cinema.kicker_cold": "Cold Brew & Infuzii • Răcoritor",
    "cinema.kicker_beans": "Pachet Sigilat • Origine Pură",
    "cinema.kicker_tea": "Selecție Gourmet",
    "cinema.fresh_beans": "Pachet sigilat proaspăt",
    "cinema.fresh_beverage": "Băutură preparată pe loc",
    "cinema.origin_prefix": "Origine: Almarino Caffè",

    // Home Page - Reviews & Location
    "home.reviews_badge": "5.0 ★ Overall Rating",
    "home.reviews_title": "Ce Spun Oaspeții",
    "home.reviews_title_italic": "Almarino Caffè",
    "home.reviews_sub": "Peste 455 de recenzii verificate pe Google și Tripadvisor din partea iubitorilor de cafea artizanală.",
    "home.review1": "Cea mai bună cafea de specialitate din Alba Iulia! Atmosferă primitoare și barista cu adevărat pasionați.",
    "home.review2": "Cold brew-ul lor infuzat 14 ore este spectaculos. Un loc de neratat când treci prin oraș.",
    "home.review3": "Arome unice, servire impecabilă și cel mai bun cappuccino din județ.",
    "home.location_badge": "Locație Alba Iulia",
    "home.location_title": "Vizitează Almarino Caffè",
    "home.location_sub": "Te așteptăm în Alba Iulia cu cafea proaspăt preparată și atmosferă relaxantă.",
    "home.phone_label": "Telefon & Rezervări",
    "home.hours_title": "Program Zilnic",
    "home.hours_time": "07:30 – 21:30",
    "home.maps_btn": "Deschide Harta Google",

    // Footer
    "footer.title": "ALMARINO CAFFÈ",
    "footer.desc": "Cafenea artizanală cu un rating de 5.0 ★ în Alba Iulia. Selecții de cafea de origine de calitate superioară și servire caldă.",
    "footer.nav": "Navigare Rapidă",
    "footer.link_cinema": "Cinema Stage",
    "footer.link_menu": "Meniu Cafenea",
    "footer.link_customizer": "Brew Lab Customizer",
    "footer.link_reviews": "Recenzii 5.0★",
    "footer.link_location": "Locație Alba Iulia",
    "footer.contact_title": "Contact Direct",
    "footer.address": "Bulevardul 1 Decembrie 1918 M4, Alba Iulia",
    "footer.phone": "Telefon: 0732 445 005",

    // Menu Page
    "menu.badge": "Meniu Specialitate & Preparate Pe Loc",
    "menu.title_prefix": "Meniu Artizanal",
    "menu.title_brand": "Almarino Caffè",
    "menu.subtitle": "Descoperă selecția noastră completă de cafele de origine de la espresso bar, băuturi cold brew infuzate timp de 14 ore și preparate artizanale de calitate superioară.",
    "menu.all": "Toate Produsele",
    "menu.espresso": "Espresso Bar",
    "menu.specialty": "Băuturi Speciale",
    "menu.cold": "Cold Brew & Infuzii",
    "menu.beans": "Pachete Cafea Boabe",
    "menu.tea": "Ceai & Ciocolată",
    "menu.search_placeholder": "Caută un preparat...",
    "menu.showing": "Se afișează",
    "menu.products_unit": "produse din meniu",
    "menu.empty": "Nu s-au găsit produse în această categorie.",
    "menu.currency": "lei",
    "menu.admin_link": "⚙️ Admin Panel",
    "menu.back_home": "← ACASĂ",

    // Admin Panel Page
    "admin.title": "Panou Administrare & Supabase",
    "admin.connected": "Conectat la Supabase",
    "admin.demo": "Mod Demo / Local",
    "admin.seed": "⚡ Populează Supabase",
    "admin.view_menu": "Vezi Meniul →",
    "admin.new_product": "+ Produs Nou",
    "admin.logout": "🔒 Deconectare",
    "admin.stat_total": "Total Produse",
    "admin.stat_avg": "Preț Mediu",
    "admin.stat_categories": "Categorii Active",
    "admin.stat_storage": "Supabase Storage",
    "admin.search_placeholder": "Caută produs...",
    "admin.col_image": "Imagine",
    "admin.col_name": "Nume Produs",
    "admin.col_category": "Categorie",
    "admin.col_price": "Preț",
    "admin.col_actions": "Acțiuni",
    "admin.edit": "Editează",
    "admin.delete": "Șterge",
    "admin.login_title": "Autentificare Admin Almarino",
    "admin.login_desc": "Introdu datele contului din Supabase Auth pentru acces.",
    "admin.email": "Email Admin",
    "admin.password": "Parolă",
    "admin.login_btn": "Autentificare",
  },
  en: {
    // Nav Header
    "nav.home": "Home",
    "nav.menu": "Full Menu",
    "nav.cinema": "Almarino 3D Stage",
    "nav.reviews": "5.0 Reviews",
    "nav.location": "Location",
    "nav.status": "Open • Alba Iulia • 5.0 Rating",
    "nav.admin": "Admin Panel",

    // Cinema Scroll Story Panels
    "cinema.hero_tag": "Artisanal Coffee Shop & Espresso Bar • Alba Iulia",
    "cinema.hero_reviews": "455+ Reviews",
    "cinema.panel2_title": "Passion. Single-Origin Coffee.",
    "cinema.panel2_desc": "Fresh artisanal experience and a warm ambiance created by a dedicated team passionate about espresso.",
    "cinema.panel2_stat_reviews": "Customer Reviews",
    "cinema.complete_menu": "Full Menu",
    "cinema.stage_title": "Espresso Experience & Artisanal Specialties.",
    "cinema.stage_subtitle": "Special espresso selections, 14-hour Kyoto cold drip, and masterfully prepared origin drinks.",
    "cinema.prev": "Previous selection",
    "cinema.next": "Next selection",
    "cinema.kicker_espresso": "Espresso Bar • Premium",
    "cinema.kicker_specialty": "Specialty Drink • Recommended",
    "cinema.kicker_cold": "Cold Brew & Infusions • Refreshing",
    "cinema.kicker_beans": "Sealed Bag • Pure Origin",
    "cinema.kicker_tea": "Gourmet Selection",
    "cinema.fresh_beans": "Freshly sealed coffee bag",
    "cinema.fresh_beverage": "Freshly prepared beverage",
    "cinema.origin_prefix": "Origin: Almarino Caffè",

    // Home Page - Reviews & Location
    "home.reviews_badge": "5.0 ★ Overall Rating",
    "home.reviews_title": "What Our Guests Say",
    "home.reviews_title_italic": "Almarino Caffè",
    "home.reviews_sub": "Over 455 verified reviews on Google & Tripadvisor from specialty coffee lovers.",
    "home.review1": "The best specialty coffee in Alba Iulia! Welcoming atmosphere and truly passionate baristas.",
    "home.review2": "Their 14-hour cold brew is spectacular. A must-visit spot when traveling through town.",
    "home.review3": "Unique flavors, flawless service, and the best cappuccino in the region.",
    "home.location_badge": "Alba Iulia Location",
    "home.location_title": "Visit Almarino Caffè",
    "home.location_sub": "We welcome you in Alba Iulia with freshly brewed coffee and a relaxing ambiance.",
    "home.phone_label": "Phone & Reservations",
    "home.hours_title": "Daily Schedule",
    "home.hours_time": "07:30 – 21:30",
    "home.maps_btn": "Open Google Maps",

    // Footer
    "footer.title": "ALMARINO CAFFÈ",
    "footer.desc": "Artisanal coffee shop rated 5.0 ★ in Alba Iulia. Premium single-origin coffee selections served warm.",
    "footer.nav": "Quick Navigation",
    "footer.link_cinema": "Cinema Stage",
    "footer.link_menu": "Coffee Menu",
    "footer.link_customizer": "Brew Lab Customizer",
    "footer.link_reviews": "5.0★ Reviews",
    "footer.link_location": "Alba Iulia Location",
    "footer.contact_title": "Direct Contact",
    "footer.address": "Bulevardul 1 Decembrie 1918 M4, Alba Iulia",
    "footer.phone": "Phone: 0732 445 005",

    // Menu Page
    "menu.badge": "Specialty Menu & Freshly Prepared",
    "menu.title_prefix": "Artisanal Menu",
    "menu.title_brand": "Almarino Caffè",
    "menu.subtitle": "Discover our complete selection of single-origin coffees from espresso bar, 14-hour infused cold brew, and premium artisanal drinks.",
    "menu.all": "All Products",
    "menu.espresso": "Espresso Bar",
    "menu.specialty": "Specialty Drinks",
    "menu.cold": "Cold Brew & Infusions",
    "menu.beans": "Whole Bean Coffee",
    "menu.tea": "Tea & Chocolate",
    "menu.search_placeholder": "Search a drink or bean...",
    "menu.showing": "Showing",
    "menu.products_unit": "menu items",
    "menu.empty": "No products found in this category.",
    "menu.currency": "RON",
    "menu.admin_link": "⚙️ Admin Panel",
    "menu.back_home": "← HOME",

    // Admin Panel Page
    "admin.title": "Admin Panel & Supabase",
    "admin.connected": "Connected to Supabase",
    "admin.demo": "Demo / Local Mode",
    "admin.seed": "⚡ Seed Supabase",
    "admin.view_menu": "View Menu →",
    "admin.new_product": "+ New Product",
    "admin.logout": "🔒 Logout",
    "admin.stat_total": "Total Products",
    "admin.stat_avg": "Average Price",
    "admin.stat_categories": "Active Categories",
    "admin.stat_storage": "Supabase Storage",
    "admin.search_placeholder": "Search product...",
    "admin.col_image": "Image",
    "admin.col_name": "Product Name",
    "admin.col_category": "Category",
    "admin.col_price": "Price",
    "admin.col_actions": "Actions",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    "admin.login_title": "Almarino Admin Login",
    "admin.login_desc": "Enter your Supabase Auth credentials to log in.",
    "admin.email": "Admin Email",
    "admin.password": "Password",
    "admin.login_btn": "Log In",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "ro",
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ro");

  useEffect(() => {
    const saved = localStorage.getItem("almarino_lang") as Language;
    if (saved === "ro" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("almarino_lang", newLang);
  };

  const toggleLang = () => {
    const next = lang === "ro" ? "en" : "ro";
    setLang(next);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["ro"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
