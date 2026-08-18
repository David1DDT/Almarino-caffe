"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase, SupabaseProduct, uploadImageToSupabase, uploadLocalImageToStorage, getSupabaseImageUrl } from "@/lib/supabase";

const INITIAL_PRODUCTS: SupabaseProduct[] = [
  // Espresso Bar
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

  // Băuturi Speciale
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

  // Cold Brew & Infuzii
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

  // Pachete Cafea de Origine
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

  // Ceai & Ciocolată
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
];

export default function AdminPage() {
  const [products, setProducts] = useState<SupabaseProduct[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupabaseProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<SupabaseProduct | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<SupabaseProduct, "id">>({
    name: "",
    category: "espresso",
    desc: "",
    basePrice: 15,
    image: "/images/soho_artisan_cafe.jpg",
  });

  // Session Check Effect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data.session) {
        setIsAuthenticated(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Eroare autentificare Supabase Auth.";
      setAuthError(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    setStatusMessage("Se încarcă imaginea în Supabase Storage...");
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setFormData((prev) => ({ ...prev, image: publicUrl }));
      setStatusMessage("Imagine încărcată cu succes!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage(`Eroare încărcare imagine: ${msg}`);
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const categories = [
    { id: "all", label: "Toate Produsele" },
    { id: "espresso", label: "Espresso Bar" },
    { id: "specialty", label: "Băuturi Speciale" },
    { id: "cold", label: "Cold Brew & Infuzii" },
    { id: "beans", label: "Pachete Cafea Boabe" },
    { id: "tea", label: "Ceai & Ciocolată" },
  ];

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.warn("Supabase fetch warning:", error.message);
        setIsSupabaseConnected(false);
        setProducts(INITIAL_PRODUCTS);
      } else if (data && data.length > 0) {
        setIsSupabaseConnected(true);
        const normalized = data.map((item: Record<string, unknown>) => ({
          id: item.id as number | string,
          name: String(item.name || ""),
          category: (item.category || "espresso") as SupabaseProduct["category"],
          desc: String(item.desc || item.description || ""),
          basePrice: Number(item.basePrice ?? item.base_price ?? item.price ?? 15),
          image: getSupabaseImageUrl(String(item.image || item.image_url || "")),
        }));
        setProducts(normalized);
      } else {
        setIsSupabaseConnected(true);
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (err) {
      console.warn("Supabase connection error:", err);
      setIsSupabaseConnected(false);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const avgPrice = total > 0 ? (products.reduce((acc, p) => acc + p.basePrice, 0) / total).toFixed(2) : "0";
    const beansCount = products.filter((p) => p.category === "beans").length;
    const drinksCount = products.filter((p) => p.category !== "beans").length;
    return { total, avgPrice, beansCount, drinksCount };
  }, [products]);

  // Actions
  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      category: "espresso",
      desc: "",
      basePrice: 15,
      image: "/images/soho_artisan_cafe.jpg",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: SupabaseProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      desc: product.desc,
      basePrice: product.basePrice,
      image: product.image,
    });
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([formData])
        .select();

      if (error) {
        setStatusMessage(`Eroare Supabase: ${error.message}. Produs adăugat local.`);
        const localNewProduct: SupabaseProduct = {
          id: Date.now(),
          ...formData,
        };
        setProducts((prev) => [localNewProduct, ...prev]);
      } else if (data && data.length > 0) {
        setStatusMessage(`Produsul "${formData.name}" a fost salvat cu succes în Supabase!`);
        setProducts((prev) => [data[0], ...prev]);
      }
    } catch {
      const localNewProduct: SupabaseProduct = {
        id: Date.now(),
        ...formData,
      };
      setProducts((prev) => [localNewProduct, ...prev]);
      setStatusMessage(`Produs adăugat local.`);
    } finally {
      setIsLoading(false);
      setIsAddModalOpen(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update(formData)
        .eq("id", editingProduct.id);

      if (error) {
        setStatusMessage(`Eroare Supabase: ${error.message}. Produs actualizat local.`);
      } else {
        setStatusMessage(`Produsul "${formData.name}" a fost actualizat în Supabase!`);
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p))
      );
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p))
      );
      setStatusMessage(`Produs actualizat local.`);
    } finally {
      setIsLoading(false);
      setEditingProduct(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingProduct.id);

      if (error) {
        setStatusMessage(`Eroare Supabase la ștergere. Produs eliminat local.`);
      } else {
        setStatusMessage(`Produsul a fost șters din Supabase!`);
      }

      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    } finally {
      setIsLoading(false);
      setDeletingProduct(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Batch seed initial catalog to Supabase & Storage
  const handleSeedDatabase = async () => {
    setIsLoading(true);
    setStatusMessage("Se încarcă imaginile în Supabase Storage și produsele în baza de date...");
    try {
      const itemsWithStorageImages = await Promise.all(
        INITIAL_PRODUCTS.map(async ({ name, category, desc, basePrice, image }) => {
          const storageImageUrl = await uploadLocalImageToStorage(image);
          return {
            name,
            category,
            desc,
            basePrice,
            image: storageImageUrl,
          };
        })
      );

      const { data, error } = await supabase.from("products").insert(itemsWithStorageImages).select();

      if (error) {
        setStatusMessage(`Eroare la populare Supabase: ${error.message}`);
      } else if (data) {
        setStatusMessage(`Catalogul cu ${data.length} produse și imagini a fost salvat în Supabase Storage & Database!`);
        fetchProducts();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setStatusMessage(`Eroare la populare: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a0f0a] text-[#fdfbf7] flex flex-col justify-between selection:bg-[#d49b4b] selection:text-[#1a0f0a]">
        {/* Header */}
        <header className="px-6 py-6 border-b border-[#b86b32]/30 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d49b4b] text-[#1a0f0a] flex items-center justify-center font-serif font-black text-xl shadow-md">
              A
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-widest text-[#d49b4b] block leading-none">
                ALMARINO CAFFÈ
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#cd7b3c] block mt-0.5">
                Autentificare Administrare
              </span>
            </div>
          </Link>

          <Link
            href="/menu"
            className="px-4 py-2 rounded-full border border-[#b86b32]/40 font-mono text-xs font-bold text-[#fdfbf7]/80 hover:text-[#d49b4b] hover:border-[#d49b4b] transition-all"
          >
            Vezi Meniul →
          </Link>
        </header>

        {/* Login Card */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-[#25160d] border border-[#d49b4b]/40 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#d49b4b]/15 border border-[#d49b4b]/40 text-[#d49b4b] flex items-center justify-center text-2xl mx-auto mb-2">
                🔒
              </div>
              <h1 className="text-2xl font-serif font-black text-[#fdfbf7]">
                Autentificare <span className="text-[#d49b4b]">Supabase Auth</span>
              </h1>
              <p className="text-xs text-[#fdfbf7]/70 font-mono">
                Introdu email-ul și parola de administrator din Supabase Auth.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-700/50 rounded-xl text-rose-200 font-mono text-xs text-center animate-in fade-in">
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#cd7b3c] mb-1">
                  Email Admin Supabase:
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@almarino.ro"
                  className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-xl px-4 py-3 text-[#fdfbf7] focus:outline-none focus:border-[#d49b4b]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#cd7b3c] mb-1">
                  Parolă:
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-xl px-4 py-3 text-[#fdfbf7] focus:outline-none focus:border-[#d49b4b]"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3.5 bg-[#d49b4b] hover:bg-[#e5ac5d] text-[#1a0f0a] font-mono text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isAuthLoading ? "Se procesează..." : "Intră în Administrare →"}
              </button>
            </form>
          </div>
        </main>

        <footer className="py-6 text-center font-mono text-[10px] text-[#fdfbf7]/50 border-t border-[#b86b32]/20">
          Almarino Caffè Protection • Strict Supabase Auth Enforced
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0f0a] text-[#fdfbf7] selection:bg-[#d49b4b] selection:text-[#1a0f0a]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#1a0f0a]/95 backdrop-blur-xl border-b border-[#b86b32]/30 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#d49b4b] text-[#1a0f0a] flex items-center justify-center font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="text-xl font-serif font-black tracking-widest text-[#d49b4b] block leading-none">
                  ALMARINO CAFFÈ
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#cd7b3c] block mt-0.5">
                  Panou Administrare & Supabase
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#25160d] border border-[#b86b32]/30 text-[10px] font-mono font-bold">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
              <span className="text-[#fdfbf7]/80">
                {isSupabaseConnected ? "Conectat la Supabase" : "Mod Demo / Local"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSeedDatabase}
              className="hidden lg:inline-flex px-4 py-2 rounded-full border border-[#b86b32]/40 bg-[#25160d] text-[#d49b4b] font-mono text-xs font-bold hover:bg-[#b86b32]/20 transition-all cursor-pointer"
            >
              ⚡ Populează Supabase
            </button>

            <Link
              href="/menu"
              className="px-4 py-2 rounded-full border border-[#b86b32]/40 font-mono text-xs font-bold text-[#fdfbf7]/80 hover:text-[#d49b4b] hover:border-[#d49b4b] transition-all"
            >
              Vezi Meniul →
            </Link>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-full bg-[#d49b4b] text-[#1a0f0a] font-mono text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Produs Nou</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-full border border-rose-800/40 bg-rose-950/30 text-rose-300 font-mono text-xs font-bold hover:bg-rose-900/40 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🔒 Deconectare</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {statusMessage && (
        <div className="bg-[#d49b4b] text-[#1a0f0a] px-6 py-3 font-mono text-xs font-extrabold text-center border-b border-[#1a0f0a]/20 animate-in fade-in">
          {statusMessage}
        </div>
      )}

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#25160d] to-[#1e100a] border border-[#b86b32]/30">
            <span className="font-mono text-[10px] uppercase font-bold text-[#cd7b3c] block">Total Produse</span>
            <span className="text-3xl font-serif font-black text-[#d49b4b] mt-1 block">{stats.total}</span>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#25160d] to-[#1e100a] border border-[#b86b32]/30">
            <span className="font-mono text-[10px] uppercase font-bold text-[#cd7b3c] block">Preț Mediu</span>
            <span className="text-3xl font-serif font-black text-[#d49b4b] mt-1 block">{stats.avgPrice} lei</span>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#25160d] to-[#1e100a] border border-[#b86b32]/30">
            <span className="font-mono text-[10px] uppercase font-bold text-[#cd7b3c] block">Băuturi Espresso/Cold</span>
            <span className="text-3xl font-serif font-black text-[#d49b4b] mt-1 block">{stats.drinksCount}</span>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#25160d] to-[#1e100a] border border-[#b86b32]/30">
            <span className="font-mono text-[10px] uppercase font-bold text-[#cd7b3c] block">Pachete Boabe Origine</span>
            <span className="text-3xl font-serif font-black text-[#d49b4b] mt-1 block">{stats.beansCount}</span>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#25160d]/60 p-4 rounded-3xl border border-[#b86b32]/25">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${activeCategory === cat.id
                    ? "bg-[#d49b4b] text-[#1a0f0a] border-[#d49b4b] font-black shadow-md"
                    : "bg-[#1a0f0a]/60 text-[#fdfbf7]/70 border-[#b86b32]/30 hover:border-[#d49b4b]/60"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută produs..."
              className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-full px-4 py-2 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#d49b4b] font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#fdfbf7]/50 hover:text-[#d49b4b]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Products Table / Grid */}
        <div className="bg-[#25160d]/40 rounded-3xl border border-[#b86b32]/30 overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="p-16 text-center font-mono text-sm text-[#d49b4b]">
              Se încarcă produsele din Supabase...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <span className="text-4xl block">☕</span>
              <p className="font-serif text-lg font-bold text-[#fdfbf7]">Nu s-a găsit niciun produs</p>
              <p className="font-mono text-xs text-[#fdfbf7]/60">Încearcă alt termen de căutare sau adaugă un produs nou.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans border-collapse">
                <thead>
                  <tr className="border-b border-[#b86b32]/30 bg-[#25160d]/80 font-mono text-[10px] uppercase font-extrabold tracking-wider text-[#d49b4b]">
                    <th className="p-4 pl-6">Imagine</th>
                    <th className="p-4">Nume Produs</th>
                    <th className="p-4">Categorie</th>
                    <th className="p-4">Descriere</th>
                    <th className="p-4 text-right">Preț (lei)</th>
                    <th className="p-4 text-center pr-6">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#b86b32]/15 text-xs">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#d49b4b]/5 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#d49b4b]/30 shrink-0">
                          <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                        </div>
                      </td>

                      <td className="p-4 font-serif font-bold text-sm text-[#fdfbf7] group-hover:text-[#d49b4b] transition-colors">
                        {p.name}
                      </td>

                      <td className="p-4 font-mono text-[10px]">
                        <span className="px-2.5 py-1 rounded-full bg-[#d49b4b]/15 text-[#e5ac5d] border border-[#d49b4b]/30 font-bold uppercase tracking-wider">
                          {p.category}
                        </span>
                      </td>

                      <td className="p-4 text-[#fdfbf7]/70 max-w-md truncate">
                        {p.desc}
                      </td>

                      <td className="p-4 text-right font-serif font-black text-sm text-[#d49b4b]">
                        {p.basePrice.toFixed(2)} lei
                      </td>

                      <td className="p-4 text-center pr-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="px-3 py-1.5 rounded-lg bg-[#d49b4b]/20 text-[#d49b4b] font-mono text-[10px] font-bold border border-[#d49b4b]/40 hover:bg-[#d49b4b] hover:text-[#1a0f0a] transition-all cursor-pointer"
                          >
                            Modifică
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(p)}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 font-mono text-[10px] font-bold border border-rose-800/40 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          >
                            Șterge
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#25160d] border border-[#d49b4b]/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#b86b32]/30">
              <h2 className="text-xl font-serif font-black text-[#d49b4b]">
                {editingProduct ? `Modifică "${editingProduct.name}"` : "Adaugă Produs Nou"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-[#fdfbf7]/60 hover:text-[#d49b4b] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingProduct ? handleSaveEdit : handleSaveAdd} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#cd7b3c] mb-1">
                  Nume Produs:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Ethiopian Yirgacheffe Special"
                  className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-xl px-3.5 py-2.5 text-[#fdfbf7] focus:outline-none focus:border-[#d49b4b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#cd7b3c] mb-1">
                    Categorie:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as SupabaseProduct["category"],
                      })
                    }
                    className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-xl px-3 py-2.5 text-[#fdfbf7] focus:outline-none focus:border-[#d49b4b]"
                  >
                    <option value="espresso">Espresso Bar</option>
                    <option value="specialty">Băuturi Speciale</option>
                    <option value="cold">Cold Brew & Infuzii</option>
                    <option value="beans">Pachete Cafea Boabe</option>
                    <option value="tea">Ceai & Ciocolată</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#cd7b3c] mb-1">
                    Preț de Bază (lei):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-xl px-3.5 py-2.5 text-[#fdfbf7] focus:outline-none focus:border-[#d49b4b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#cd7b3c] mb-1">
                  Imagine Produs (Supabase Storage sau URL):
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer bg-[#1a0f0a] border border-[#b86b32]/40 hover:border-[#d49b4b] rounded-xl px-3.5 py-2.5 text-[#fdfbf7]/90 transition-all">
                    <span>
                      {isUploadingImage ? "⏳ Se încarcă în Supabase Storage..." : "📁 Încarcă Imagine din Calculator"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/ethiopian_yirgacheffe.jpg sau URL Supabase"
                    className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-xl px-3.5 py-2.5 text-[#fdfbf7] focus:outline-none focus:border-[#d49b4b]"
                  />

                  {formData.image && (
                    <div className="flex items-center gap-3 p-2 bg-[#1a0f0a]/80 rounded-xl border border-[#b86b32]/30">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#d49b4b]/40 shrink-0">
                        <Image src={formData.image} alt="Preview" fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-mono text-[#d49b4b] font-bold block">Preview Imagine</span>
                        <span className="text-[9px] font-mono text-[#fdfbf7]/60 truncate block">{formData.image}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#cd7b3c] mb-1">
                  Descriere:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Descrie notele de aromă și originea..."
                  className="w-full bg-[#1a0f0a] border border-[#b86b32]/40 rounded-xl px-3.5 py-2.5 text-[#fdfbf7] focus:outline-none focus:border-[#d49b4b]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#b86b32]/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#b86b32]/40 text-[#fdfbf7]/70 hover:text-[#fdfbf7]"
                >
                  Renunță
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#d49b4b] text-[#1a0f0a] font-black uppercase tracking-wider hover:bg-[#e5ac5d] shadow-md"
                >
                  {editingProduct ? "Salvează Modificările" : "Adaugă Produsul"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#25160d] border border-rose-800/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <span className="text-4xl block">⚠️</span>
            <h3 className="text-lg font-serif font-black text-rose-300">
              Ștergi produsul "{deletingProduct.name}"?
            </h3>
            <p className="text-xs text-[#fdfbf7]/70 font-mono">
              Această acțiune va elimina produsul din baza de date Supabase.
            </p>
            <div className="pt-3 flex justify-center gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl border border-[#b86b32]/40 text-[#fdfbf7]/70 hover:text-[#fdfbf7]"
              >
                Renunță
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-black hover:bg-rose-700 shadow-md"
              >
                Șterge Definitiv
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
