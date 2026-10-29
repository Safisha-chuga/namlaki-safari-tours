import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CaretDown, ChatCircleDots, Clock, Tag } from "@phosphor-icons/react";
import { COMPANY, safariPackages } from "@/data/safariData";
import type { SafariPackage } from "@/types";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

interface StickyPackageBarProps {
  activePackage: SafariPackage;
  onSelect: (id: string) => void;
  onInquire: (pkg: SafariPackage) => void;
  onExplore: (pkg: SafariPackage) => void;
}

export default function StickyPackageBar({ activePackage, onSelect, onInquire, onExplore }: StickyPackageBarProps) {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 sm:px-6 sm:pb-4 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto pointer-events-auto rounded-2xl bg-[#1E1B18]/95 backdrop-blur-md border border-[#D97706]/30 shadow-2xl shadow-black/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:px-4">
              {/* Package selector */}
              <div className="relative flex-1 min-w-0">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-[#251F1A] border border-zinc-700/60 hover:border-[#D97706]/50 transition-colors text-left"
                  aria-expanded={menuOpen}
                >
                  <Tag size={16} weight="fill" className="text-[#D97706] shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500">Selected safari</span>
                    <span className="block text-white text-sm font-semibold truncate">{activePackage.title}</span>
                  </span>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`text-zinc-400 shrink-0 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute bottom-full left-0 right-0 mb-2 max-h-72 overflow-y-auto rounded-xl bg-[#1E1B18] border border-[#D97706]/30 shadow-2xl shadow-black/60 p-1.5"
                    >
                      {safariPackages.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelect(p.id);
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                            p.id === activePackage.id ? "bg-[#D97706]/20" : "hover:bg-zinc-800/70"
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block text-zinc-200 text-[13px] font-medium truncate">{p.title}</span>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                              <Clock size={9} weight="fill" /> {p.durationDays} days | {p.safariStyle}
                            </span>
                          </span>
                          <span className="shrink-0 text-[#D97706] text-xs font-bold">{money(p.priceUSD)}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price + duration */}
              <div className="flex items-center gap-4 sm:gap-5 px-1 shrink-0">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 leading-none">From</p>
                  <p className="text-[#D97706] text-lg font-bold leading-tight">
                    {money(activePackage.priceUSD)}
                    <span className="text-[10px] text-zinc-500 font-normal"> /person</span>
                  </p>
                </div>
                <div className="hidden sm:block h-8 w-px bg-zinc-700/70" />
                <div className="hidden sm:block">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 leading-none">Duration</p>
                  <p className="text-white text-sm font-semibold leading-tight">
                    {activePackage.durationDays}D / {activePackage.durationNights}N
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onExplore(activePackage)}
                  className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl border border-zinc-600 text-zinc-200 text-xs sm:text-sm font-semibold hover:border-[#D97706] hover:text-[#D97706] transition-colors"
                >
                  Details
                </button>
                <a
                  href={`${COMPANY.whatsappLink}?text=${encodeURIComponent(
                    `Jambo! I would like to book the ${activePackage.title} (${activePackage.durationDays} days) at ${money(activePackage.priceUSD)} per person.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-xs sm:text-sm font-semibold hover:bg-[#25D366]/25 transition-colors"
                >
                  <ChatCircleDots size={15} weight="fill" /> WhatsApp
                </a>
                <button
                  onClick={() => onInquire(activePackage)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-[#D97706]/30 transition-all"
                >
                  Inquire <ArrowRight size={13} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}