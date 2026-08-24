"use client";

import { useState } from "react";
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle, AlertCircle, Sparkles, FileText, Building2, Layers } from "lucide-react";
import { loginUser, signupUser, demoLogin } from "@/lib/api";

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
  onSuccess: (user?: any) => void;
}

export function AuthModal({ isOpen, onClose, defaultTab = "login", onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Prisoner Intake Section State (Sign Up)
  const [prisonerName, setPrisonerName] = useState("");
  const [inmateId, setInmateId] = useState(`INM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [securityBlock, setSecurityBlock] = useState("Block 4B");
  const [riskLevel, setRiskLevel] = useState("Low Risk");
  const [rehabTrack, setRehabTrack] = useState("Emotional Regulation");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let res: any;
      if (tab === "login") {
        res = await loginUser(email, password);
      } else {
        res = await signupUser(email, password, name || "Counselor", "counselor", {
          prisonerName: prisonerName || "Marcus Vance",
          inmateId: inmateId,
          securityBlock: securityBlock,
          riskLevel: riskLevel,
          rehabTrack: rehabTrack,
        });
      }
      setIsSubmitting(false);
      onSuccess(res?.user);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Authentication failed. Please check your details.");
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await demoLogin();
      setIsSubmitting(false);
      onSuccess(res?.user);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Demo login failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm fade-in">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 rounded-2xl border shadow-2xl scale-in"
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
            {tab === "login" ? "Welcome Back to Kintsu" : "Create Counselor Account"}
          </h2>
          <p className="text-sm mt-1" style={{ color: T.slateL }}>
            {tab === "login" ? "Access your rehabilitation & counseling workspace" : "Register officer credentials & initial prisoner file"}
          </p>
        </div>

        {/* One-Click Demo User Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="w-full py-2.5 mb-5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-amber-500/20 active:scale-95 cursor-pointer"
          style={{
            borderColor: T.gold,
            color: T.gold,
            backgroundColor: "rgba(201,162,39,0.1)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>One-Click Demo Account Login (demo@kintsu.org)</span>
        </button>

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
                Counselor Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Officer Hassaan"
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
                placeholder="hassaan@kintsu.org"
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

          {/* Initial Prisoner Rehabilitation File Section (Sign Up Only) */}
          {tab === "signup" && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: T.border }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4" style={{ color: T.gold }} />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Initial Assigned Prisoner Rehabilitation File
                </span>
              </div>

              <div className="space-y-3 p-4 rounded-xl border" style={{ backgroundColor: T.navy, borderColor: T.border }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T.slateL }}>
                      Prisoner Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Marcus Vance"
                      value={prisonerName}
                      onChange={(e) => setPrisonerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none"
                      style={{
                        backgroundColor: T.midnight,
                        borderColor: T.border,
                        color: T.cream,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T.slateL }}>
                      Inmate ID Code
                    </label>
                    <input
                      type="text"
                      required
                      value={inmateId}
                      onChange={(e) => setInmateId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold focus:outline-none"
                      style={{
                        backgroundColor: T.midnight,
                        borderColor: T.border,
                        color: T.gold,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T.slateL }}>
                      Facility Unit
                    </label>
                    <select
                      value={securityBlock}
                      onChange={(e) => setSecurityBlock(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border text-xs focus:outline-none cursor-pointer"
                      style={{
                        backgroundColor: T.midnight,
                        borderColor: T.border,
                        color: T.cream,
                      }}
                    >
                      <option value="Block 4B">Block 4B</option>
                      <option value="Block 2A">Block 2A</option>
                      <option value="Block 1C">Block 1C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T.slateL }}>
                      Risk Level
                    </label>
                    <select
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border text-xs focus:outline-none cursor-pointer"
                      style={{
                        backgroundColor: T.midnight,
                        borderColor: T.border,
                        color: T.cream,
                      }}
                    >
                      <option value="Low Risk">Low Risk</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="High Risk">High Risk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T.slateL }}>
                      Rehab Track
                    </label>
                    <select
                      value={rehabTrack}
                      onChange={(e) => setRehabTrack(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border text-xs focus:outline-none cursor-pointer"
                      style={{
                        backgroundColor: T.midnight,
                        borderColor: T.border,
                        color: T.cream,
                      }}
                    >
                      <option value="Emotional Regulation">Emotional</option>
                      <option value="Conflict De-escalation">Conflict</option>
                      <option value="Re-entry Readiness">Re-entry</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              <span>Saves counselor credentials & prisoner intake file in Neon DB</span>
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
              <span>Saving Account to Neon DB...</span>
            ) : (
              <>
                <span>{tab === "login" ? "Enter Dashboard" : "Register Account & Initial Prisoner File"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
