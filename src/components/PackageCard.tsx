import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Clock, Tag, ArrowRight, Envelope } from "@phosphor-icons/react";
import type { SafariPackage } from "@/types";

interface PackageCardProps {
  pkg: SafariPackage;
  index: number;
  onExplore: (pkg: SafariPackage) => void;
  onQuickInquiry: (pkg: SafariPackage) => void;
}

export default function PackageCard({ pkg, index, onExplore, onQuickInquiry }: PackageCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#F5EFE6] shadow-lg hover:shadow-2xl hover:shadow-[#D97706]/15 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <img
          src={pkg.heroImage}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {pkg.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-xs font-bold uppercase tracking-wide shadow-lg">
            {pkg.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-[#D97706] font-bold text-sm">
          ${pkg.priceUSD.toLocaleString()} <span className="text-zinc-300 font-normal text-xs">pp</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-xl sm:text-2xl text-[#1E1B18] leading-tight mb-1 group-hover:text-[#B45309] transition-colors">
          {pkg.title}
        </h3>
        <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{pkg.tagline}</p>

        {/* Meta Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <MetaPill icon={<Clock size={13} weight="fill" />} text={`${pkg.durationDays}D / ${pkg.durationNights}N`} />
          <MetaPill icon={<Users size={13} weight="fill" />} text={pkg.groupSize} />
          <MetaPill icon={<Calendar size={13} weight="fill" />} text={pkg.bestMonths} />
          <MetaPill icon={<Tag size={13} weight="fill" />} text={pkg.safariStyle} />
        </div>

        {/* Parks */}
        <div className="flex items-center gap-1.5 mb-4 text-xs text-zinc-500">
          <MapPin size={13} weight="fill" className="text-[#365314]" />
          <span>{pkg.parks.join(", ")}</span>
        </div>

        {/* Highlights Preview */}
        <ul className="space-y-1 mb-5">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              {h}
            </li>
          ))}
          {pkg.highlights.length > 3 && (
            <li className="text-xs text-[#B45309] font-medium pl-3.5">+{pkg.highlights.length - 3} more highlights</li>
          )}
        </ul>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onExplore(pkg)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E1B18] text-white text-sm font-semibold hover:bg-[#2a2622] active:scale-[0.98] transition-all duration-200"
          >
            Explore Itinerary
            <ArrowRight size={14} weight="bold" />
          </button>
          <button
            onClick={() => onQuickInquiry(pkg)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[#D97706] text-[#D97706] text-sm font-semibold hover:bg-[#D97706]/10 active:scale-[0.98] transition-all duration-200"
          >
            <Envelope size={14} weight="fill" />
            <span className="hidden sm:inline">Inquire</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function MetaPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5EFE6] text-zinc-600 text-xs font-medium">
      <span className="text-[#B45309]">{icon}</span>
      {text}
    </span>
  );
}
