"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import CoffeeScene from "./CoffeeScene";
import { supabase, getSupabaseImageUrl } from "@/lib/supabase";

interface SightCard {
  id: string;
  kicker: string;
  title: string;
  desc: string;
  origin: string;
  score: string;
  tags: string[];
  sizes: string[];
  type: string;
  image: string;
}

const COFFEE_SIGHTS: SightCard[] = [
  {
    id: "yirgacheffe",
    kicker: "Single Origin • Light Roast",
    title: "Ethiopian Yirgacheffe Bloom",
    desc: "Note florale elegante cu bergamotă proaspătă și dulceață de miere sălbatică.",
    origin: "Origine: Ethiopia",
    score: "28.00 lei",
    tags: ["Iasomie", "Bergamotă", "Miere Sălbatică"],
    sizes: ["250g", "500g", "1kg"],
    type: "Pachet sigilat proaspăt",
    image: getSupabaseImageUrl("/images/ethiopian_yirgacheffe.jpg"),
  },
  {
    id: "colombia",
    kicker: "Popular • Medium Roast",
    title: "Colombian Supremo Reserve",
    desc: "Corp catifelat cu accente de ciocolată, nuci prăjite și cremă bogată de caramel.",
    origin: "Origine: Colombia",
    score: "26.00 lei",
    tags: ["Caramel", "Nuci Prăjite", "Cacao"],
    sizes: ["250g", "500g", "1kg"],
    type: "Pachet sigilat proaspăt",
    image: getSupabaseImageUrl("/images/soho_artisan_cafe.jpg"),
  },
  {
    id: "guatemala",
    kicker: "Organic • Dark Roast",
    title: "Guatemalan Antigua Dark",
    desc: "Note intense de ciocolată neagră și condimente calde de nucșoară.",
    origin: "Origine: Guatemala",
    score: "30.00 lei",
    tags: ["Ciocolată Neagră", "Nucșoară", "Zahăr Brun"],
    sizes: ["250g", "500g", "1kg"],
    type: "Pachet sigilat proaspăt",
    image: getSupabaseImageUrl("/images/ethiopian_yirgacheffe.jpg"),
  },
  {
    id: "kyoto-coldbrew",
    kicker: "Ediție Limitată • Cold Brew",
    title: "Kyoto Drip Cold Brew",
    desc: "Extracție picătură cu picătură timp de 14 ore peste lemn de stejar ars.",
    origin: "Origine: Almarino Drip Bar",
    score: "25.00 lei",
    tags: ["Stejar", "Cireșe", "Cacao Pură"],
    sizes: ["12 oz", "16 oz", "20 oz"],
    type: "Băutură preparată pe loc",
    image: getSupabaseImageUrl("/images/cold_brew_nitro.jpg"),
  },
  {
    id: "madagascar-latte",
    kicker: "Recomandarea Alexandru",
    title: "Madagascar Vanilla Latte",
    desc: "Espresso dublu cu sirop artizanal de păstăi de vanilie de Madagascar și lapte cremos.",
    origin: "Origine: Specialitatea Casei",
    score: "27.00 lei",
    tags: ["Păstăi Vanilie", "Double Espresso", "Cremă Lapte"],
    sizes: ["12 oz", "16 oz", "20 oz"],
    type: "Băutură preparată pe loc",
    image: getSupabaseImageUrl("/images/vanilla_latte.jpg"),
  },
  {
    id: "nitro-mocha",
    kicker: "Răcoritor • Draft Beverage",
    title: "Nitro Draft Mocha",
    desc: "Cold brew la dozator infuzat cu azot și ciocolată bio cremoasă.",
    origin: "Origine: Draft Bar",
    score: "28.00 lei",
    tags: ["Ciocolată", "Spumă Azot", "Dozator Cold Brew"],
    sizes: ["12 oz", "16 oz", "20 oz"],
    type: "Băutură preparată pe loc",
    image: getSupabaseImageUrl("/images/cold_brew_nitro.jpg"),
  },
];

export default function CinematicCoffeeScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [sights, setSights] = useState<SightCard[]>(COFFEE_SIGHTS);
  const [selectedRoast, setSelectedRoast] = useState<"light" | "medium" | "dark">("medium");
  const [activeSight, setActiveSight] = useState(COFFEE_SIGHTS.length * 2); // start in middle set (index 12)
  const [isReady, setIsReady] = useState(false);

  // Animation Engine State
  const targetScrollRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const rafPendingRef = useRef(false);
  const initializedRef = useRef(false);

  // Fetch top 10 products from Supabase DB
  useEffect(() => {
    async function loadTop10FromDb() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true })
          .limit(10);

        if (!error && data && data.length > 0) {
          const mapped: SightCard[] = data.map((item: Record<string, unknown>, idx: number) => {
            const price = Number(item.basePrice ?? item.base_price ?? item.price ?? 15);
            const category = String(item.category || "espresso");
            const categoryKicker =
              category === "espresso"
                ? "Espresso Bar • Premium"
                : category === "specialty"
                ? "Băutură Specială • Recomandat"
                : category === "cold"
                ? "Cold Brew & Infuzii • Răcoritor"
                : category === "beans"
                ? "Pachet Sigilat • Origine Pură"
                : "Selecție Gourmet";

            return {
              id: `db-${item.id || idx}`,
              kicker: categoryKicker,
              title: String(item.name || `Produs #${idx + 1}`),
              desc: String(item.desc || item.description || "Note bogate și aromă inconfundabilă Almarino Caffè."),
              origin: `Origine: Almarino Caffè • ${category.toUpperCase()}`,
              score: `${price.toFixed(2)} lei`,
              tags: [category.toUpperCase(), "Artizanal", "Proaspăt"],
              sizes: category === "beans" ? ["250g", "500g", "1kg"] : ["12 oz", "16 oz", "20 oz"],
              type: category === "beans" ? "Pachet sigilat proaspăt" : "Băutură preparată pe loc",
              image: getSupabaseImageUrl(String(item.image || item.image_url || "")),
            };
          });
          setSights(mapped);
          setActiveSight(mapped.length * 2);
        }
      } catch (err) {
        console.warn("Could not fetch top 10 products for cinema scroll:", err);
      }
    }
    loadTop10FromDb();
  }, []);

  const infiniteSights = useMemo(() => {
    return [
      ...sights,
      ...sights,
      ...sights,
      ...sights,
      ...sights,
    ].map((item, idx) => ({
      ...item,
      uniqueId: `${item.id}-${idx}`,
      idx,
    }));
  }, [sights]);

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smoothstep = (e0: number, e1: number, v: number) => {
    const x = clamp((v - e0) / (e1 - e0));
    return x * x * (3 - 2 * x);
  };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const segmentInOut = (s: number, a: number, b: number, c: number, d: number) => {
    const enter = smoothstep(a, b, s);
    const exit = smoothstep(c, d, s);
    return { enter, exit, active: enter * (1 - exit) };
  };

  const getScrollDistance = useCallback(() => {
    if (!scrollRef.current) return 0;
    const rect = scrollRef.current.getBoundingClientRect();
    const maxScroll = scrollRef.current.offsetHeight - window.innerHeight;
    return clamp(-rect.top, 0, maxScroll);
  }, []);

  // Frame-by-frame exact scroll choreography update
  const updateChoreography = useCallback(() => {
    rafPendingRef.current = false;

    if (!scrollRef.current) return;
    const targetScroll = getScrollDistance();
    targetScrollRef.current = targetScroll;

    if (!initializedRef.current) {
      smoothScrollRef.current = targetScroll;
      initializedRef.current = true;
    } else {
      smoothScrollRef.current = lerp(smoothScrollRef.current, targetScrollRef.current, 0.14);
    }
    if (Math.abs(smoothScrollRef.current - targetScrollRef.current) < 0.08) {
      smoothScrollRef.current = targetScrollRef.current;
    }

    smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, targetMouseRef.current.x, 0.12);
    smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, targetMouseRef.current.y, 0.12);

    const s = smoothScrollRef.current;
    const mouseX = smoothMouseRef.current.x;
    const mouseY = smoothMouseRef.current.y;

    const isMobile = window.innerWidth < 768;

    // Exact Mostar segment mathematics
    const frame2 = segmentInOut(s, 560, 900, 1300, 1620);
    const frame3 = segmentInOut(s, 1760, 2140, 2540, 2700);
    const progress = clamp(s / 2700);
    const introExit = smoothstep(90, 650, s);
    const sightsEnterRaw = smoothstep(2760, 3560, s);
    const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
    const sightsControlsEnter = smoothstep(3360, 3660, s);
    const blurActive = clamp(frame2.active + frame3.active);
    const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
    const splitDrift = Math.pow(frame2.enter, 1.5);
    const sharedHeroY = progress * -74;
    const sharedHeroScale = progress * 0.23;

    const sightsScreenTop = Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
    const sightsParentTop = isMobile
      ? window.innerHeight * 0.22
      : window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

    const root = scrollRef.current;
    root.style.setProperty("--mx", mouseX.toFixed(4));
    root.style.setProperty("--my", mouseY.toFixed(4));

    root.style.setProperty("--back-opacity", (1 - frame2.active * 0.06).toFixed(4));
    root.style.setProperty("--back-x", `${(mouseX * -12).toFixed(2)}px`);
    root.style.setProperty("--back-y", `${(mouseY * -4).toFixed(2)}px`);
    root.style.setProperty("--back-scale", backScale.toFixed(4));

    root.style.setProperty("--blur-px", `${(blurActive * 14).toFixed(2)}px`);
    root.style.setProperty("--back-brightness", (1 - blurActive * 0.255).toFixed(4));

    root.style.setProperty("--title-y", `${(introExit * -210).toFixed(2)}px`);
    root.style.setProperty("--title-scale", (1 - introExit * 0.08).toFixed(4));
    root.style.setProperty("--title-opacity", (1 - introExit).toFixed(4));

    const isMobileDevice = window.innerWidth < 768;
    const driftAmount = isMobileDevice ? 22 : 46;

    root.style.setProperty("--split-left-x", `calc(-50% + ${(-splitDrift * driftAmount).toFixed(2)}vw + ${(mouseX * 22).toFixed(2)}px)`);
    root.style.setProperty("--split-left-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
    root.style.setProperty("--split-left-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));
    root.style.setProperty("--split-right-x", `calc(-50% + ${(splitDrift * driftAmount).toFixed(2)}vw + ${(mouseX * 22).toFixed(2)}px)`);
    root.style.setProperty("--split-right-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
    root.style.setProperty("--split-right-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));

    const panel2X = (1 - frame2.enter) * 80 - frame2.exit * 80;
    const panel3X = -(1 - frame3.enter) * 80 + frame3.exit * 80;

    root.style.setProperty("--panel2-opacity", (frame2.active * (1 - frame2.exit)).toFixed(4));
    root.style.setProperty("--panel2-x", `${panel2X.toFixed(2)}vw`);
    root.style.setProperty("--panel2-y", `${(-frame2.exit * 40 + (1 - frame2.enter) * 30).toFixed(2)}px`);

    root.style.setProperty("--panel3-opacity", (frame3.active * (1 - frame3.exit)).toFixed(4));
    root.style.setProperty("--panel3-x", `${panel3X.toFixed(2)}vw`);
    root.style.setProperty("--panel3-y", `${(-frame3.exit * 40 + (1 - frame3.enter) * 30).toFixed(2)}px`);

    root.style.setProperty("--sights-opacity", sightsEnter.toFixed(4));
    root.style.setProperty("--sights-controls-opacity", sightsControlsEnter.toFixed(4));
    setIsReady(sightsControlsEnter > 0.98);

    root.style.setProperty("--sights-visibility", sightsEnter > 0.01 ? "visible" : "hidden");
    root.style.setProperty("--sights-enter-x", `${((1 - sightsEnter) * 420).toFixed(2)}vw`);
    root.style.setProperty("--sights-scale", isMobile ? "1" : (1 / backScale).toFixed(4));
    root.style.setProperty("--sights-top", `${sightsParentTop.toFixed(2)}px`);

    if (
      Math.abs(smoothScrollRef.current - targetScrollRef.current) > 0.08 ||
      Math.abs(smoothMouseRef.current.x - targetMouseRef.current.x) > 0.001 ||
      Math.abs(smoothMouseRef.current.y - targetMouseRef.current.y) > 0.001
    ) {
      requestTick();
    }
  }, [getScrollDistance]);

  const requestTick = useCallback(() => {
    if (!rafPendingRef.current) {
      rafPendingRef.current = true;
      requestAnimationFrame(updateChoreography);
    }
  }, [updateChoreography]);

  useEffect(() => {
    const handleScroll = () => requestTick();
    const handleResize = () => requestTick();
    const handlePointerMove = (e: PointerEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
      requestTick();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    requestTick();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [requestTick]);

  // Update carousel position on activeSight or resize
  const updateTrackPosition = useCallback(() => {
    if (!trackRef.current) return;
    const card = trackRef.current.children[0] as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(trackRef.current).gap || "16");
    const shift = -((cardWidth + gap) * activeSight);
    trackRef.current.style.transform = `translate3d(calc(${shift}px - 18vw), 0, 0)`;
  }, [activeSight]);

  useEffect(() => {
    updateTrackPosition();
    window.addEventListener("resize", updateTrackPosition);
    return () => window.removeEventListener("resize", updateTrackPosition);
  }, [updateTrackPosition]);

  const handleCardClick = (card: typeof infiniteSights[0]) => {
    const N = COFFEE_SIGHTS.length;
    const baseIdx = card.idx % N;
    // Find candidate index closest to current activeSight to ensure short, smooth animation
    const candidates = [baseIdx, baseIdx + N, baseIdx + N * 2, baseIdx + N * 3, baseIdx + N * 4];
    let closest = candidates[0];
    let minDiff = Math.abs(candidates[0] - activeSight);
    for (let i = 1; i < candidates.length; i++) {
      const diff = Math.abs(candidates[i] - activeSight);
      if (diff < minDiff) {
        minDiff = diff;
        closest = candidates[i];
      }
    }
    setActiveSight(closest);
  };

  const handleTransitionEnd = (e?: React.TransitionEvent<HTMLDivElement>) => {
    if (e && (e.target !== e.currentTarget || e.propertyName !== "transform")) return;
    const origCount = COFFEE_SIGHTS.length;
    const minBound = origCount * 2; // 12
    const maxBound = origCount * 3; // 18

    if (activeSight >= maxBound || activeSight < minBound) {
      const normalized = (activeSight % origCount) + origCount * 2;
      if (trackRef.current) trackRef.current.style.transition = "none";
      setActiveSight(normalized);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = "transform 640ms cubic-bezier(0.22, 1, 0.36, 1)";
          }
        });
      });
    }
  };

  return (
    <div ref={scrollRef} className="relative h-[calc(100vh+3700px)] w-full">
      {/* 3700px Sticky Stage Container */}
      <div className="sticky top-0 h-screen min-h-[620px] overflow-hidden bg-[#1a0f0a] isolation-isolate">
        
        {/* Background Ambient Glow Layer - Rich Warm Brown */}
        <div className="absolute inset-0 z-0 opacity-85 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#d49b4b]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#b86b32]/25 rounded-full blur-3xl"></div>
        </div>

        {/* 3D WebGL Canvas Layer */}
        <div
          className="absolute inset-0 z-1 pointer-events-none transition-[filter]"
          style={{
            filter: "blur(var(--blur-px, 0px)) brightness(var(--back-brightness, 1))",
          }}
        >
          <CoffeeScene roast={selectedRoast} />
        </div>

        {/* Hero Title Layer (Frame 1: 0 - 650px) - Perfectly Centered Almarino Caffè */}
        <div
          className="absolute inset-x-0 top-[clamp(90px,14vh,180px)] z-3 flex flex-col items-center justify-center text-center px-4 w-full pointer-events-auto"
          style={{
            transform: "translate3d(0, var(--title-y, 0px), 0) scale(var(--title-scale, 1))",
            opacity: "var(--title-opacity, 1)",
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center w-full px-2">
            <h1 className="text-4xl sm:text-7xl md:text-8xl font-serif font-black text-[#fdfbf7] tracking-tight leading-none text-center drop-shadow-2xl pointer-events-auto w-full break-words">
              ALMARINO CAFFÈ
            </h1>
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#25160d]/80 border border-[#d49b4b]/40 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#d49b4b] font-extrabold">
                Cafenea Artizanală & Espresso Bar • Alba Iulia
              </span>
            </div>
          </div>
        </div>

        {/* Splitframe Floating Bean Accent Layers */}
        <div
          className="absolute left-1/2 bottom-[-2vh] w-[min(100vw,2240px)] -translate-x-1/2 z-6 flex justify-between px-4 sm:px-12 pointer-events-none"
          style={{
            transform: "translate3d(var(--split-left-x, -50%), var(--split-left-y, 0px), 0) scale(var(--split-left-scale, 1))",
          }}
        >
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[#25160d]/95 border border-[#d49b4b]/40 backdrop-blur-xl p-4 animate-float-slow shadow-2xl pointer-events-auto">
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-[#d49b4b] block">5.0 ★ Google Rating</span>
            <span className="font-serif text-sm sm:text-lg font-bold text-[#fdfbf7] block mt-1">455+ Recenzii</span>
          </div>
        </div>

        <div
          className="absolute left-1/2 bottom-[-2vh] w-[min(100vw,2240px)] -translate-x-1/2 z-6 flex justify-end px-4 sm:px-12 pointer-events-none"
          style={{
            transform: "translate3d(var(--split-right-x, -50%), var(--split-right-y, 0px), 0) scale(var(--split-right-scale, 1))",
          }}
        >
          <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-[#25160d]/95 border border-[#b86b32]/40 backdrop-blur-xl p-4 sm:p-6 animate-float-medium shadow-2xl pointer-events-auto">
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-[#cd7b3c] block">Pasiune & Calitate</span>
            <span className="font-serif text-base sm:text-xl font-bold text-[#d49b4b] block mt-1">Barista Alexandru</span>
          </div>
        </div>

        {/* Story Panel 2: Direct Trade & Origins (Frame 2: 560 - 1620px) - Comes from the RIGHT */}
        <div
          className="absolute inset-x-0 mx-auto top-[50%] -translate-y-1/2 w-[min(720px,calc(100vw-32px))] z-10 text-center transition-all pointer-events-auto px-4"
          style={{
            opacity: "var(--panel2-opacity, 0)",
            transform: "translate3d(var(--panel2-x, 0vw), var(--panel2-y, 0px), 0)",
          }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-[#d49b4b] mb-3 sm:mb-4 drop-shadow-md leading-tight text-center">
            Pasiune. Cafea de Origine.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#fdfbf7]/90 max-w-lg mx-auto font-medium leading-relaxed text-center">
            Prăjire artizanală proaspătă și atmosferă caldă creată de o echipă dedicată pasionată de espresso.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-md mx-auto mt-6 sm:mt-8 font-mono text-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-[#25160d]/90 border border-[#b86b32]/40 backdrop-blur-md shadow-lg">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#d49b4b] block">5.0</span>
              <span className="text-[10px] sm:text-xs text-[#fdfbf7]/90 font-bold uppercase tracking-wider mt-1 block">Google & Tripadvisor</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-[#25160d]/90 border border-[#b86b32]/40 backdrop-blur-md shadow-lg">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#d49b4b] block">455+</span>
              <span className="text-[10px] sm:text-xs text-[#fdfbf7]/90 font-bold uppercase tracking-wider mt-1 block">Recenzii Clienti</span>
            </div>
          </div>
        </div>

        {/* Story Panel 3: Brew Lab & Customization (Frame 3: 1760 - 2700px) - Comes from the LEFT */}
        <div
          className="absolute inset-x-0 mx-auto top-[50%] -translate-y-1/2 w-[min(720px,calc(100vw-32px))] z-10 text-center transition-all pointer-events-auto px-4"
          style={{
            opacity: "var(--panel3-opacity, 0)",
            transform: "translate3d(var(--panel3-x, 0vw), var(--panel3-y, 0px), 0)",
          }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-[#d49b4b] mb-3 sm:mb-4 drop-shadow-md leading-tight text-center">
            Prăjitorie & Meniu Espresso.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#fdfbf7]/90 max-w-lg mx-auto font-medium mb-5 sm:mb-6 leading-relaxed text-center">
            Selecții speciale espresso, Kyoto cold drip 14 ore și personalizarea pachetelor de cafea.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {(["light", "medium", "dark"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRoast(r)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border pointer-events-auto transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  selectedRoast === r
                    ? "bg-[#d49b4b] text-[#1a0f0a] font-black border-transparent shadow-xl ring-2 ring-[#d49b4b]/60"
                    : "bg-[#b86b32]/25 border-[#b86b32]/40 text-[#fdfbf7] hover:bg-[#b86b32]/40 backdrop-blur-md"
                }`}
              >
                {r} Roast
              </button>
            ))}
          </div>
        </div>

        {/* Micro-Lot Carousel Layer (Frame 4: 2760 - 3560px) */}
        <div
          className="absolute left-0 right-0 z-12 transition-all pointer-events-auto"
          style={{
            top: "var(--sights-top, 180px)",
            opacity: "var(--sights-opacity, 0)",
            visibility: "var(--sights-visibility, hidden)" as any,
            transform: "translate3d(var(--sights-enter-x, 420vw), 0, 0) scale(var(--sights-scale, 1))",
            transformOrigin: "0 0",
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 items-stretch transition-transform duration-[640ms] cubic-bezier(0.22, 1, 0.36, 1)"
            onTransitionEnd={handleTransitionEnd}
          >
            {infiniteSights.map((card) => {
              const isActive = card.idx === activeSight;
              return (
                <div
                  key={card.uniqueId}
                  onClick={() => handleCardClick(card)}
                  className={`relative flex-none w-[clamp(300px,85vw,380px)] sm:w-[clamp(340px,26vw,380px)] p-4 sm:p-5 rounded-3xl border transition-all duration-300 pointer-events-auto cursor-pointer select-none backdrop-blur-xl flex flex-col justify-between overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-b from-[#2e1a10] to-[#1e100a] text-[#fdfbf7] border-[#d49b4b] ring-2 ring-[#d49b4b]/50 shadow-[0_10px_40px_rgba(212,155,75,0.25)] scale-[1.03]"
                      : "bg-[#25160d]/80 text-[#fdfbf7]/80 border-[#b86b32]/30 hover:border-[#d49b4b]/60 opacity-80 hover:opacity-100 scale-100"
                  }`}
                >
                  <div>
                    {/* Product Photo Thumbnail */}
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-3 border border-[#d49b4b]/20">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded font-mono text-[8px] font-black uppercase tracking-wider bg-[#1a0f0a]/90 text-[#d49b4b] border border-[#d49b4b]/40 shadow-xs">
                        {card.kicker}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-base sm:text-lg font-serif font-black ${isActive ? "text-[#fdfbf7]" : "text-[#fdfbf7]/90"}`}>
                        {card.title}
                      </h3>
                      <span className={`font-serif font-black text-sm sm:text-base ${isActive ? "text-[#d49b4b]" : "text-[#d49b4b]/80"}`}>
                        {card.score}
                      </span>
                    </div>

                    <p className={`font-mono text-[9px] font-bold uppercase tracking-wider mb-2.5 ${isActive ? "text-[#cd7b3c]" : "text-[#d49b4b]/70"}`}>
                      {card.origin}
                    </p>

                    {/* Flavor Notes Tags */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? "bg-[#d49b4b]/20 border-[#d49b4b]/50 text-[#e5ac5d]"
                              : "bg-[#d49b4b]/10 border-[#d49b4b]/20 text-[#d49b4b]/80"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className={`text-xs font-medium line-clamp-2 leading-relaxed mb-3 ${isActive ? "text-[#fdfbf7]/90" : "text-[#fdfbf7]/70"}`}>
                      {card.desc}
                    </p>
                  </div>

                  {/* Card Footer: Portion Sizes & Type */}
                  <div className={`pt-2.5 border-t flex justify-between items-center font-mono text-[9px] font-extrabold ${isActive ? "border-[#d49b4b]/30 text-[#fdfbf7]/80" : "border-[#fdfbf7]/15 text-[#fdfbf7]/60"}`}>
                    <span>{card.type}</span>
                    <span className={`px-2 py-0.5 rounded ${isActive ? "bg-[#d49b4b] text-[#1a0f0a] font-black" : "bg-[#d49b4b]/20 text-[#d49b4b]"}`}>
                      {card.sizes.join(" • ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Controls (3360 - 3660px) */}
        <div
          className={`absolute left-6 sm:left-12 bottom-8 sm:bottom-12 z-20 flex gap-3 sm:gap-4 transition-all ${
            isReady ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{ opacity: "var(--sights-controls-opacity, 0)" }}
        >
          <button
            type="button"
            onClick={() => setActiveSight((prev) => prev - 1)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#d49b4b] text-[#1a0f0a] font-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer pointer-events-auto ring-2 ring-[#d49b4b]/40"
            aria-label="Selection anterioara"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveSight((prev) => prev + 1)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#d49b4b] text-[#1a0f0a] font-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer pointer-events-auto ring-2 ring-[#d49b4b]/40"
            aria-label="Selection urmatoare"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
