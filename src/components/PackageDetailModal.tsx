import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Users, Tag, Calendar, CheckCircle, XCircle, Camera, CaretDown, ArrowRight, Compass, Star, Flame, Calculator, Minus, Plus } from "@phosphor-icons/react";
import type { SafariPackage } from "@/types";

interface Props {
  pkg: SafariPackage;
  onClose: () => void;
  onInquire: (pkg: SafariPackage) => void;
}

const TABS = ["Overview", "Itinerary", "Inclusions", "Pricing"] as const;
type Tab = (typeof TABS)[number];

export default function PackageDetailModal({ pkg, onClose, onInquire }: Props) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center p-2 sm:p-6 pt-16 sm:pt-20"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[85dvh] overflow-hidden rounded-2xl bg-[#FAF8F5] shadow-2xl flex flex-col"
      >
        {/* Header Image */}
        <div className="relative h-48 sm:h-60 shrink-0 overflow-hidden">
          <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
            <X size={18} />
          </button>
          {pkg.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-xs font-bold uppercase">
              {pkg.badge}
            </span>
          )}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-white leading-tight">{pkg.title}</h2>
            <p className="text-zinc-300 text-sm mt-1">{pkg.tagline}</p>
          </div>
        </div>

        {/* Meta Bar */}
        <div className="flex flex-wrap gap-3 px-4 sm:px-6 py-3 bg-[#F5EFE6] border-b border-[#F5EFE6] shrink-0">
          <MetaChip icon={<Clock size={14} weight="fill" />} text={`${pkg.durationDays} Days / ${pkg.durationNights} Nights`} />
          <MetaChip icon={<Users size={14} weight="fill" />} text={pkg.groupSize} />
          <MetaChip icon={<Calendar size={14} weight="fill" />} text={pkg.bestMonths} />
          <MetaChip icon={<Tag size={14} weight="fill" />} text={pkg.safariStyle} />
          <MetaChip icon={<Compass size={14} weight="fill" />} text={pkg.startingPoint} />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 px-4 sm:px-6 shrink-0 bg-white">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-[#D97706] text-[#B45309]" : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "Overview" && <OverviewTab pkg={pkg} galleryIdx={galleryIdx} setGalleryIdx={setGalleryIdx} />}
              {tab === "Itinerary" && <ItineraryTab pkg={pkg} openDay={openDay} setOpenDay={setOpenDay} />}
              {tab === "Inclusions" && <InclusionsTab pkg={pkg} />}
              {tab === "Pricing" && <PricingTab pkg={pkg} onInquire={() => onInquire(pkg)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetaChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
      <span className="text-[#B45309]">{icon}</span>
      {text}
    </span>
  );
}

function OverviewTab({ pkg, galleryIdx, setGalleryIdx }: { pkg: SafariPackage; galleryIdx: number; setGalleryIdx: (i: number) => void }) {
  return (
    <div className="space-y-6">
      {/* Gallery */}
      <div>
        <div className="relative rounded-xl overflow-hidden h-56 sm:h-72 mb-3">
          <AnimatePresence mode="wait">
            <motion.img
              key={galleryIdx}
              src={pkg.galleryImages[galleryIdx]}
              alt={`${pkg.title} photo ${galleryIdx + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-xs">
            <Camera size={12} weight="fill" /> {galleryIdx + 1}/{pkg.galleryImages.length}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pkg.galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setGalleryIdx(i)}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === galleryIdx ? "border-[#D97706] ring-2 ring-[#D97706]/30" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h3 className="font-serif text-lg text-[#1E1B18] mb-3 flex items-center gap-2">
          <Star size={18} weight="fill" className="text-[#D97706]" /> Trip Highlights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pkg.highlights.map((h) => (
            <div key={h} className="flex items-start gap-2 text-sm text-zinc-700">
              <Flame size={14} weight="fill" className="text-[#EA580C] mt-0.5 shrink-0" />
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* Route */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 bg-[#F5EFE6] rounded-xl p-4">
        <MapPin size={16} weight="fill" className="text-[#365314]" />
        <span className="font-medium">{pkg.startingPoint}</span>
        <ArrowRight size={14} className="text-[#D97706]" />
        <span>{pkg.parks.join(" > ")}</span>
        <ArrowRight size={14} className="text-[#D97706]" />
        <span className="font-medium">{pkg.endingPoint}</span>
      </div>
    </div>
  );
}

function ItineraryTab({ pkg, openDay, setOpenDay }: { pkg: SafariPackage; openDay: number | null; setOpenDay: (d: number | null) => void }) {
  return (
    <div className="space-y-3">
      {pkg.itinerary.map((day) => (
        <div key={day.dayNumber} className="rounded-xl border border-zinc-200 overflow-hidden">
          <button
            onClick={() => setOpenDay(openDay === day.dayNumber ? null : day.dayNumber)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#F5EFE6]/50 transition-colors text-left"
          >
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white text-sm font-bold flex items-center justify-center shrink-0">
              {day.dayNumber}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1E1B18] text-sm leading-tight">{day.title}</p>
              <p className="text-xs text-zinc-500">{day.location}</p>
            </div>
            <CaretDown
              size={18}
              className={`text-zinc-400 transition-transform duration-200 shrink-0 ${openDay === day.dayNumber ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {openDay === day.dayNumber && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-1 space-y-3">
                  <img src={day.image} alt={day.title} className="w-full h-36 sm:h-44 object-cover rounded-lg" />
                  <p className="text-sm text-zinc-600 leading-relaxed">{day.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {day.highlights.map((h) => (
                      <span key={h} className="px-2 py-0.5 rounded-full bg-[#F5EFE6] text-xs text-[#B45309] font-medium">{h}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-zinc-500 pt-1 border-t border-zinc-100">
                    <span><strong className="text-zinc-700">Meals:</strong> {day.meals}</span>
                    <span><strong className="text-zinc-700">Stay:</strong> {day.accommodation}</span>
                    <span><strong className="text-zinc-700">Drive:</strong> {day.gameDriveTime}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function InclusionsTab({ pkg }: { pkg: SafariPackage }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <h3 className="font-serif text-base text-[#365314] mb-3 flex items-center gap-2">
          <CheckCircle size={18} weight="fill" /> What is Included
        </h3>
        <ul className="space-y-2">
          {pkg.inclusions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
              <CheckCircle size={15} weight="fill" className="text-[#365314] mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-serif text-base text-[#EA580C] mb-3 flex items-center gap-2">
          <XCircle size={18} weight="fill" /> Not Included
        </h3>
        <ul className="space-y-2">
          {pkg.exclusions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
              <XCircle size={15} weight="fill" className="text-[#EA580C] mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PricingTab({ pkg, onInquire }: { pkg: SafariPackage; onInquire: () => void }) {
  const [travelers, setTravelers] = useState(2);
  const [season, setSeason] = useState<"low" | "shoulder" | "peak">("shoulder");
  const seasonMultiplier = season === "peak" ? 1.25 : season === "shoulder" ? 1.0 : 0.85;
  const perPerson = Math.round(pkg.priceUSD * seasonMultiplier);
  const total = perPerson * travelers;

  return (
    <div className="space-y-5">
      {/* Price Calculator */}
      <div className="bg-gradient-to-br from-[#1E1B18] to-[#2a2622] rounded-2xl p-6 text-white">
        <p className="text-zinc-400 text-sm mb-1">Starting from</p>
        <div className="flex items-end gap-2 mb-5">
          <span className="text-4xl sm:text-5xl font-bold text-[#D97706]">${pkg.priceUSD.toLocaleString()}</span>
          <span className="text-zinc-400 text-sm mb-1">per person</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-5">
          <PriceInfo label="Duration" value={`${pkg.durationDays} Days / ${pkg.durationNights} Nights`} />
          <PriceInfo label="Group Size" value={pkg.groupSize} />
          <PriceInfo label="Difficulty" value={pkg.difficulty} />
          <PriceInfo label="Style" value={pkg.safariStyle} />
        </div>

        {/* Interactive Calculator */}
        <div className="border-t border-zinc-600/50 pt-5">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Calculator size={16} weight="fill" className="text-[#D97706]" />
            Estimate Your Trip
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Travelers</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Minus size={14} weight="bold" />
                </button>
                <span className="text-xl font-bold w-8 text-center">{travelers}</span>
                <button onClick={() => setTravelers(Math.min(12, travelers + 1))} className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Season</label>
              <div className="flex gap-1.5">
                {(["low", "shoulder", "peak"] as const).map((s) => (
                  <button key={s} onClick={() => setSeason(s)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      season === s ? "bg-[#D97706] text-white" : "bg-white/10 text-zinc-300 hover:bg-white/20"
                    }`}>
                    {s === "low" ? "Low" : s === "shoulder" ? "Shoulder" : "Peak"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-300">Per person ({season})</span>
              <span className="font-semibold">${perPerson.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300">x {travelers} traveler{travelers > 1 ? "s" : ""}</span>
              <span className="font-semibold">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-[#D97706]/30">
              <span>Estimated Total</span>
              <span className="text-[#D97706]">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-[#1E1B18] mb-2">Price Notes</h4>
        <ul className="space-y-1.5 text-sm text-zinc-600">
          <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D97706] mt-2 shrink-0" /> Prices are per person sharing a twin/double room</li>
          <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D97706] mt-2 shrink-0" /> Single occupancy supplement: +$150 per night</li>
          <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D97706] mt-2 shrink-0" /> Children (6-15 years): 25% discount on sharing basis</li>
          <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D97706] mt-2 shrink-0" /> Private departures available at premium rates</li>
          <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D97706] mt-2 shrink-0" /> Peak season surcharge applies (Jul-Sep, Dec-Feb)</li>
        </ul>
      </div>

      <button
        onClick={onInquire}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white font-bold text-base hover:shadow-xl hover:shadow-[#D97706]/25 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
      >
        Book This Safari — ${total.toLocaleString()}
        <ArrowRight size={18} weight="bold" />
      </button>
    </div>
  );
}

function PriceInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-zinc-400 text-xs">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}