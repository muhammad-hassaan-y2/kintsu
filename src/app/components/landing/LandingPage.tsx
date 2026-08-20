"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Layers, ShieldCheck, ArrowRight, Play, BookOpen, 
  Theater, Users, BarChart3, CheckCircle2, ChevronRight, Award, 
  Presentation, Clock, FileText, Heart, Video, MessageCircle, Star, HelpCircle
} from "lucide-react";
import { AuthModal } from "@/app/components/auth/AuthModal";

const T = {
  navy:      "#0A1628",
  midnight:  "#1E3A5F",
  midnightL: "#243F6A",
  gold:      "#C9A227",
  goldDim:   "rgba(201,162,39,0.18)",
  burgundy:  "#722F37",
  cream:     "#F5F0E8",
  creamDim:  "rgba(245,240,232,0.65)",
  slateL:    "#94A3B8",
  border:    "rgba(201,162,39,0.15)",
  ease:      "cubic-bezier(0.4,0,0.2,1)",
};

export function LandingPage() {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">("login");
  const [activeFeatureTab, setActiveFeatureTab] = useState<"classroom" | "roleplay" | "stories" | "analytics">("classroom");

  const openAuth = (tab: "login" | "signup") => {
    setAuthDefaultTab(tab);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setAuthModalOpen(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-gold/30 selection:text-gold" style={{ backgroundColor: T.navy }}>
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ backgroundColor: `${T.navy}DD`, borderColor: T.border }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/kintsu-logo.png" alt="Kintsu Logo" className="h-9 w-auto" />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wide text-white leading-none">KINTSU</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: T.gold }}>Rehabilitation Suite</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: T.creamDim }}>
            <a href="#overview" className="hover:text-white transition-colors">Classroom Model</a>
            <a href="#showcase" className="hover:text-white transition-colors">Instructor Tools</a>
            <a href="#impact" className="hover:text-white transition-colors">Facility Impact</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => openAuth("login")}
              className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors hover:text-white"
              style={{ color: T.creamDim }}
            >
              Counselor Login
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: T.gold,
                color: T.navy,
                boxShadow: "0 4px 18px rgba(201,162,39,0.3)",
              }}
            >
              <span>Launch Classroom Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Compact Hero Section */}
      <section id="overview" className="relative overflow-hidden pt-16 pb-12 border-b" style={{ borderColor: T.border }}>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full blur-[130px] pointer-events-none"
          style={{ backgroundColor: "rgba(201,162,39,0.09)" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              backgroundColor: "rgba(201,162,39,0.1)",
              borderColor: T.goldDim,
              color: T.gold,
            }}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Instructor-Led Presentation System for Correctional Facilities</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Empower Counselors & Officers to Lead <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Impactful Rehabilitation Sessions</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base md:text-lg max-w-3xl mx-auto font-normal leading-relaxed" style={{ color: T.creamDim }}>
            Designed for group classrooms inside prisons—eliminating the need for individual prisoner devices. A single instructor guides the session with structured modules, real stories, roleplay scenarios, and case analytics.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold rounded-xl flex items-center justify-center gap-3 shadow-xl transition-all hover:opacity-95 active:scale-95"
              style={{
                backgroundColor: T.gold,
                color: T.navy,
                boxShadow: "0 6px 24px rgba(201,162,39,0.35)",
              }}
            >
              <span>Enter Session Suite</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => openAuth("login")}
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold rounded-xl border flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
              style={{
                borderColor: T.border,
                color: T.cream,
                backgroundColor: `${T.midnight}80`,
              }}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Officer & NGO Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Compact Interactive Feature Showcase (No Long Scrolling) */}
      <section id="showcase" className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: T.gold }}>Classroom Control Center</h2>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Everything your instructors need on one display
          </p>
        </div>

        {/* Feature Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { id: "classroom", label: "Classroom Presentation", icon: <Presentation className="w-4 h-4" /> },
            { id: "roleplay", label: "Roleplay & Exercises", icon: <Theater className="w-4 h-4" /> },
            { id: "stories", label: "Rehabilitation Stories", icon: <BookOpen className="w-4 h-4" /> },
            { id: "analytics", label: "Case Notes & Analytics", icon: <BarChart3 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFeatureTab(tab.id as any)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border"
              style={{
                backgroundColor: activeFeatureTab === tab.id ? T.gold : `${T.midnight}B0`,
                color: activeFeatureTab === tab.id ? T.navy : T.creamDim,
                borderColor: activeFeatureTab === tab.id ? T.gold : T.border,
                boxShadow: activeFeatureTab === tab.id ? "0 4px 20px rgba(201,162,39,0.25)" : "none",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Display Card */}
        <div 
          className="rounded-2xl border p-8 shadow-2xl relative overflow-hidden transition-all"
          style={{
            backgroundColor: T.midnight,
            borderColor: T.border,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          {activeFeatureTab === "classroom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center fade-in">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${T.gold}20`, color: T.gold }}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Module 1 · Emotional Regulation & Growth</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Structured Group Session Presentation</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: T.slateL }}>
                  Instructors project lesson slides, guided discussion prompts, and video vignettes onto the classroom wall. Participants engage in structured group dialogue without needing personal hardware.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Step-by-step facilitation prompts for counselors</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Built-in group timer and discussion queues</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border p-6" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
                <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: T.border }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Live Session Display</span>
                  </div>
                  <span className="text-xs text-gray-400">Classroom 4B</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg border text-xs" style={{ backgroundColor: T.midnight, borderColor: T.border }}>
                    <p className="font-semibold text-amber-300 mb-1">Discussion Prompt #2:</p>
                    <p className="text-white">"How do we pause and reframe emotional triggers when faced with conflict?"</p>
                  </div>
                  <div className="p-3.5 rounded-lg border text-xs flex items-center justify-between" style={{ backgroundColor: T.midnight, borderColor: T.border }}>
                    <div className="flex items-center gap-2 text-white">
                      <Video className="w-4 h-4 text-amber-400" />
                      <span>Video Guide: Breaking the Cycle of Anger</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">4:30 MIN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === "roleplay" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center fade-in">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${T.gold}20`, color: T.gold }}>
                  <Theater className="w-3.5 h-3.5" />
                  <span>Behavioral Simulation</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Interactive Roleplay Scenarios</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: T.slateL }}>
                  Counselors select conflict resolution and communication scenarios. Two or three participants act out the scenario while the class observes and reflects using guided rubrics.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-world reintegration and workplace scenarios</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Constructive peer feedback templates</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border p-6" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Current Roleplay Exercise</div>
                <h4 className="text-base font-bold text-white mb-2">Scenario: De-escalating Workplace Misunderstandings</h4>
                <p className="text-xs text-gray-300 mb-4">Roles: Employee A (Misunderstood task), Supervisor B (Demanding update)</p>
                <div className="p-3 rounded-lg border text-xs text-amber-200" style={{ backgroundColor: T.midnight, borderColor: T.border }}>
                  Focus Area: Active listening, non-defensive posture, and clear clarification questions.
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === "stories" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center fade-in">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${T.gold}20`, color: T.gold }}>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Inspirational Narratives</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Rehabilitation Story Library</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: T.slateL }}>
                  Access curated audio and video stories of successful reintegration, community rebuilding, and personal transformation to inspire hope and accountability during sessions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>First-person testimonies & expert commentary</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Downloadable discussion guides for counselors</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border p-6 space-y-3" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
                <div className="p-3 rounded-lg border flex items-center justify-between" style={{ backgroundColor: T.midnight, borderColor: T.border }}>
                  <div>
                    <p className="text-xs font-bold text-white">"From Cell to Community Leadership"</p>
                    <p className="text-[10px] text-gray-400">Story of Marcus Vance · 12 Min Audio</p>
                  </div>
                  <Play className="w-4 h-4 text-amber-400 fill-amber-400 cursor-pointer" />
                </div>
                <div className="p-3 rounded-lg border flex items-center justify-between" style={{ backgroundColor: T.midnight, borderColor: T.border }}>
                  <div>
                    <p className="text-xs font-bold text-white">"Mastering Emotional Discipline"</p>
                    <p className="text-[10px] text-gray-400">Psychology Panel · 8 Min Video</p>
                  </div>
                  <Play className="w-4 h-4 text-amber-400 fill-amber-400 cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center fade-in">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${T.gold}20`, color: T.gold }}>
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Confidential Tracking</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Counselor Case Notes & Progress</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: T.slateL }}>
                  Counselors record attendance, active participation metrics, and qualitative progress notes confidentially. Generate institutional reports for prison administration and NGOs.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Secure offline-first data logging</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Automated session summary reports for officers</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border p-6" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-white">Participant Attendance & Engagement</span>
                  <span className="text-emerald-400 font-semibold">94% Active Completion</span>
                </div>
                <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 w-[94%]" />
                </div>
                <div className="text-xs text-gray-300">
                  <p className="font-semibold mb-1">Recent Case Note:</p>
                  <p className="italic text-gray-400">"Strong participation in conflict resolution roleplay. Demonstrated key active listening steps."</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: T.border, backgroundColor: T.navy }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: T.slateL }}>
          <div className="flex items-center gap-3">
            <img src="/kintsu-logo.png" alt="Kintsu Logo" className="h-6 w-auto" />
            <span>&copy; 2026 KINTSU Rehabilitation Platform. Built for Correctional Facilities & NGOs.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Counselor Manual</a>
            <a href="#" className="hover:underline">Security Compliance</a>
            <a href="#" className="hover:underline">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
