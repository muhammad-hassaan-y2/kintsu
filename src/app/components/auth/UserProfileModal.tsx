"use client";

import { X, User, Mail, ShieldCheck, Calendar, LogOut, Award, Building2, CheckCircle2 } from "lucide-react";

const T = {
  navy:      "#0A1628",
  midnight:  "#1E3A5F",
  midnightL: "#243F6A",
  gold:      "#C9A227",
  goldDim:   "rgba(201,162,39,0.18)",
  cream:     "#F5F0E8",
  creamDim:  "rgba(245,240,232,0.65)",
  slateL:    "#94A3B8",
  border:    "rgba(201,162,39,0.15)",
  ease:      "cubic-bezier(0.4,0,0.2,1)",
};

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id?: number | string;
    fullName?: string;
    email?: string;
    role?: string;
    createdAt?: string;
  } | null;
  onLogout: () => void;
}

export function UserProfileModal({ isOpen, onClose, user, onLogout }: UserProfileModalProps) {
  if (!isOpen || !user) return null;

  const initials = user.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase()
    : "PR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
      <div 
        className="relative w-full max-w-md p-8 rounded-3xl border shadow-2xl scale-in"
        style={{
          backgroundColor: T.midnight,
          borderColor: T.goldDim,
          boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(201,162,39,0.15)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl text-white mx-auto shadow-xl border-2"
              style={{
                backgroundColor: T.navy,
                borderColor: T.gold,
                boxShadow: "0 4px 20px rgba(201,162,39,0.3)",
              }}
            >
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>

          <h2 className="text-2xl font-extrabold text-white">{user.fullName || "Priya Rajan"}</h2>
          <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: T.gold }}>
            {user.role || "Counselor"} · Authorized Officer
          </p>
        </div>

        {/* User Info Details Grid */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-2xl border flex items-center gap-3 text-xs" style={{ backgroundColor: T.navy, borderColor: T.border }}>
            <Mail className="w-4 h-4 shrink-0 text-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</p>
              <p className="text-white font-medium truncate">{user.email || "demo@kintsu.org"}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border flex items-center gap-3 text-xs" style={{ backgroundColor: T.navy, borderColor: T.border }}>
            <Building2 className="w-4 h-4 shrink-0 text-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Assigned Facility Unit</p>
              <p className="text-white font-medium">Block 4B · Correctional Facility</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border flex items-center gap-3 text-xs" style={{ backgroundColor: T.navy, borderColor: T.border }}>
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Database & Security</p>
              <p className="text-emerald-400 font-bold">Neon PostgreSQL Verified</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            style={{ borderColor: T.border }}
          >
            Close Profile
          </button>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-red-600/20 text-red-300 border border-red-500/40 hover:bg-red-600/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
