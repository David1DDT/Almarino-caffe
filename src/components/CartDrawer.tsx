"use client";

import { useEffect, useRef } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "beans" | "beverage";
  details: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  orderMode: "pickup" | "table" | "delivery";
  setOrderMode: (mode: "pickup" | "table" | "delivery") => void;
  tableNumber: string;
  setTableNumber: (num: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderMode,
  setOrderMode,
  tableNumber,
  setTableNumber,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div
        ref={drawerRef}
        className="w-full max-w-md h-full bg-frost-alabaster dark:bg-emerald-dark border-l border-sage/20 dark:border-champagne/20 shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sage/20 dark:border-champagne/20">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-sage dark:text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 id="cart-drawer-title" className="text-xl font-serif font-bold text-emerald-dark dark:text-frost-alabaster">
              Your Order Basket
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sage/10 dark:hover:bg-champagne/10 text-emerald-dark dark:text-frost-alabaster transition-colors"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Order Mode Selector */}
        <div className="mt-4 p-3 bg-white/70 dark:bg-eucalyptus-dark/70 rounded-xl border border-sage/20 dark:border-champagne/20">
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-sage dark:text-champagne mb-2">
            Fulfillment Method
          </label>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setOrderMode("table")}
              className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                orderMode === "table"
                  ? "bg-sage text-white dark:bg-champagne dark:text-emerald-dark shadow-xs"
                  : "bg-sage/10 dark:bg-champagne/10 text-emerald-dark dark:text-frost-alabaster hover:bg-sage/20"
              }`}
            >
              🍽 Table Order
            </button>
            <button
              type="button"
              onClick={() => setOrderMode("pickup")}
              className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                orderMode === "pickup"
                  ? "bg-sage text-white dark:bg-champagne dark:text-emerald-dark shadow-xs"
                  : "bg-sage/10 dark:bg-champagne/10 text-emerald-dark dark:text-frost-alabaster hover:bg-sage/20"
              }`}
            >
              🏃 Express Pickup
            </button>
            <button
              type="button"
              onClick={() => setOrderMode("delivery")}
              className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                orderMode === "delivery"
                  ? "bg-sage text-white dark:bg-champagne dark:text-emerald-dark shadow-xs"
                  : "bg-sage/10 dark:bg-champagne/10 text-emerald-dark dark:text-frost-alabaster hover:bg-sage/20"
              }`}
            >
              📦 Bean Delivery
            </button>
          </div>

          {orderMode === "table" && (
            <div className="mt-3">
              <label className="block font-mono text-[10px] font-bold text-emerald-dark/70 dark:text-frost-alabaster/70 mb-1">
                Table Number:
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. Table 4"
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-sage/30 dark:border-champagne/30 bg-white dark:bg-emerald-dark text-emerald-dark dark:text-frost-alabaster focus:outline-hidden focus:ring-1 focus:ring-sage"
              />
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 my-4 space-y-3 overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-4xl block mb-2">🌿</span>
              <p className="text-sm font-medium text-emerald-dark/70 dark:text-frost-alabaster/70">
                Your basket is empty
              </p>
              <p className="text-xs text-emerald-dark/50 dark:text-frost-alabaster/50 mt-1">
                Customize your roast or pick a fresh beverage to get started.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white/70 dark:bg-eucalyptus-dark/70 rounded-xl border border-sage/20 dark:border-champagne/20"
              >
                <div className="flex-1 pr-3">
                  <h4 className="text-sm font-serif font-bold text-emerald-dark dark:text-frost-alabaster">
                    {item.name}
                  </h4>
                  <p className="font-mono text-[10px] text-emerald-dark/60 dark:text-frost-alabaster/60">
                    {item.details}
                  </p>
                  <p className="text-xs font-bold text-sage dark:text-champagne mt-0.5">
                    {item.price.toFixed(2)} lei
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-sage/30 dark:border-champagne/30 rounded-lg overflow-hidden font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="px-2 py-0.5 font-bold text-emerald-dark dark:text-frost-alabaster hover:bg-sage/10 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2 py-0.5 font-bold text-emerald-dark dark:text-frost-alabaster">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="px-2 py-0.5 font-bold text-emerald-dark dark:text-frost-alabaster hover:bg-sage/10 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-red-500/80 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Sterge produsul"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-sage/20 dark:border-champagne/20 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-emerald-dark dark:text-frost-alabaster">Subtotal</span>
              <span className="text-lg font-serif font-bold text-sage dark:text-champagne">
                {subtotal.toFixed(2)} lei
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                alert(`Comandă plasată! Vă mulțumim că ați comandat de la Almarino Caffè (${orderMode.toUpperCase()}).`);
                onClearCart();
                onClose();
              }}
              className="w-full py-3.5 bg-sage hover:bg-sage-light dark:bg-champagne dark:hover:bg-champagne-light text-white dark:text-emerald-dark font-bold text-sm rounded-xl shadow-md transition-all transform active:scale-98 cursor-pointer"
            >
              Finalizează Comanda ({subtotal.toFixed(2)} lei)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
