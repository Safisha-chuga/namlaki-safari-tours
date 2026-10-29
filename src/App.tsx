import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { Phone, Envelope, MapPin, ShieldCheck, Star, Users, Compass, Globe, Flame, Quotes, SealCheck, Binoculars, Tent, PawPrint, Camera, Sparkle, CaretDown, Question } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PackageCard from "@/components/PackageCard";
import PackageDetailModal from "@/components/PackageDetailModal";
import StickyPackageBar from "@/components/StickyPackageBar";
import { InquiryForm, MailboxDrawer } from "@/components/InquirySystem";
import { safariPackages, founders, reviews, COMPANY, CAMP_IMG, MAASAI_IMG, BALLOON_IMG, wildlifeGallery, FAQS } from "@/data/safariData";
import type { SafariPackage, Inquiry } from "@/types";

const STORAGE_KEY = "namlaki_inquiries";

function loadInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [modalPkg, setModalPkg] = useState<SafariPackage | null>(null);
  const [activePkgId, setActivePkgId] = useState(safariPackages[0].id);
  const [inquiryPkg, setInquiryPkg] = useState<SafariPackage | null>(null);
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filters, setFilters] = useState({ park: "All Parks", duration: "Any Duration", style: "All Styles" });

  useEffect(() => {
    setInquiries(loadInquiries());
  }, []);

  const handleFilter = useCallback((park: string, duration: string, style: string) => {
    setFilters({ park, duration, style });
  }, []);

  const filteredPackages = safariPackages.filter((p) => {
    if (filters.park !== "All Parks" && !p.parks.some((pk) => filters.park.includes(pk) || pk.includes(filters.park))) return false;
    if (filters.duration === "3-5 Days" && (p.durationDays < 3 || p.durationDays > 5)) return false;
    if (filters.duration === "6-8 Days" && (p.durationDays < 6 || p.durationDays > 8)) return false;
    if (filters.style !== "All Styles" && p.safariStyle !== filters.style) return false;
    return true;
  });

  const handleInquirySubmitted = (inq: Inquiry) => {
    setInquiries((prev) => {
      const next = [inq, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleUpdateStatus = (id: string, status: Inquiry["status"]) => {
    setInquiries((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, status } : i));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const scrollToInquiry = (pkg?: SafariPackage) => {
    if (pkg) setInquiryPkg(pkg);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B18] font-sans">
      <Toaster position="top-right" richColors />
      <Navbar
        onOpenMailbox={() => setMailboxOpen(true)}
        inquiryCount={inquiries.length}
        onSelectPackage={(pkg) => {
          setActivePkgId(pkg.id);
          setModalPkg(pkg);
        }}
      />

      {/* Hero */}
      <Hero onFilter={handleFilter} />

      {/* Packages Section */}
      <section id="packages" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Safari Packages"
            title="Choose Your Tanzanian Adventure"
            subtitle="From quick crater escapes to week-long migration treks, every itinerary is handcrafted by Jackson and Nimzana."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filteredPackages.map((pkg, i) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={i}
                onExplore={setModalPkg}
                onQuickInquiry={scrollToInquiry}
              />
            ))}
          </div>
          {filteredPackages.length === 0 && (
            <div className="text-center py-16 text-zinc-400">
              <Binoculars size={48} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No packages match your filters</p>
              <button onClick={() => setFilters({ park: "All Parks", duration: "Any Duration", style: "All Styles" })} className="mt-2 text-[#D97706] text-sm underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-16 sm:py-24 bg-[#1E1B18] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Meet Your Guides"
            title="The People Behind Namlaki"
            subtitle="Jackson and Nimzana are not just operators. They are the soul of every safari you take."
            dark
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-6 bg-zinc-800/50 rounded-2xl overflow-hidden border border-zinc-700/50`}
              >
                <div className="w-full lg:w-[45%] h-64 lg:h-auto shrink-0 relative">
                  <img src={f.photoUrl} alt={f.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18]/80 via-transparent to-transparent" />
                  {f.sightings && (
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                      {f.sightings.slice(0, 3).map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D97706]/90 text-white text-[10px] font-medium backdrop-blur-sm">
                          <PawPrint size={10} weight="fill" /> {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6 lg:py-8 lg:pr-8 flex flex-col justify-center">
                  <h3 className="font-serif text-xl sm:text-2xl text-white mb-1">{f.name}</h3>
                  <p className="text-[#D97706] text-sm font-medium mb-3">{f.role}</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">{f.bio}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                    <ShieldCheck size={14} weight="fill" className="text-[#D97706]" />
                    {f.experienceYears}+ years experience | {f.specialty}
                  </div>
                  <blockquote className="flex items-start gap-2 text-sm text-zinc-200 italic border-l-2 border-[#D97706] pl-3">
                    <Quotes size={16} weight="fill" className="text-[#D97706] shrink-0 mt-0.5" />
                    {f.quote}
                  </blockquote>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Traveler Stories"
            title="What Our Guests Say"
            subtitle="Real reviews from travelers who experienced the Namlaki difference."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={14} weight="fill" className="text-[#D97706]" />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">{r.text}</p>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div>
                    <p className="font-semibold text-zinc-700">{r.author}</p>
                    <p className="flex items-center gap-1"><Globe size={11} weight="fill" /> {r.country}</p>
                  </div>
                  <p className="text-right text-[#B45309] font-medium">{r.packageName}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wildlife Gallery */}
      <section id="wildlife" className="py-16 sm:py-24 bg-[#1E1B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Wildlife Encounters"
            title="The Big Five & Beyond"
            subtitle="Every safari is a living documentary. Here is what Jackson and his trackers have been spotting on recent expeditions."
            dark
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {wildlifeGallery.map((ws, i) => (
              <motion.div
                key={ws.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden border border-zinc-700/50 bg-zinc-800/30"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={ws.image}
                    alt={ws.species}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18]/95 via-[#1E1B18]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-lg text-white">{ws.species}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] text-[10px] font-medium">
                      <Sparkle size={10} weight="fill" /> {ws.status}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs mb-1.5 flex items-center gap-1">
                    <Camera size={11} weight="fill" /> {ws.location}
                  </p>
                  <p className="text-zinc-300 text-xs leading-relaxed">{ws.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Namlaki */}
      <section id="why-namlaki" className="py-16 sm:py-24 bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="The Namlaki Difference"
            title="Why Travelers Choose Us"
            subtitle="Every detail matters when you are in the wild."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <WhyCard icon={<Compass size={28} weight="fill" />} title="Custom Itineraries" desc="No two safaris are the same. Jackson designs every route around your goals, pace, and wildlife obsessions." />
            <WhyCard icon={<PawPrint size={28} weight="fill" />} title="Expert Local Guides" desc="KTO-certified naturalists with 10+ years on the ground. They know where the cats sleep and when the herds cross." />
            <WhyCard icon={<Tent size={28} weight="fill" />} title="Handpicked Lodges" desc="From luxury tented camps to eco-lodges, every overnight stop is vetted by Nimzana for comfort, views, and value." />
            <WhyCard icon={<SealCheck size={28} weight="fill" />} title="Transparent Pricing" desc="No hidden fees. Park charges, transfers, and meals are all included upfront. What you see is what you pay." />
          </div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-[#1E1B18] to-[#2a2622] rounded-2xl p-6 sm:p-8 text-white grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            <Stat value="500+" label="Happy Travelers" />
            <Stat value="14" label="Years Guiding" />
            <Stat value="6" label="National Parks" />
            <Stat value="4.98" label="Avg Rating" />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Common Questions"
            title="Safari FAQ"
            subtitle={`Everything you need to know before your Tanzania adventure. Can not find an answer? Call us at ${COMPANY.phoneDisplay} or WhatsApp us any time.`}
            dark={false}
          />
          <FAQAccordion />
        </div>
      </section>

      {/* Inquiry Section */}
      <section id="inquiry" className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Book Your Safari"
            title="Start Your Inquiry"
            subtitle="Tell us about your dream trip. Jackson and Nimzana will craft a custom proposal within 24 hours."
          />
          <div className="mt-10 bg-white rounded-2xl border border-zinc-200 shadow-lg p-6 sm:p-8">
            <InquiryForm selectedPkg={inquiryPkg} onSubmitted={handleInquirySubmitted} />
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="bg-[#1E1B18] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] flex items-center justify-center text-white font-bold text-xl">N</div>
                <div>
                  <p className="font-serif text-lg">Namlaki</p>
                  <p className="text-[#D97706] text-[11px] uppercase tracking-[0.2em]">{COMPANY.tagline}</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {COMPANY.fullName}. Handcrafted Tanzanian safaris by Jackson Michael Safisha and Nimzana Jackson Safisha. Licensed under {COMPANY.license}.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#D97706]">
                <Flame size={16} weight="fill" />
                <span>Where the Wild Meets Warm Hospitality</span>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <div className="space-y-3 text-sm text-zinc-300">
                <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-[#D97706] transition-colors">
                  <Phone size={16} weight="fill" className="text-[#D97706]" /> {COMPANY.phone}
                </a>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-[#D97706] transition-colors">
                  <Envelope size={16} weight="fill" className="text-[#D97706]" /> {COMPANY.email}
                </a>
                <div className="flex items-center gap-2">
                  <MapPin size={16} weight="fill" className="text-[#D97706]" /> {COMPANY.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} weight="fill" className="text-[#D97706]" /> {COMPANY.hours}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Safari Packages</h4>
              <div className="space-y-2 text-sm text-zinc-300">
                {safariPackages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setModalPkg(p)}
                    className="block hover:text-[#D97706] transition-colors text-left"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-zinc-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <p>&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <ShieldCheck size={12} weight="fill" className="text-[#D97706]" />
              {COMPANY.license} | Tanzania Tourist Board Registered
            </p>
          </div>
        </div>
      </footer>

      {/* Package Modal */}
      <AnimatePresence>
        {modalPkg && (
          <PackageDetailModal
            pkg={modalPkg}
            onClose={() => setModalPkg(null)}
            onInquire={(pkg) => {
              setModalPkg(null);
              scrollToInquiry(pkg);
            }}
          />
        )}
      </AnimatePresence>

      {/* Sticky Package Selector */}
      <StickyPackageBar
        activePackage={safariPackages.find((p) => p.id === activePkgId) ?? safariPackages[0]}
        onSelect={setActivePkgId}
        onInquire={(pkg) => scrollToInquiry(pkg)}
        onExplore={(pkg) => setModalPkg(pkg)}
      />

      {/* Mailbox Drawer */}
      <AnimatePresence>
        {mailboxOpen && (
          <MailboxDrawer
            inquiries={inquiries}
            onClose={() => setMailboxOpen(false)}
            onDelete={handleDeleteInquiry}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Shared Section Components ─── */

function SectionHeader({ eyebrow, title, subtitle, dark }: { eyebrow: string; title: string; subtitle: string; dark?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl mx-auto"
    >
      <p className={`text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold mb-2 ${dark ? "text-[#D97706]" : "text-[#B45309]"}`}>{eyebrow}</p>
      <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl leading-tight mb-3 ${dark ? "text-white" : "text-[#1E1B18]"}`}>{title}</h2>
      <p className={`text-sm sm:text-base leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{subtitle}</p>
    </motion.div>
  );
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 border border-zinc-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="text-[#D97706] mb-3">{icon}</div>
      <h3 className="font-serif text-lg text-[#1E1B18] mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-[#D97706]">{value}</p>
      <p className="text-xs text-zinc-400 mt-1">{label}</p>
    </div>
  );
}

function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-3">
      {FAQS.map((faq) => (
        <div key={faq.id} className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
          <button
            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F5EFE6]/50 transition-colors"
          >
            <Question size={18} weight="fill" className="text-[#D97706] shrink-0" />
            <span className="flex-1 font-semibold text-[#1E1B18] text-sm sm:text-base">{faq.question}</span>
            <CaretDown
              size={18}
              className={`text-zinc-400 transition-transform duration-200 shrink-0 ${openId === faq.id ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {openId === faq.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-zinc-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}