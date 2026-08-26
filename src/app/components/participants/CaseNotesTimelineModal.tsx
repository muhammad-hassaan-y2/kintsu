"use client";

import { useState, useEffect } from "react";
import { X, FileText, Send, Clock, User, ShieldCheck, Tag, Plus, CheckCircle, RefreshCw } from "lucide-react";
import { fetchCaseNotes, createCaseNote } from "@/lib/api";

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
  green:     "#22C55E",
};

interface CaseNotesTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  inmateId: string;
  inmateName: string;
}

export function CaseNotesTimelineModal({ isOpen, onClose, inmateId, inmateName }: CaseNotesTimelineModalProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState("");
  const [category, setCategory] = useState("Counseling Session");
  const [counselorName, setCounselorName] = useState("Counselor Officer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadTimelineNotes = async () => {
    if (!inmateId) return;
    setLoading(true);
    try {
      const res = await fetchCaseNotes(inmateId);
      if (res && res.data) {
        setNotes(res.data);
      }
    } catch (err) {
      console.warn("Could not load case notes timeline from Neon DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && inmateId) {
      loadTimelineNotes();
    }
  }, [isOpen, inmateId]);

  if (!isOpen) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      await createCaseNote(inmateId, {
        note_text: newNoteText.trim(),
        category: category,
        counselor_name: counselorName
      });
      setNewNoteText("");
      setSuccessMessage("✓ Case note saved to Neon PostgreSQL timeline.");
      await loadTimelineNotes();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to save case note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryColors: Record<string, string> = {
    "Counseling Session": T.gold,
    "Behavioral Check": "#60A5FA",
    "Rehab Milestone": T.green,
    "Incident Report": "#EF4444"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-2xl border shadow-2xl scale-in"
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
        <div className="flex items-center gap-3 pb-4 mb-4 border-b" style={{ borderColor: T.border }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
            <FileText className="w-5 h-5" style={{ color: T.gold }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{inmateName}</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>
                {inmateId}
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Interactive Case Notes & Rehabilitation Timeline (Neon PostgreSQL)
            </p>
          </div>
        </div>

        {/* Note Submission Form */}
        <form onSubmit={handleAddNote} className="mb-5 p-4 rounded-xl border space-y-3" style={{ backgroundColor: T.navy, borderColor: T.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Post New Case Note
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg border text-xs font-semibold outline-none cursor-pointer"
              style={{ backgroundColor: T.midnight, borderColor: T.border, color: T.cream }}
            >
              <option value="Counseling Session">Counseling Session</option>
              <option value="Behavioral Check">Behavioral Check</option>
              <option value="Rehab Milestone">Rehab Milestone</option>
              <option value="Incident Report">Incident Report</option>
            </select>
          </div>

          <textarea
            required
            rows={2}
            placeholder="Type confidential case observations, session reflections, or behavioral milestones..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="w-full p-3 rounded-lg border text-xs outline-none resize-none"
            style={{ backgroundColor: T.midnight, borderColor: T.border, color: T.cream }}
          />

          <div className="flex items-center justify-between">
            {successMessage ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {successMessage}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Stores permanently in Neon PostgreSQL</span>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: T.gold, color: T.navy }}
            >
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isSubmitting ? "Saving..." : "Post Case Note"}</span>
            </button>
          </div>
        </form>

        {/* Timeline Stream */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-amber-400 text-xs gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading timeline notes from Neon DB...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl" style={{ borderColor: T.border }}>
              <p className="text-xs text-slate-400">No case notes logged for this inmate yet. Use the form above to add the first entry.</p>
            </div>
          ) : (
            notes.map((n: any, idx: number) => {
              const catColor = categoryColors[n.category] || T.gold;
              return (
                <div key={n.id || idx} className="relative pl-6 pb-4 border-l-2 last:pb-0" style={{ borderColor: `${T.gold}44` }}>
                  {/* Bullet Marker */}
                  <div 
                    className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ backgroundColor: T.midnight, borderColor: catColor }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
                  </div>

                  {/* Note Content Card */}
                  <div className="p-3.5 rounded-xl border space-y-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: T.border }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${catColor}22`, color: catColor }}>
                          {n.category}
                        </span>
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> {n.counselorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-200">{n.noteText}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
