"use client";

import { useState } from "react";
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";
import { loginUser, signupUser } from "@/lib/api";

const T = {
  navy:      "#0A1628",
  midnight:  "#1E3A5F",
  midnightL: "#243F6A",
  gold:      "#C9A227",
  goldDim:   "rgba(201,162,39,0.18)",
  cream:     "#F5F0E8",
  creamDim:  "rgba(245,240,232,0.65)",
  slateL:    "#94A3B8",
  border:    "rgba(201,162,39,0.13)",
  ease:      "cubic-bezier(0.4,0,0.2,1)",
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, defaultTab = "login", onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (tab === "login") {
        await loginUser(email, password);
      } else {
        await signupUser(email, password, name || "Counselor");
      }
      setIsSubmitting(false);
      onSuccess();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Authentication failed. Please check your details.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm fade-in">
      <div 
        className="relative w-full max-w-md p-8 rounded-2xl border shadow-2xl scale-in"
        style={{
          backgroundColor: T.midnight,
          borderColor: T.goldDim,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 border" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
            <ShieldCheck className="w-6 h-6" style={{ color: T.gold }} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {tab === "login" ? "Welcome Back to Kintsu" : "Create your Kintsu Account"}
          </h2>
          <p className="text-sm mt-1" style={{ color: T.slateL }}>
            {tab === "login" ? "Access your design system and intelligence dashboard" : "Join leading rehabilitation officers & counselors"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl mb-6 border" style={{ backgroundColor: T.navy, borderColor: T.border }}>
          <button
            onClick={() => { setTab("login"); setErrorMessage(""); }}
            className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
            style={{
              backgroundColor: tab === "login" ? T.gold : "transparent",
              color: tab === "login" ? T.navy : T.creamDim,
            }}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab("signup"); setErrorMessage(""); }}
            className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
            style={{
              backgroundColor: tab === "signup" ? T.gold : "transparent",
              color: tab === "signup" ? T.navy : T.creamDim,
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl border bg-red-950/60 border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: T.creamDim }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Priya Rajan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all"
                  style={{
                    backgroundColor: T.navy,
                    borderColor: T.border,
                    color: T.cream,
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: T.creamDim }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="admin@kintsu.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: T.navy,
                  borderColor: T.border,
                  color: T.cream,
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: T.creamDim }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: T.navy,
                  borderColor: T.border,
                  color: T.cream,
                }}
              />
            </div>
          </div>

          {tab === "login" ? (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: T.slateL }}>
                <input type="checkbox" className="rounded bg-navy border-gold/30 text-gold" defaultChecked />
                Remember me
              </label>
              <a href="#" className="hover:underline" style={{ color: T.gold }}>
                Forgot Password?
              </a>
            </div>
          ) : (
            <div className="text-xs flex items-center gap-2" style={{ color: T.slateL }}>
              <CheckCircle className="w-4 h-4" style={{ color: T.gold }} />
              <span>Connects securely to Neon PostgreSQL database</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            style={{
              backgroundColor: T.gold,
              color: T.navy,
              boxShadow: "0 4px 20px rgba(201,162,39,0.3)",
            }}
          >
            {isSubmitting ? (
              <span>Authenticating with Neon DB...</span>
            ) : (
              <>
                <span>{tab === "login" ? "Enter Dashboard" : "Create Account & Enter"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
