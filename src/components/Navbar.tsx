import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Envelope,
  MapPin,
  X,
  ListBullets,
  ArrowRight,
  CaretDown,
  ChatCircleDots,
  Tag,
} from "@phosphor-icons/react";
import { COMPANY, groupedPackages } from "@/data/safariData";
import type { SafariPackage } from "@/types";

const navLinks = [
  { label: "All Safaris", href: "#packages" },
  { label: "Founders", href: "#founders" },
  { label: "Why Namlaki", href: "#why-namlaki" },
  { label: "Contact", href: "#contact" },
];

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

interface NavbarProps {
  onOpenMailbox: () => void;
  inquiryCount: number;
  onSelectPackage?: (pkg: SafariPackage) => void;
}

export default function Navbar({ onOpenMailbox, inquiryCount, onSelectPackage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pkgOpen, setPkgOpen] = useState(false);
  const [mobilePkgsOpen, setMobilePkgsOpen] = useState(false);
  const groups = groupedPackages();

  useEffect(() => {
    const close = () => setPkgOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, []);

  const pick = (pkg: SafariPackage) => {
    setPkgOpen(false);
    setMobileOpen(false);
    if (onSelectPackage) onSelectPackage(pkg);
    else document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#1E1B18]/90 backdrop-blur-md border-b border-[#D97706]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-[#D97706]/30 group-hover:scale-110 transition-transform">
              N
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-serif text-lg leading-tight tracking-wide">Namlaki</p>
              <p className="text-[#D97706] text-[11px] uppercase tracking-[0.2em]">{COMPANY.tagline}</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Safari Packages dropdown */}
            <div className="relative" onMouseLeave={() => setPkgOpen(false)}>
              <button
                onMouseEnter={() => setPkgOpen(true)}
                onClick={() => setPkgOpen((v) => !v)}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-[#D97706] text-sm font-medium transition-colors duration-200 py-6"
                aria-expanded={pkgOpen}
              >
                Safari Packages
                <CaretDown size={13} weight="bold" className={`transition-transform ${pkgOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {pkgOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-full w-[760px] rounded-2xl bg-[#1E1B18] border border-[#D97706]/25 shadow-2xl shadow-black/50 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-6">
                      {groups.map((g) => (
                        <div key={g.label}>
                          <p className="text-[#D97706] text-[11px] uppercase tracking-[0.18em] font-semibold mb-1">{g.label}</p>
                          <p className="text-zinc-500 text-[11px] mb-2">{g.blurb}</p>
                          <div className="space-y-1">
                            {g.packages.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => pick(p)}
                                className="w-full text-left flex items-start justify-between gap-3 px-2.5 py-2 rounded-lg hover:bg-[#D97706]/12 transition-colors group/item"
                              >
                                <span className="min-w-0">
                                  <span className="block text-zinc-200 text-[13px] font-medium leading-snug group-hover/item:text-white">
                                    {p.title}
                                  </span>
                                  <span className="flex items-center gap-1.5 mt-0.5 text-[11px] text-zinc-500">
                                    <Tag size={10} weight="fill" className="text-[#D97706]" />
                                    {p.durationDays} Days / {p.durationNights} Nights
                                    {p.badge && (
                                      <span className="ml-1 px-1.5 py-[1px] rounded-full bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#EA580C] text-[9px] font-semibold uppercase tracking-wide">
                                        {p.badge}
                                      </span>
                                    )}
                                  </span>
                                </span>
                                <span className="shrink-0 text-right">
                                  <span className="block text-[10px] text-zinc-500">from</span>
                                  <span className="block text-[#D97706] text-sm font-bold leading-none">{money(p.priceUSD)}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-3 px-6 py-3 bg-[#251F1A] border-t border-[#D97706]/15">
                      <p className="text-zinc-400 text-xs">Need something different? We build custom routes.</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`${COMPANY.whatsappLink}?text=${encodeURIComponent("Jambo! I would like to plan a custom Tanzania safari.")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/25 transition-colors"
                        >
                          <ChatCircleDots size={13} weight="fill" /> WhatsApp
                        </a>
                        <a
                          href="#inquiry"
                          onClick={() => setPkgOpen(false)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-xs font-semibold"
                        >
                          Custom Safari <ArrowRight size={12} weight="bold" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-zinc-300 hover:text-[#D97706] text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* WhatsApp */}
            <a
              href={`${COMPANY.whatsappLink}?text=${encodeURIComponent("Jambo! I would like to inquire about a Tanzania safari.")}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/35 text-[#25D366] text-sm hover:bg-[#25D366]/25 transition-colors"
            >
              <ChatCircleDots size={15} weight="fill" />
              <span className="font-medium">{COMPANY.phone}</span>
            </a>

            {/* Mailbox */}
            <button
              onClick={onOpenMailbox}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EA580C]/15 border border-[#EA580C]/30 text-[#EA580C] text-sm hover:bg-[#EA580C]/25 transition-colors"
            >
              <Envelope size={15} weight="fill" />
              <span className="hidden sm:inline">Inquiries</span>
              {inquiryCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#EA580C] text-white text-[10px] font-bold flex items-center justify-center">
                  {inquiryCount}
                </span>
              )}
            </button>

            {/* Tailor CTA */}
            <a
              href="#inquiry"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#D97706]/30 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200"
            >
              Tailor My Safari
              <ArrowRight size={14} weight="bold" />
            </a>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <ListBullets size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-[#1E1B18]/95 backdrop-blur-md border-t border-[#D97706]/20"
          >
            <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
              <button
                onClick={() => setMobilePkgsOpen((v) => !v)}
                className="w-full flex items-center justify-between py-2 text-[#D97706] text-base font-semibold"
              >
                Safari Packages
                <CaretDown size={16} weight="bold" className={`transition-transform ${mobilePkgsOpen ? "rotate-180" : ""}`} />
              </button>
              {mobilePkgsOpen && (
                <div className="pl-2 space-y-3 pb-2">
                  {groups.map((g) => (
                    <div key={g.label}>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-1">{g.label}</p>
                      {g.packages.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => pick(p)}
                          className="w-full flex items-center justify-between gap-2 py-1.5 text-left"
                        >
                          <span className="text-zinc-300 text-sm leading-snug">{p.title}</span>
                          <span className="text-[#D97706] text-xs font-bold shrink-0">from {money(p.priceUSD)}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-zinc-300 hover:text-[#D97706] py-2 text-base font-medium transition-colors border-t border-zinc-800"
                >
                  {link.label}
                </a>
              ))}

              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-zinc-700/50">
                <a href={`${COMPANY.whatsappLink}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#25D366] text-sm">
                  <ChatCircleDots size={14} weight="fill" /> {COMPANY.phone}
                </a>
                <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 text-[#D97706] text-sm">
                  <Phone size={14} weight="fill" /> Call
                </a>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-[#D97706] text-sm break-all">
                  <Envelope size={14} weight="fill" /> {COMPANY.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs pt-2">
                <MapPin size={12} weight="fill" /> {COMPANY.location}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}