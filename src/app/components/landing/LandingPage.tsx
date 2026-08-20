"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Layers, ShieldCheck, Cpu, ArrowRight, CheckCircle2, 
  ChevronRight, BarChart3, Palette, BookOpen, Star, Play
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

const HERO_IMG = "https://images.unsplash.com/photo-1773751274081-8872dfe466c7?w=1600&h=700&fit=crop&auto=format&q=80";

export function LandingPage() {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">("login");

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
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ backgroundColor: `${T.navy}CC`, borderColor: T.border }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/kintsu-logo.png" alt="Kintsu Logo" className="h-9 w-auto" />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wide text-white leading-none">KINTSU</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: T.gold }}>Design System</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: T.creamDim }}>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#tokens" className="hover:text-white transition-colors">Design Tokens</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#governance" className="hover:text-white transition-colors">Governance</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => openAuth("login")}
              className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors hover:text-white"
              style={{ color: T.creamDim }}
            >
              Log In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: T.gold,
                color: T.navy,
                boxShadow: "0 4px 18px rgba(201,162,39,0.3)",
              }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 border-b" style={{ borderColor: T.border }}>
        {/* Background Radial Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ backgroundColor: "rgba(201,162,39,0.08)" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Release Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
            style={{
              backgroundColor: "rgba(201,162,39,0.1)",
              borderColor: T.goldDim,
              color: T.gold,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kintsu Intelligence Suite 2.0 Released</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Harmonize Code & Design with <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent">Kintsu Design System</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed" style={{ color: T.creamDim }}>
            An enterprise-grade component architecture, design token engine, and real-time governance platform built for high-performing engineering teams.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all hover:opacity-95 active:scale-95"
              style={{
                backgroundColor: T.gold,
                color: T.navy,
                boxShadow: "0 8px 30px rgba(201,162,39,0.35)",
              }}
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => openAuth("login")}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-2xl border flex items-center justify-center gap-3 transition-colors hover:bg-white/5"
              style={{
                borderColor: T.border,
                color: T.cream,
                backgroundColor: `${T.midnight}80`,
              }}
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t" style={{ borderColor: T.border }}>
            <div>
              <div className="text-3xl font-extrabold text-white">48+</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: T.slateL }}>Radix & Shadcn Components</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: T.slateL }}>Next.js App Router Native</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">0ms</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: T.slateL }}>Zero Latency Token Sync</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">CI/CD</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: T.slateL }}>Auto Vercel Pipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: T.gold }}>Architectural Excellence</h2>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Everything you need for enterprise design governance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div 
            className="p-8 rounded-2xl border transition-all hover:-translate-y-1.5 shadow-xl"
            style={{
              backgroundColor: T.midnight,
              borderColor: T.border,
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
              <Palette className="w-6 h-6" style={{ color: T.gold }} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Design Token Engine</h3>
            <p className="text-sm leading-relaxed" style={{ color: T.slateL }}>
              Unified color palettes, dark/light theme variables, custom typography, and dynamic spacing tokens synced directly from Figma.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            className="p-8 rounded-2xl border transition-all hover:-translate-y-1.5 shadow-xl"
            style={{
              backgroundColor: T.midnight,
              borderColor: T.border,
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
              <Layers className="w-6 h-6" style={{ color: T.gold }} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">48+ Accessible Components</h3>
            <p className="text-sm leading-relaxed" style={{ color: T.slateL }}>
              Full suite of Radix UI primitives, accordions, modals, navigation bars, dropdowns, and data tables built with TypeScript.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            className="p-8 rounded-2xl border transition-all hover:-translate-y-1.5 shadow-xl"
            style={{
              backgroundColor: T.midnight,
              borderColor: T.border,
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border" style={{ backgroundColor: T.navy, borderColor: T.goldDim }}>
              <BarChart3 className="w-6 h-6" style={{ color: T.gold }} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Real-Time Analytics</h3>
            <p className="text-sm leading-relaxed" style={{ color: T.slateL }}>
              Live telemetry monitoring component usage, adoption rates, and design system performance across all production applications.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 border-t border-b" style={{ backgroundColor: T.midnight, borderColor: T.border }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to experience Kintsu Design System?
          </h2>
          <p className="text-base md:text-lg mb-8" style={{ color: T.creamDim }}>
            Explore the live dashboard environment with all 48+ components, design tokens, and real-time setup.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 text-base font-bold rounded-2xl inline-flex items-center gap-3 shadow-2xl transition-transform active:scale-95"
            style={{
              backgroundColor: T.gold,
              color: T.navy,
              boxShadow: "0 8px 30px rgba(201,162,39,0.4)",
            }}
          >
            <span>Open Dashboard Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: T.border, backgroundColor: T.navy }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs" style={{ color: T.slateL }}>
          <div className="flex items-center gap-3">
            <img src="/kintsu-logo.png" alt="Kintsu Logo" className="h-6 w-auto" />
            <span>&copy; 2026 Kintsu Design System. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Documentation</a>
            <a href="#" className="hover:underline">Figma File</a>
            <a href="#" className="hover:underline">GitHub Repository</a>
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
