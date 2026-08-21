"use client";

import { useState } from "react";
import { 
  FileText, UserPlus, Shield, Layers, ArrowRight, CheckCircle2, 
  X, AlertCircle, Sparkles, Building2
} from "lucide-react";
import { createPrisonerIntake } from "@/lib/api";

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

interface PrisonerIntakeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PrisonerIntakeWizard({ isOpen, onClose, onSuccess }: PrisonerIntakeWizardProps) {
  const [inmateId, setInmateId] = useState(`INM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [fullName, setFullName] = useState("");
  const [securityBlock, setSecurityBlock] = useState("Block 4B");
  const [riskLevel, setRiskLevel] = useState("Low Risk");
  const [rehabTrack, setRehabTrack] = useState("Emotional Regulation & Growth");
  const [counselorNotes, setCounselorNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await createPrisonerIntake({
        inmate_id: inmateId,
        full_name: fullName,
        security_block: securityBlock,
        risk_level: riskLevel,
        rehab_track: rehabTrack,
        counselor_notes: counselorNotes,
      });

      setIsSubmitting(false);
      setSuccessMsg(`Prisoner File '${inmateId}' created successfully in Neon DB!`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Failed to create Prisoner File.");
    }
  };

  const handleFillTemplate = () => {
    setInmateId(`INM-${Math.floor(1000 + Math.random() * 9000)}`);
    setFullName("Marcus Vance");
    setSecurityBlock("Block 4B");
    setRiskLevel("Low Risk");
    setRehabTrack("Conflict De-escalation");
    setCounselorNotes("Demonstrates strong active listening, emotional discipline, and positive peer mentorship.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
      <div 
        className="relative w-full max-w-xl p-8 rounded-3xl border shadow-2xl scale-in"
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

        {/* Wizard Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
            <FileText className="w-6 h-6" style={{ color: T.gold }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Prisoner File Onboarding & Intake</h2>
            <p className="text-xs" style={{ color: T.slateL }}>Create a structured rehabilitation record for group classroom tracking</p>
          </div>
        </div>

        {/* Quick Sample Fill Button */}
        <button
          type="button"
          onClick={handleFillTemplate}
          className="w-full py-2 mb-6 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-amber-500/20 active:scale-95 cursor-pointer"
          style={{
            borderColor: T.gold,
            color: T.gold,
            backgroundColor: "rgba(201,162,39,0.1)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Fill Sample Prisoner Intake Record</span>
        </button>

        {/* Alert Feedback Banners */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border bg-red-950/70 border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl border bg-emerald-950/70 border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Intake Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.creamDim }}>
                Inmate ID Code
              </label>
              <input
                type="text"
                required
                value={inmateId}
                onChange={(e) => setInmateId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none"
                style={{
                  backgroundColor: T.navy,
                  borderColor: T.border,
                  color: T.gold,
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.creamDim }}>
                Prisoner Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Marcus Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none"
                style={{
                  backgroundColor: T.navy,
                  borderColor: T.border,
                  color: T.cream,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.creamDim }}>
                Facility Unit / Block
              </label>
              <select
                value={securityBlock}
                onChange={(e) => setSecurityBlock(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: T.navy,
                  borderColor: T.border,
                  color: T.cream,
                }}
              >
                <option value="Block 4B">Block 4B (Medium Security)</option>
                <option value="Block 2A">Block 2A (General Population)</option>
                <option value="Block 1C">Block 1C (Transition Readiness)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.creamDim }}>
                Initial Risk Level
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: T.navy,
                  borderColor: T.border,
                  color: T.cream,
                }}
              >
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="Transition Ready">Transition Ready</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.creamDim }}>
                Rehabilitation Track
              </label>
              <select
                value={rehabTrack}
                onChange={(e) => setRehabTrack(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: T.navy,
                  borderColor: T.border,
                  color: T.cream,
                }}
              >
                <option value="Emotional Regulation & Growth">Emotional Regulation</option>
                <option value="Conflict De-escalation">Conflict De-escalation</option>
                <option value="Re-entry & Reintegration">Re-entry Readiness</option>
                <option value="Substance & Behavior Recovery">Substance Recovery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.creamDim }}>
              Counselor Case Notes & Initial Objectives
            </label>
            <textarea
              rows={3}
              placeholder="Record initial counselor observations, group session goals, or specific rehabilitation targets..."
              value={counselorNotes}
              onChange={(e) => setCounselorNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed focus:outline-none"
              style={{
                backgroundColor: T.navy,
                borderColor: T.border,
                color: T.cream,
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer"
            style={{
              backgroundColor: T.gold,
              color: T.navy,
              boxShadow: "0 4px 20px rgba(201,162,39,0.35)",
            }}
          >
            {isSubmitting ? (
              <span>Saving File to Neon DB...</span>
            ) : (
              <>
                <span>Save & Create Prisoner File</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
