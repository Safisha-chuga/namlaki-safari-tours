import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Users, ShieldCheck, Star, ArrowRight, Binoculars, PawPrint } from "@phosphor-icons/react";
import { HERO_IMG } from "@/data/safariData";

const parks = ["All Parks", "Serengeti", "Ngorongoro", "Tarangire"];
const durations = ["Any Duration", "3-5 Days", "6-8 Days"];
const styles = ["All Styles", "Luxury Lodge", "Tented Camp", "Mid-range"];

interface HeroProps {
  onFilter: (park: string, duration: string, style: string) => void;
}

export default function Hero({ onFilter }: HeroProps) {
  const [park, setPark] = useState("All Parks");
  const [duration, setDuration] = useState("Any Duration");
  const [style, setStyle] = useState("All Styles");

  const handleSearch = () => {
    onFilter(park, duration, style);
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Serengeti savanna at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B18]/70 via-[#1E1B18]/40 to-[#1E1B18]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B18]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D97706]/20 border border-[#D97706]/30 text-[#D97706] text-xs sm:text-sm font-medium uppercase tracking-[0.15em] mb-6"
          >
            <Binoculars size={14} weight="fill" />
            Tanzania Safari Specialists
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-5"
          >
            Experience the Wild Soul of Tanzania
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-zinc-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Handcrafted itineraries by Jackson & Nimzana Safisha. From the Serengeti plains to Ngorongoro Crater, your African story starts here.
          </motion.p>

          {/* Quick Filter */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="bg-[#1E1B18]/80 backdrop-blur-lg rounded-2xl border border-zinc-700/50 p-4 sm:p-6 max-w-3xl mx-auto mb-10 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <FilterSelect label="Park" options={parks} value={park} onChange={setPark} />
              <FilterSelect label="Duration" options={durations} value={duration} onChange={setDuration} />
              <FilterSelect label="Style" options={styles} value={style} onChange={setStyle} />
            </div>
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#D97706]/30 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <Compass size={16} weight="fill" />
              Find My Safari
              <ArrowRight size={14} weight="bold" />
            </button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-10 text-zinc-300 mb-6"
          >
            <TrustItem icon={<ShieldCheck size={18} weight="fill" className="text-[#D97706]" />} label="100% Custom Itineraries" />
            <TrustItem icon={<Star size={18} weight="fill" className="text-[#D97706]" />} label="4.98/5 Traveler Rating" />
            <TrustItem icon={<Users size={18} weight="fill" className="text-[#D97706]" />} label="4x4 Land Cruisers" />
            <TrustItem icon={<Compass size={18} weight="fill" className="text-[#D97706]" />} label="Direct Local Guides" />
          </motion.div>

          {/* Wildlife Sighting Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm"
          >
            <PawPrint size={14} weight="fill" className="text-emerald-400 animate-pulse" />
            <span className="font-medium">Recently Spotted:</span>
            <span className="text-emerald-300">Tree-Climbing Lions in Lake Manyara &bull; Black Rhino in Ngorongoro &bull; Migration at Mara River</span>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-zinc-400/40 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-[#D97706]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FilterSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-800/80 border border-zinc-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D97706] cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <span>{label}</span>
    </div>
  );
}