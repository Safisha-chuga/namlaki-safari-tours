import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneRight, SealCheck, Envelope, X, Trash, MagnifyingGlass, Calendar, Users, Phone, MapPin, CheckCircle, Clock, CaretDown, Tag } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { SafariPackage, Inquiry } from "@/types";
import { COMPANY, ADDONS, safariPackages } from "@/data/safariData";

const STORAGE_KEY = "namlaki_inquiries";

function loadInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveInquiries(list: Inquiry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ─── Inquiry Form ─── */
interface FormProps {
  selectedPkg?: SafariPackage | null;
  onSubmitted: (inq: Inquiry) => void;
}

export function InquiryForm({ selectedPkg, onSubmitted }: FormProps) {
  const [pkgId, setPkgId] = useState(selectedPkg?.id ?? safariPackages[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState("Luxury Lodge");
  const [requests, setRequests] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (selectedPkg) setPkgId(selectedPkg.id);
  }, [selectedPkg]);

  const pkg = safariPackages.find((p) => p.id === pkgId) ?? safariPackages[0];
  const addonTotal = addons.reduce((sum, a) => sum + (ADDONS.find((x) => x.name === a)?.price ?? 0), 0);
  const estimatedTotal = pkg.priceUSD * travelers + addonTotal;

  const toggleAddon = (name: string) =>
    setAddons((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date) {
      toast.error("Please fill in your name, email, and travel date.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));

    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      packageId: pkg.id,
      packageName: pkg.title,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      travelDate: date,
      travelersCount: travelers,
      travelStyle: style,
      specialRequests: requests,
      addons,
      estimatedTotal,
      createdAt: new Date().toISOString(),
      status: "New",
      dispatchedToEmail: COMPANY.email,
    };

    const existing = loadInquiries();
    saveInquiries([inquiry, ...existing]);
    onSubmitted(inquiry);
    setSubmitting(false);
    setDispatched(true);
    toast.success(`Inquiry dispatched to ${COMPANY.email}!`);
    setTimeout(() => setDispatched(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Package Select */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Safari Package</label>
        <select
          value={pkgId}
          onChange={(e) => setPkgId(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706]"
        >
          {safariPackages.map((p) => (
            <option key={p.id} value={p.id}>{p.title} (${p.priceUSD.toLocaleString()} pp)</option>
          ))}
        </select>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Full Name" icon={<Users size={15} weight="fill" />} value={name} onChange={setName} placeholder="Your full name" required />
        <InputField label="Email" icon={<Envelope size={15} weight="fill" />} type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
      </div>

      {/* Phone & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Phone" icon={<Phone size={15} weight="fill" />} type="tel" value={phone} onChange={setPhone} placeholder="+255..." />
        <InputField label="Preferred Travel Date" icon={<Calendar size={15} weight="fill" />} type="date" value={date} onChange={setDate} required />
      </div>

      {/* Travelers & Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Travelers</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-9 h-9 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-bold">-</button>
            <span className="text-lg font-semibold text-[#1E1B18] w-8 text-center">{travelers}</span>
            <button type="button" onClick={() => setTravelers(Math.min(20, travelers + 1))} className="w-9 h-9 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-bold">+</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Accommodation Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
          >
            {["Luxury Lodge", "Tented Camp", "Mid-range", "Fly-in Safari"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Optional Add-ons</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ADDONS.map((a) => (
            <button
              type="button"
              key={a.name}
              onClick={() => toggleAddon(a.name)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${
                addons.includes(a.name)
                  ? "border-[#D97706] bg-[#D97706]/10 text-[#B45309] font-medium"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {addons.includes(a.name) ? <CheckCircle size={14} weight="fill" /> : <Tag size={14} />}
                {a.name}
              </span>
              <span className="font-semibold">${a.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Special Requests</label>
        <textarea
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
          placeholder="Dietary needs, celebrations, accessibility, photography goals..."
          rows={3}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 resize-none"
        />
      </div>

      {/* Price Breakdown */}
      <div className="rounded-xl bg-[#F5EFE6] border border-[#D97706]/20 p-4">
        <h4 className="font-semibold text-[#1E1B18] text-sm mb-2">Estimated Total</h4>
        <div className="space-y-1 text-sm text-zinc-600">
          <div className="flex justify-between"><span>{pkg.title} x {travelers}</span><span>${(pkg.priceUSD * travelers).toLocaleString()}</span></div>
          {addons.length > 0 && (
            <div className="flex justify-between"><span>Add-ons ({addons.length})</span><span>${addonTotal.toLocaleString()}</span></div>
          )}
          <div className="flex justify-between font-bold text-[#1E1B18] pt-2 border-t border-[#D97706]/20">
            <span>Total Estimate</span><span className="text-[#B45309]">${estimatedTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white font-bold text-base disabled:opacity-60 hover:shadow-xl hover:shadow-[#D97706]/25 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block">
            <PaperPlaneRight size={20} weight="fill" />
          </motion.span>
        ) : dispatched ? (
          <>
            <SealCheck size={20} weight="fill" /> Sent to {COMPANY.email}
          </>
        ) : (
          <>
            <PaperPlaneRight size={20} weight="fill" /> Send Inquiry
          </>
        )}
      </button>

      <AnimatePresence>
        {dispatched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-[#365314] bg-[#365314]/10 rounded-lg px-4 py-3"
          >
            <CheckCircle size={16} weight="fill" />
            Inquiry forwarded to <strong>{COMPANY.email}</strong>. Jackson & Nimzana will respond within 24 hours.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ─── Mailbox Drawer ─── */
interface MailboxProps {
  inquiries: Inquiry[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Inquiry["status"]) => void;
}

export function MailboxDrawer({ inquiries, onClose, onDelete, onUpdateStatus }: MailboxProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    const matchSearch = !search || inq.customerName.toLowerCase().includes(search.toLowerCase()) || inq.packageName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || inq.status === filter;
    return matchSearch && matchFilter;
  });

  const statuses: Array<Inquiry["status"] | "All"> = ["All", "New", "Contacted", "Confirmed"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1E1B18] text-white shrink-0">
          <div className="flex items-center gap-2">
            <Envelope size={18} weight="fill" className="text-[#D97706]" />
            <h3 className="font-semibold">Inquiry Mailbox</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#D97706]/20 text-[#D97706] text-xs font-bold">{inquiries.length}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="px-4 py-3 space-y-2 border-b border-zinc-100 shrink-0">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or package..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/30"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === s ? "bg-[#D97706] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {s === "All" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-12">
              <Envelope size={40} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">No inquiries yet</p>
              <p className="text-xs mt-1">Submit a booking inquiry to see it here</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {filtered.map((inq) => (
                <button
                  key={inq.id}
                  onClick={() => setSelected(selected?.id === inq.id ? null : inq)}
                  className={`w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors ${selected?.id === inq.id ? "bg-[#F5EFE6]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E1B18] truncate">{inq.customerName}</p>
                      <p className="text-xs text-zinc-500 truncate">{inq.packageName}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inq.status === "Confirmed" ? "bg-[#365314]/15 text-[#365314]" :
                      inq.status === "Contacted" ? "bg-[#D97706]/15 text-[#B45309]" :
                      "bg-zinc-100 text-zinc-600"
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-400">
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    <span>${inq.estimatedTotal.toLocaleString()}</span>
                    <span>{inq.travelersCount} pax</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inspector */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-zinc-200 bg-[#FAF8F5] overflow-hidden shrink-0"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1E1B18] text-sm">{selected.customerName}</h4>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onUpdateStatus(selected.id, "Contacted")}
                      className="px-2.5 py-1 rounded-lg bg-[#D97706] text-white text-xs font-medium hover:bg-[#B45309] transition-colors"
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => onUpdateStatus(selected.id, "Confirmed")}
                      className="px-2.5 py-1 rounded-lg bg-[#365314] text-white text-xs font-medium hover:bg-[#2d4512] transition-colors ml-1.5"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => { onDelete(selected.id); setSelected(null); }}
                      className="px-2.5 py-1 rounded-lg bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <Trash size={12} /> Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <DetailRow label="Package" value={selected.packageName} />
                  <DetailRow label="Travel Date" value={selected.travelDate} />
                  <DetailRow label="Email" value={selected.customerEmail} />
                  <DetailRow label="Phone" value={selected.customerPhone || "N/A"} />
                  <DetailRow label="Travelers" value={`${selected.travelersCount}`} />
                  <DetailRow label="Style" value={selected.travelStyle} />
                  <DetailRow label="Est. Total" value={`$${selected.estimatedTotal.toLocaleString()}`} />
                  <DetailRow label="Dispatched To" value={selected.dispatchedToEmail} />
                </div>
                {selected.addons.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">Add-ons</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.addons.map((a) => (
                        <span key={a} className="px-2 py-0.5 rounded-full bg-[#D97706]/10 text-[#B45309] text-[11px]">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selected.specialRequests && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">Special Requests</p>
                    <p className="text-xs text-zinc-600 bg-white rounded-lg p-2 border border-zinc-200">{selected.specialRequests}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-100 bg-white shrink-0 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1"><MapPin size={12} weight="fill" /> {COMPANY.location}</span>
          <span className="flex items-center gap-1"><Clock size={12} weight="fill" /> {COMPANY.hours.split("|")[0].trim()}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InputField({ label, icon, value, onChange, type = "text", placeholder, required }: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label}{required && <span className="text-[#EA580C]"> *</span>}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706]"
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-zinc-400">{label}</p>
      <p className="font-medium text-zinc-700 truncate">{value}</p>
    </div>
  );
}