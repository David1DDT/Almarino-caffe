"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d49b4b]/15 border border-[#d49b4b]/40 text-[#d49b4b] hover:bg-[#d49b4b]/30 font-mono text-xs font-black tracking-wider transition-all duration-300 shadow-sm cursor-pointer active:scale-95 ${className}`}
      aria-label="Toggle language between Romanian and English"
      title={lang === "ro" ? "Switch to English" : "Schimbă în Română"}
    >
      <span className="text-xs">{lang === "ro" ? "🇷🇴 RO" : "🇬🇧 EN"}</span>
      <span className="text-[10px] text-[#d49b4b]/60 font-sans font-bold">
        ➔ {lang === "ro" ? "EN" : "RO"}
      </span>
    </button>
  );
}
