"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Layers, ShieldCheck, ArrowRight, Play, BookOpen, 
  Theater, Users, BarChart3, CheckCircle2, ChevronRight, Award, 
  Presentation, Clock, FileText, Heart, Video, MessageCircle, Star, HelpCircle,
  Zap, Radio, Activity, Lock, Check
} from "lucide-react";
import { AuthModal } from "@/app/components/auth/AuthModal";

const T = {
  navy:      "#070F1E",
  midnight:  "#122540",
  midnightL: "#1B3459",
  gold:      "#D4AF37",
  goldLight: "#F3E5AB",
  goldDim:   "rgba(212,175,55,0.22)",
  cream:     "#FAF7F2",
  creamDim:  "rgba(250,247,242,0.70)",
  slateL:    "#94A3B8",
  border:    "rgba(212,175,55,0.20)",
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
    <div className="min-h-screen text-white font-sans selection:bg-amber-500/30 selection:text-amber-300 relative overflow-x-hidden" style={{ backgroundColor: T.navy }}>
      {/* Custom Keyframe Animations */}
      <style jsx global>{`
        @keyframes heroGlow {
          0%, 100% { opacity: 0.25; transform: scale(1) translate(-50%, -50%); }
          50% { opacity: 0.40; transform: scale(1.12) translate(-48%, -52%); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes goldPulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(212,175,55,0.3), inset 0 0 10px rgba(212,175,55,0.1); }
          50% { box-shadow: 0 0 35px rgba(212,175,55,0.6), inset 0 0 20px rgba(212,175,55,0.25); }
        }
        @keyframes metallicShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .hero-glow-1 { animation: heroGlow 8s ease-in-out infinite; }
        .float-widget { animation: floatCard 4.5s ease-in-out infinite; }
        .gold-border-glow { animation: goldPulseGlow 3s ease-in-out infinite; }
        .text-metallic {
          background: linear-gradient(135deg, #FFF 0%, #F3E5AB 30%, #D4AF37 70%, #FFF 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          animation: metallicShimmer 5s linear infinite;
        }
        .glass-card {
          background: rgba(18, 37, 64, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-2xl transition-all duration-300" style={{ backgroundColor: `${T.navy}EE`, borderColor: T.border }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="p-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 transition-transform group-hover:scale-105">
              <img src="/kintsu-logo.png" alt="Kintsu Logo" className="h-8 w-auto" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white leading-none">KINTSU</span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-400 mt-0.5">Rehabilitation Platform</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-9 text-sm font-semibold tracking-wide" style={{ color: T.creamDim }}>
            <a href="#overview" className="hover:text-amber-400 transition-colors">Classroom Model</a>
            <a href="#showcase" className="hover:text-amber-400 transition-colors">Instructor Tools</a>
            <a href="#impact" className="hover:text-amber-400 transition-colors">Impact & Security</a>
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
              className="px-6 py-2.5 text-sm font-extrabold rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2.5 group"
              style={{
                backgroundColor: T.gold,
                color: T.navy,
                boxShadow: "0 6px 25px rgba(212,175,55,0.4)",
              }}
            >
              <span>Launch Classroom Session</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative overflow-hidden pt-20 pb-20 border-b" style={{ borderColor: T.border }}>
        {/* Ambient Radial Background Glows */}
        <div 
          className="absolute top-1/3 left-1/2 w-[850px] h-[550px] rounded-full blur-[150px] pointer-events-none hero-glow-1"
          style={{ backgroundColor: "rgba(212,175,55,0.14)" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Bold Badge */}
            <div 
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-extrabold mb-8 border gold-border-glow transition-transform hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: "rgba(212,175,55,0.12)",
                borderColor: T.gold,
                color: T.goldLight,
              }}
            >
              <Presentation className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="tracking-wide">INSTRUCTOR-LED PRESENTATION SYSTEM FOR PRISONS & NGOs</span>
            </div>

            {/* Bold Hero Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15]">
              Empower Counselors & Officers to Lead <span className="text-metallic">Impactful Rehabilitation</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-7 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed text-slate-300">
              Built for group rehabilitation inside correctional facilities—eliminating the need for individual prisoner devices. A single instructor guides the entire classroom with structured modules, real stories, roleplays, and progress tracking.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full sm:w-auto px-9 py-4.5 text-base font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group"
                style={{
                  backgroundColor: T.gold,
                  color: T.navy,
                  boxShadow: "0 10px 35px rgba(212,175,55,0.45)",
                }}
              >
                <span>ENTER SESSION SUITE</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
              <button
                onClick={() => openAuth("login")}
                className="w-full sm:w-auto px-8 py-4.5 text-base font-bold rounded-2xl border flex items-center justify-center gap-2.5 transition-all hover:bg-white/10 hover:border-amber-400/60"
                style={{
                  borderColor: T.border,
                  color: T.cream,
                  backgroundColor: `${T.midnight}90`,
                }}
              >
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>OFFICER & NGO PORTAL</span>
              </button>
            </div>

            {/* Metric Highlights Pill Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl border glass-card text-center" style={{ borderColor: T.border }}>
                <div className="text-2xl font-black text-amber-400">100%</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Instructor-Led Classroom</div>
              </div>
              <div className="p-4 rounded-2xl border glass-card text-center" style={{ borderColor: T.border }}>
                <div className="text-2xl font-black text-emerald-400">0 Devices</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Required for Inmates</div>
              </div>
              <div className="p-4 rounded-2xl border glass-card text-center" style={{ borderColor: T.border }}>
                <div className="text-2xl font-black text-amber-400">48+ Modules</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Roleplay & Stories</div>
              </div>
              <div className="p-4 rounded-2xl border glass-card text-center" style={{ borderColor: T.border }}>
                <div className="text-2xl font-black text-sky-400">24/7 Security</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Offline-Ready Logging</div>
              </div>
            </div>
          </div>

          {/* Floating Live Classroom Preview Widget */}
          <div className="mt-14 max-w-5xl mx-auto float-widget">
            <div 
              className="rounded-3xl border p-7 shadow-2xl glass-card relative overflow-hidden"
              style={{
                borderColor: T.gold,
                boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 25px rgba(212,175,55,0.2)",
              }}
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between pb-5 border-b mb-6 gap-3" style={{ borderColor: T.border }}>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-300">Live Session Display Mode</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Facility Block 4B</span>
                  <span>14 Participants Active</span>
                </div>
              </div>

              {/* Grid Content Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: T.navy, borderColor: T.border }}>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-amber-400">ACTIVE MODULE</span>
                    <span className="text-slate-400 font-mono">12:30 MIN</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">Emotional Regulation & Growth</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">Instructor prompt: "Identify non-violent conflict triggers."</p>
                </div>

                <div className="p-5 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: T.navy, borderColor: T.border }}>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-emerald-400">SIMULATION MODE</span>
                    <span className="text-slate-400 font-mono">Roleplay #3</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">De-escalation Exercise</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">2 participants practicing non-defensive listening posture.</p>
                </div>

                <div className="p-5 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: T.navy, borderColor: T.border }}>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-amber-400">OFFICER LOG</span>
                    <span className="text-slate-400 font-mono">Saved</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">Group Progress Tracker</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">Attendance: 100% · Active participation: High</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Interactive Feature Showcase */}
      <section id="showcase" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest font-black text-amber-400 mb-2">Classroom Control Center</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Everything your instructors need on one display
          </p>
        </div>

        {/* Feature Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
          {[
            { id: "classroom", label: "Classroom Presentation", icon: <Presentation className="w-4 h-4" /> },
            { id: "roleplay", label: "Roleplay & Exercises", icon: <Theater className="w-4 h-4" /> },
            { id: "stories", label: "Rehabilitation Stories", icon: <BookOpen className="w-4 h-4" /> },
            { id: "analytics", label: "Case Notes & Analytics", icon: <BarChart3 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFeatureTab(tab.id as any)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 border active:scale-95 cursor-pointer"
              style={{
                backgroundColor: activeFeatureTab === tab.id ? T.gold : `${T.midnight}C0`,
                color: activeFeatureTab === tab.id ? T.navy : T.creamDim,
                borderColor: activeFeatureTab === tab.id ? T.gold : T.border,
                boxShadow: activeFeatureTab === tab.id ? "0 8px 25px rgba(212,175,55,0.4)" : "none",
                transform: activeFeatureTab === tab.id ? "translateY(-3px)" : "none",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Showcase Card */}
        <div 
          className="rounded-3xl border p-9 shadow-2xl glass-card transition-all duration-500"
          style={{
            borderColor: T.border,
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          }}
        >
          {activeFeatureTab === "classroom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Module 1 · Emotional Regulation & Growth</span>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-4">Structured Group Session Presentation</h3>
                <p className="text-base leading-relaxed text-slate-300 mb-6">
                  Instructors project lesson slides, guided discussion prompts, and video vignettes onto the classroom wall. Participants engage in structured group dialogue without needing personal hardware.
                </p>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Step-by-step facilitation prompts for counselors</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Built-in group timer and discussion queues</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-7 bg-slate-950/80 border-amber-500/30">
                <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">Live Session Display</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Classroom 4B</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/90">
                    <p className="font-bold text-amber-300 text-xs mb-1.5">Discussion Prompt #2:</p>
                    <p className="text-sm text-white font-medium">"How do we pause and reframe emotional triggers when faced with conflict?"</p>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/90 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-white">
                      <Video className="w-5 h-5 text-amber-400" />
                      <span className="font-semibold">Video Guide: Breaking the Cycle of Anger</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-bold">4:30 MIN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === "roleplay" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Theater className="w-3.5 h-3.5" />
                  <span>Behavioral Simulation</span>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-4">Interactive Roleplay Scenarios</h3>
                <p className="text-base leading-relaxed text-slate-300 mb-6">
                  Counselors select conflict resolution and communication scenarios. Two or three participants act out the scenario while the class observes and reflects using guided rubrics.
                </p>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Real-world reintegration and workplace scenarios</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Constructive peer feedback templates</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-7 bg-slate-950/80 border-amber-500/30">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">Current Roleplay Exercise</div>
                <h4 className="text-lg font-extrabold text-white mb-2">Scenario: De-escalating Workplace Misunderstandings</h4>
                <p className="text-xs text-slate-300 mb-5">Roles: Employee A (Misunderstood task), Supervisor B (Demanding update)</p>
                <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/90 text-xs text-amber-200 leading-relaxed font-medium">
                  Focus Area: Active listening, non-defensive posture, and clear clarification questions.
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === "stories" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Inspirational Narratives</span>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-4">Rehabilitation Story Library</h3>
                <p className="text-base leading-relaxed text-slate-300 mb-6">
                  Access curated audio and video stories of successful reintegration, community rebuilding, and personal transformation to inspire hope and accountability during sessions.
                </p>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>First-person testimonies & expert commentary</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Downloadable discussion guides for counselors</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-7 bg-slate-950/80 border-amber-500/30 space-y-4">
                <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/90 flex items-center justify-between hover:scale-[1.02] transition-transform">
                  <div>
                    <p className="text-sm font-bold text-white">"From Cell to Community Leadership"</p>
                    <p className="text-xs text-slate-400 mt-0.5">Story of Marcus Vance · 12 Min Audio</p>
                  </div>
                  <Play className="w-5 h-5 text-amber-400 fill-amber-400 cursor-pointer hover:scale-125 transition-transform" />
                </div>
                <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/90 flex items-center justify-between hover:scale-[1.02] transition-transform">
                  <div>
                    <p className="text-sm font-bold text-white">"Mastering Emotional Discipline"</p>
                    <p className="text-xs text-slate-400 mt-0.5">Psychology Panel · 8 Min Video</p>
                  </div>
                  <Play className="w-5 h-5 text-amber-400 fill-amber-400 cursor-pointer hover:scale-125 transition-transform" />
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Confidential Tracking</span>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-4">Counselor Case Notes & Progress</h3>
                <p className="text-base leading-relaxed text-slate-300 mb-6">
                  Counselors record attendance, active participation metrics, and qualitative progress notes confidentially. Generate institutional reports for prison administration and NGOs.
                </p>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Secure offline-first data logging</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Automated session summary reports for officers</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-7 bg-slate-950/80 border-amber-500/30">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-white">Participant Attendance & Engagement</span>
                  <span className="text-emerald-400 font-bold">94% Active Completion</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 w-[94%]" />
                </div>
                <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/90 text-xs text-slate-300">
                  <p className="font-bold text-white mb-1">Recent Case Note Logged:</p>
                  <p className="italic text-slate-300 leading-relaxed">"Strong participation in conflict resolution roleplay. Demonstrated key active listening steps."</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t" style={{ borderColor: T.border, backgroundColor: T.navy }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5 text-xs font-medium" style={{ color: T.slateL }}>
          <div className="flex items-center gap-3">
            <img src="/kintsu-logo.png" alt="Kintsu Logo" className="h-6 w-auto" />
            <span>&copy; 2026 KINTSU Rehabilitation Platform. Built for Correctional Facilities & NGOs.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-amber-400 transition-colors">Counselor Manual</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Security Compliance</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Contact Support</a>
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
