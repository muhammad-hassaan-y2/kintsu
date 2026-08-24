"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays, Users, BarChart2, BookOpen, Theater, Settings, HelpCircle,
  MessageCircle, Clock, Cloud, Star, FileText, File, Presentation,
  ChevronRight, TrendingUp, Award, CheckCircle, AlertTriangle, Filter,
  Mail, Shield, Zap, Play, Bell, Plus, Search, MoreHorizontal,
  Heart, Brain, Handshake, Target, Layers, PieChart, Activity,
  FolderOpen, BookMarked, Clapperboard, X, UserPlus, Download,
  Edit, Trash2, Eye, RefreshCw, ArrowRight, CheckSquare, Square,
  GripVertical, Video, Mic, Smile, ThumbsUp, LogOut
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  fetchTodaySessions,
  fetchSessions,
  generateAISession,
  publishSession,
  fetchParticipants,
  fetchStories,
  fetchBooks,
  fetchAnalytics,
  fetchRoleplayScenarios,
  startRoleplay,
  submitRoleplayTurn,
  completeRoleplay,
  fetchPrisonerFiles,
  fetchCurrentUser,
  clearAuthToken
} from "@/lib/api";
import { PrisonerIntakeWizard } from "@/app/components/onboarding/PrisonerIntakeWizard";
import { UserProfileModal } from "@/app/components/auth/UserProfileModal";
const kintsuLogo = "/kintsu-logo.png";





const T = {
  navy:      "#0A1628",
  midnight:  "#1E3A5F",
  midnightL: "#243F6A",
  gold:      "#C9A227",
  goldDim:   "rgba(201,162,39,0.18)",
  burgundy:  "#722F37",
  cream:     "#F5F0E8",
  creamDim:  "rgba(245,240,232,0.65)",
  softWhite: "#FAF9F6",
  slate:     "#475569",
  slateL:    "#94A3B8",
  green:     "#2D5A3D",
  amber:     "#B45309",
  border:    "rgba(201,162,39,0.13)",
  cardShadow:"0 4px 24px rgba(0,0,0,0.35)",
  ease:      "cubic-bezier(0.4,0,0.2,1)",
};

const HERO_IMG = "https://images.unsplash.com/photo-1773751274081-8872dfe466c7?w=1600&h=700&fit=crop&auto=format&q=80";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
* { font-family: 'Inter', sans-serif; box-sizing: border-box; }

@keyframes fadeUp    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes floatUD   { 0%,100% { transform:translateY(0);    } 50% { transform:translateY(-7px); } }
@keyframes spin30    { from { transform:rotate(0deg); }        to   { transform:rotate(360deg); } }
@keyframes countUp   { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes barGrow   { from { width:0; } }
@keyframes goldPulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,162,39,0.45);} 50%{box-shadow:0 0 0 14px rgba(201,162,39,0);} }
@keyframes shimmer   { from{background-position:200% center;} to{background-position:-200% center;} }
@keyframes slideInL  { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
@keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn   { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
@keyframes drawLine  { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }

.fade-up    { animation: fadeUp  500ms ${T.ease} both; }
.float-pill { animation: floatUD 2.8s  ease-in-out infinite; }
.spin-slow  { animation: spin30  30s   linear    infinite; }
.count-up   { animation: countUp 600ms ${T.ease} both; }
.bar-grow   { animation: barGrow 900ms ease-out  both; }
.gold-pulse { animation: goldPulse 2s  ease-in-out infinite; }
.slide-in-l { animation: slideInL 500ms ${T.ease} both; }
.fade-in    { animation: fadeIn 400ms ${T.ease} both; }
.scale-in   { animation: scaleIn 400ms ${T.ease} both; }

.sidebar-link { transition: all 200ms ${T.ease}; position:relative; }
.sidebar-link::before {
  content:''; position:absolute; left:0; top:50%; transform:translateY(-50%);
  width:3px; height:0; background:${T.gold}; border-radius:0 2px 2px 0;
  transition: height 200ms ${T.ease};
}
.sidebar-link:hover::before, .sidebar-link.active::before { height:75%; }
.sidebar-link:hover { background:rgba(201,162,39,0.08); color:${T.cream} !important; }
.sidebar-link.active { background:rgba(201,162,39,0.12); color:${T.cream} !important; }

.widget { transition: transform 200ms ${T.ease}, box-shadow 200ms ${T.ease}; }
.widget:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.5); }

.timeline-scroll { overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; }
.timeline-scroll::-webkit-scrollbar { display:none; }

.gold-shimmer {
  background: linear-gradient(90deg, ${T.gold} 0%, #f0d060 40%, ${T.gold} 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

.page-hero {
  position: relative;
  overflow: hidden;
  padding: 48px 56px 36px;
  background: linear-gradient(135deg, ${T.navy} 0%, ${T.midnight} 50%, ${T.midnightL} 100%);
}
.page-hero::before {
  content:'';
  position:absolute; top:0; right:0; width:500px; height:500px;
  background: radial-gradient(circle, ${T.gold}22 0%, transparent 70%);
  transform: translate(30%, -40%);
}
.page-hero::after {
  content:'';
  position:absolute; bottom:0; left:10%; width:400px; height:400px;
  background: radial-gradient(circle, ${T.burgundy}22 0%, transparent 70%);
  transform: translateY(50%);
}

.chart-bar { transition: height 600ms ${T.ease}; }
.step-connector { transition: all 300ms ${T.ease}; }
`;

function Styles() { return <style dangerouslySetInnerHTML={{ __html: CSS }} />; }

function Avatar({ initials, size = 36, bg = T.midnight }: { initials: string; size?: number; bg?: string }) {
  return (
    <div className="rounded-full flex items-center justify-center font-semibold text-white shrink-0"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.33, border: `2px solid ${T.gold}44` }}>
      {initials}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="w-2 h-2 rounded-full shrink-0 inline-block" style={{ backgroundColor: color }} />;
}

const NAV = [
  { label: "Today's Sessions",    icon: <CalendarDays size={17} />, zone: 1 },
  { label: "Session Builder",     icon: <Zap          size={17} />, zone: 2 },
  { label: "My Prisoners",        icon: <Users        size={17} />, zone: 3 },
  { label: "Reports & Analytics", icon: <BarChart2    size={17} />, zone: 4 },
  { label: "Story Library",       icon: <BookOpen     size={17} />, zone: 5 },
  { label: "Roleplay History",    icon: <Theater      size={17} />, zone: 6 },
];

interface SidebarProps {
  active: number;
  setActive: (n: number) => void;
  currentUser: any;
  onOpenProfile: () => void;
  onLogout: () => void;
  timeLeft: number;
}

function Sidebar({ active, setActive, currentUser, onOpenProfile, onLogout, timeLeft }: SidebarProps) {
  const router = useRouter();
  const userName = currentUser?.fullName || "Priya Rajan";
  const userRole = currentUser?.role || "Counselor";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isWarning = timeLeft < 60;

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0"
      style={{ width: 280, backgroundColor: T.navy, borderRight: `1px solid ${T.border}` }}
    >
      <div className="flex flex-col items-center px-6 pt-6 pb-6 cursor-pointer" onClick={() => router.push("/")}>
        <ImageWithFallback
          src={kintsuLogo}
          alt="Kintsu — Rebuild · Restore · Reintegrate"
          className="w-full object-contain"
          style={{ maxWidth: 180, maxHeight: 120 }}
        />
      </div>

      {/* 5-Minute Auto-Logout Countdown Badge */}
      <div 
        className="mx-3 mb-4 px-3 py-2 rounded-xl flex items-center justify-between border"
        style={{
          backgroundColor: isWarning ? "rgba(239,68,68,0.15)" : "rgba(201,162,39,0.12)",
          borderColor: isWarning ? "rgba(239,68,68,0.4)" : "rgba(201,162,39,0.3)",
        }}
      >
        <div className="flex items-center gap-2">
          <Clock className={`w-3.5 h-3.5 ${isWarning ? "text-red-400 animate-bounce" : "text-amber-400"}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Session Timeout:
          </span>
        </div>
        <span 
          className={`text-xs font-mono font-extrabold ${isWarning ? "text-red-400 animate-pulse" : "text-amber-300"}`}
        >
          {timeFormatted}
        </span>
      </div>

      <p className="px-6 text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: T.slate }}>Workspace</p>


      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {NAV.map(({ label, icon, zone }) => (
          <button
            key={zone}
            onClick={() => setActive(zone)}
            className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium text-left w-full cursor-pointer ${active === zone ? "active" : ""}`}
            style={{ color: active === zone ? T.cream : T.slateL }}
          >
            <span style={{ color: active === zone ? T.gold : T.slate }}>{icon}</span>
            {label}
            {zone === 1 && (
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: T.burgundy, color: T.cream }}>2</span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 pb-4 flex flex-col gap-0.5" style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, marginTop: 16 }}>
        {[
          { icon: <Settings size={15} />,       label: "Settings"  },
          { icon: <HelpCircle size={15} />,     label: "Help"      },
          { icon: <MessageCircle size={15} />,  label: "Support"   },
        ].map(({ icon, label }) => (
          <button key={label}
            className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium cursor-pointer hover:bg-white/5 transition-colors"
            style={{ color: T.slate }}>
            {icon}{label}
          </button>
        ))}
      </div>

      <div className="mx-3 mb-2 px-3 py-2 rounded-xl flex items-center justify-between" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E" }} />
          <span className="text-[11px] font-semibold" style={{ color: T.cream }}>Neon DB & FastAPI</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>:8000</span>
      </div>

      {/* User Profile Card */}
      <div 
        onClick={onOpenProfile}
        className="mx-3 mb-5 px-3 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all hover:bg-white/10 active:scale-95 group" 
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}` }}
      >
        <Avatar initials={initials} size={36} bg={T.midnight} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate group-hover:text-amber-400 transition-colors" style={{ color: T.cream }}>{userName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            <p className="text-[11px] capitalize" style={{ color: T.slate }}>Online · {userRole}</p>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLogout();
          }}
          title="Log Out & Exit"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}



function Footer() {
  return (
    <footer
      className="flex items-center justify-between px-8 py-4"
      style={{
        backgroundColor: T.navy,
        borderTop: `1px solid ${T.gold}33`,
      }}
    >
      <div className="flex items-center gap-2" style={{ color: T.cream }}>
        <Mail size={13} style={{ color: T.gold }} />
        <span className="text-xs font-medium">Contact us</span>
        <span className="text-xs" style={{ color: T.slate }}>contact@kintsu.org</span>
      </div>
      <p className="text-xs" style={{ color: T.slate }}>© 2026 KINTSU. All rights reserved.</p>
      <div className="flex items-center gap-3 text-xs" style={{ color: T.slate }}>
        <button className="hover:text-cream cursor-pointer transition-colors">Privacy Policy</button>
        <span>|</span>
        <button className="hover:text-cream cursor-pointer transition-colors">Terms of Use</button>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 1: TODAY'S SESSIONS (Dashboard original)
// ═══════════════════════════════════════════════════════════════════════════

const PILLS = [
  { text: "New collaboration with Dr. Sharma",    dot: T.gold,     delay: 0    },
  { text: "Session #7 — Block C has just launched", dot: "#60A5FA", delay: 0.4 },
  { text: "Welcome our new intern, Ananya!",      dot: "#4ADE80",  delay: 0.8  },
];

function Hero() {
  return (
    <div className="relative overflow-hidden" style={{ height: 420 }}>
      <img
        src={HERO_IMG}
        alt="Warm light streams through an arched colonnade — hope and transformation"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "saturate(1.1) brightness(0.72)" }}
      />
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to right, ${T.navy}99 0%, transparent 40%, transparent 60%, ${T.navy}55 100%)`
      }} />
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to bottom, transparent 30%, ${T.midnight}CC 80%, ${T.midnight} 100%)`
      }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="spin-slow absolute rounded-full" style={{ width: 288, height: 288, border: `2px dashed ${T.gold}88` }} />
          <div className="absolute rounded-full" style={{ width: 260, height: 260, border: `1px solid ${T.gold}33` }} />
          <div className="absolute rounded-full gold-pulse" style={{ width: 220, height: 220, backgroundColor: `${T.gold}08` }} />
          <div className="relative z-10 flex flex-col items-center gap-2 text-center px-8" style={{ width: 248 }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: T.gold }}>Session Ready</p>
            <p className="font-bold leading-tight" style={{ fontSize: 22, color: T.cream, letterSpacing: "-0.02em" }}>Anger Management</p>
            <p className="text-xs leading-relaxed" style={{ color: T.creamDim }}>Block C · 12 prisoners</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock size={12} style={{ color: T.gold }} />
              <span className="text-sm font-semibold" style={{ color: T.cream }}>11:00 AM</span>
              <span style={{ color: T.slate }}>·</span>
              <Cloud size={12} style={{ color: T.slateL }} />
              <span className="text-xs" style={{ color: T.creamDim }}>Calm</span>
            </div>
            <button className="mt-3 flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105"
              style={{ backgroundColor: T.gold, color: T.navy, boxShadow: `0 4px 16px ${T.gold}55` }}>
              <Play size={11} fill={T.navy} />Start Now
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 flex-wrap justify-center px-4">
        {PILLS.map(({ text, dot, delay }) => (
          <div key={text} className="float-pill flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md"
            style={{ backgroundColor: "rgba(10,22,40,0.72)", border: `1px solid ${dot}44`, color: T.cream, animationDelay: `${delay}s`, boxShadow: `0 4px 16px rgba(0,0,0,0.3)` }}>
            <Dot color={dot} />{text}
          </div>
        ))}
      </div>
      <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
        style={{ backgroundColor: "rgba(10,22,40,0.6)", color: T.cream, border: `1px solid ${T.border}` }}>
        Friday, July 25 · 2026
      </div>
    </div>
  );
}

function Widget({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`widget fade-up rounded-2xl p-5 flex flex-col gap-4 ${className}`}
      style={{ backgroundColor: T.midnight, boxShadow: T.cardShadow, border: `1px solid ${T.border}`, animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function WidgetHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold" style={{ color: T.cream }}>{title}</p>
      <span style={{ color: T.gold }}>{icon}</span>
    </div>
  );
}

function StatsWidget() {
  const stats = [
    { icon: <BarChart2 size={16} />, label: "Sessions",        value: "234",  unit: "completed", color: T.gold     },
    { icon: <Clock     size={16} />, label: "Focused",         value: "8.5",  unit: "hours",     color: "#60A5FA"  },
    { icon: <Star      size={16} />, label: "Badges Unlocked", value: "320",  unit: "total",     color: T.burgundy },
  ];
  return (
    <Widget delay={100}>
      <WidgetHeader title="Live Stats" icon={<TrendingUp size={16} />} />
      <div className="flex flex-col gap-3">
        {stats.map(({ icon, label, value, unit, color }, i) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl count-up"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", animationDelay: `${200 + i * 80}ms` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}22`, color }}>{icon}</div>
            <div className="flex-1"><p className="text-xs" style={{ color: T.slate }}>{label}</p></div>
            <div className="text-right">
              <span className="text-xl font-bold" style={{ color: T.cream }}>{value}</span>
              <span className="text-xs ml-1" style={{ color: T.slate }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function AchievementsWidget() {
  const items = [
    { icon: <TrendingUp size={14} />, text: "Reduced reoffending by 25% with new AI tools",         color: T.green    },
    { icon: <Award      size={14} />, text: "100% client satisfaction — 3 consecutive months",       color: T.gold     },
    { icon: <CheckCircle size={14}/>, text: "Successfully onboarded 5 new counselors this quarter",  color: "#60A5FA"  },
  ];
  return (
    <Widget delay={200}>
      <WidgetHeader title="Team Achievements" icon={<Award size={16} />} />
      <div className="flex flex-col gap-2">
        {items.map(({ icon, text, color }, i) => (
          <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl fade-up"
            style={{ backgroundColor: `${color}0D`, animationDelay: `${300 + i * 60}ms` }}>
            <div className="mt-0.5 shrink-0" style={{ color }}>{icon}</div>
            <p className="text-xs leading-relaxed" style={{ color: T.creamDim }}>{text}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function ScheduleWidget() {
  const meetings = [
    { dot: T.burgundy, date: "Jul 30",  time: "10:00 AM", title: "Monthly Staff Meeting",  via: "Zoom"     },
    { dot: T.amber,    date: "Aug 2",   time: "2:00 PM",  title: "Training Session",       via: "Block A"  },
    { dot: T.green,    date: "Aug 5",   time: "11:00 AM", title: "Feedback Roundtable",    via: "Online"   },
  ];
  return (
    <Widget delay={300}>
      <WidgetHeader title="Today's Schedule" icon={<CalendarDays size={16} />} />
      <div className="flex flex-col gap-1">
        {meetings.map(({ dot, date, time, title, via }, i) => (
          <div key={i} className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer fade-up"
            style={{ animationDelay: `${400 + i * 60}ms` }}>
            <div className="flex flex-col items-center gap-1 mt-0.5 shrink-0">
              <Dot color={dot} />
              {i < meetings.length - 1 && <div className="w-px flex-1" style={{ height: 20, backgroundColor: `${dot}33` }} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: T.cream }}>{title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: T.slate }}>{date} · {time} · {via}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 rounded-xl text-xs font-semibold text-center cursor-pointer hover:opacity-80 transition-opacity"
        style={{ color: T.gold, border: `1px solid ${T.gold}33` }}>
        View full calendar <ChevronRight size={12} className="inline-block" />
      </button>
    </Widget>
  );
}

function FilesWidget() {
  const files = [
    { icon: <File          size={14} />, name: "Report_Manual_August.pdf",    size: "2.4 MB",  color: T.burgundy  },
    { icon: <FileText      size={14} />, name: "Notes_Block_C.docx",          size: "840 KB",  color: "#60A5FA"   },
    { icon: <Presentation  size={14} />, name: "Template_PT_Session.pptx",    size: "5.1 MB",  color: T.amber     },
  ];
  return (
    <Widget delay={400}>
      <WidgetHeader title="Recent Files" icon={<FileText size={16} />} />
      <div className="flex flex-col gap-1.5">
        {files.map(({ icon, name, size, color }, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer fade-up"
            style={{ animationDelay: `${500 + i * 50}ms` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}22`, color }}>{icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: T.creamDim }}>{name}</p>
              <p className="text-[11px]" style={{ color: T.slate }}>{size}</p>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function PrisonerSnapshot() {
  const prisoners = [
    { initials: "VS", name: "Vikram Sharma",   prog: 80, color: "#60A5FA", status: "Active"   },
    { initials: "AP", name: "Arjun Patel",     prog: 28, color: T.burgundy, status: "At Risk"  },
    { initials: "DK", name: "Deepak Kumar",    prog: 70, color: T.green,   status: "Progress" },
  ];
  return (
    <div className="fade-up rounded-2xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: T.midnight, boxShadow: T.cardShadow, border: `1px solid ${T.border}`, animationDelay: "450ms" }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: T.cream }}>My Prisoners</p>
        <button className="text-xs font-medium cursor-pointer hover:opacity-70 transition-opacity" style={{ color: T.gold }}>
          See all <ChevronRight size={12} className="inline-block" />
        </button>
      </div>
      {prisoners.map(({ initials, name, prog, color, status }, i) => (
        <div key={name} className="flex items-center gap-3 fade-up" style={{ animationDelay: `${550 + i * 60}ms` }}>
          <Avatar initials={initials} size={34} bg={color} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-semibold truncate" style={{ color: T.cream }}>{name}</p>
              <p className="text-[11px] ml-2 shrink-0 font-semibold" style={{ color }}>{prog}%</p>
            </div>
            <div className="w-full h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
              <div className="bar-grow h-full rounded-full" style={{ width: `${prog}%`, backgroundColor: color, animationDelay: `${700 + i * 80}ms` }} />
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: `${color}22`, color }}>{status}</span>
        </div>
      ))}
    </div>
  );
}

function BottomSection() {
  const [dot, setDot] = useState(0);
  const cards = [
    { img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=320&h=200&fit=crop&auto=format&q=70", alt: "Group therapy session", tag: "Group Session", title: "Anger Control — Block C", meta: "Jul 22 · 12 participants", tagColor: T.gold },
    { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=320&h=200&fit=crop&auto=format&q=70", alt: "Progress charts on screen", tag: "Analytics", title: "Weekly Progress Report", meta: "Jul 20 · All blocks", tagColor: "#60A5FA" },
    { img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=320&h=200&fit=crop&auto=format&q=70", alt: "Book and stories", tag: "Story Library", title: "New: Redemption Narrative", meta: "Added Jul 18 · 5 min read", tagColor: T.green },
    { img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=320&h=200&fit=crop&auto=format&q=70", alt: "Counseling roleplay", tag: "Roleplay", title: "De-escalation Scenario #4", meta: "Jul 17 · New scenario", tagColor: T.burgundy },
    { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=320&h=200&fit=crop&auto=format&q=70", alt: "Team meeting", tag: "Team", title: "Staff Onboarding Complete", meta: "Jul 15 · 5 counselors", tagColor: T.amber },
  ];
  return (
    <div className="fade-up mx-0 rounded-2xl p-6"
      style={{ backgroundColor: T.softWhite, animationDelay: "600ms", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-base" style={{ color: "#1a1a2e" }}>Kintsu Streams</h3>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Recent activity across all sessions and programs</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors"
          style={{ color: "#475569", border: "1px solid rgba(0,0,0,0.08)" }}>
          <Filter size={12} />Filter
        </button>
      </div>
      <div className="timeline-scroll flex gap-4 pb-2">
        {cards.map(({ img, alt, tag, title, meta, tagColor }, i) => (
          <div key={i} className="shrink-0 rounded-xl overflow-hidden cursor-pointer fade-up"
            style={{ width: 230, backgroundColor: "#FFFFFF", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.06)", animationDelay: `${700 + i * 60}ms`, transition: `transform 200ms ${T.ease}, box-shadow 200ms ${T.ease}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}>
            <div className="relative" style={{ height: 130 }}>
              <img src={img} alt={alt} className="w-full h-full object-cover" />
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: tagColor, color: tagColor === T.gold ? T.navy : "#fff" }}>{tag}</span>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold leading-tight" style={{ color: "#1a1a2e" }}>{title}</p>
              <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>{meta}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {cards.map((_, i) => (
          <button key={i} onClick={() => setDot(i)} className="rounded-full cursor-pointer transition-all"
            style={{ width: dot === i ? 20 : 6, height: 6, backgroundColor: dot === i ? T.midnight : "#CBD5E1" }} />
        ))}
      </div>
    </div>
  );
}

function PageToday({ currentUser }: { currentUser?: any }) {
  const nameDisplay = currentUser?.fullName ? currentUser.fullName.split(" ")[0] : "Counselor";
  const fullTitle = currentUser?.fullName || "Counselor";
  const userRole = currentUser?.role ? (currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)) : "Counselor";

  return (
    <>
      <Hero />
      <div className="flex gap-5 p-6">
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="fade-up" style={{ animationDelay: "50ms" }}>
            <h1 className="font-bold leading-none" style={{ fontSize: 32, letterSpacing: "-0.025em" }}>
              <span style={{ color: T.cream }}>Welcome back, </span>
              <span className="gold-shimmer">{nameDisplay}</span>
            </h1>
            <p className="text-sm mt-1.5" style={{ color: T.slate }}>
              Logged in as <span className="font-semibold text-white">{fullTitle}</span> ({userRole}) · Connected to <span className="font-semibold" style={{ color: T.gold }}>Neon PostgreSQL</span>.
            </p>
          </div>

          <div className="fade-up rounded-2xl px-5 py-4 flex items-start gap-4"
            style={{ backgroundColor: `${T.burgundy}18`, border: `1px solid ${T.burgundy}44`, animationDelay: "100ms" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${T.amber}22` }}>
              <AlertTriangle size={18} style={{ color: T.amber }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: T.cream }}>Intervention Required — Arjun Patel</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: T.slate }}>
                Low empathy score (28%) in last session. Welfare check recommended before Thursday group.
              </p>
            </div>
            <button className="shrink-0 px-4 py-2 rounded-[8px] text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: T.burgundy, color: T.cream }}>Schedule</button>
          </div>
          <PrisonerSnapshot />
          <BottomSection />
        </div>
        <div className="flex flex-col gap-5 shrink-0" style={{ width: 300 }}>
          <StatsWidget />
          <AchievementsWidget />
          <ScheduleWidget />
          <FilesWidget />
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 2: SESSION BUILDER
// ═══════════════════════════════════════════════════════════════════════════

function PageSessionBuilder() {
  const [step, setStep] = useState(2);
  const steps = ["Program Type", "Content", "Participants", "Schedule", "Review"];

  const [aiTopic, setAiTopic] = useState("Handling Rejection & Frustration");
  const [aiCategory, setAiCategory] = useState("Respect & Society");
  const [targetBlock, setTargetBlock] = useState("Block C");
  const [loadingAi, setLoadingAi] = useState(false);
  const [generatedSession, setGeneratedSession] = useState<any>(null);
  const [publishMessage, setPublishMessage] = useState("");

  const handleGenerateSession = async () => {
    setLoadingAi(true);
    setPublishMessage("");
    try {
      const data = await generateAISession({ topic: aiTopic, targetGroup: targetBlock });

      setGeneratedSession(data);
    } catch (err: any) {
      console.error("AI Generation failed:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedSession) return;
    try {
      await publishSession(generatedSession);
      setPublishMessage("✨ Session published to Today's classroom schedule!");
    } catch (err: any) {
      setPublishMessage("Failed to publish session.");
    }
  };

  const programs = [
    { icon: <Heart size={22} />, title: "Anger Management", desc: "12 sessions · Beginner", color: T.burgundy, selected: true },
    { icon: <Brain size={22} />, title: "Cognitive Skills", desc: "8 sessions · Intermediate", color: "#60A5FA", selected: false },
    { icon: <Handshake size={22} />, title: "Family Relations", desc: "6 sessions · Advanced", color: T.green, selected: false },
    { icon: <Target size={22} />, title: "Goal Setting", desc: "10 sessions · Beginner", color: T.gold, selected: false },
  ];

  const modules = generatedSession?.steps
    ? generatedSession.steps.map((s: any) => ({
        title: `${s.stepNumber}. ${s.title}`,
        duration: `${s.durationMinutes} min`,
        status: s.stepNumber === 1 ? "done" : s.stepNumber === 2 ? "current" : "pending"
      }))
    : [
        { title: "Introduction to Emotions", duration: "45 min", status: "done" },
        { title: "Identifying Triggers", duration: "60 min", status: "done" },
        { title: "Coping Techniques — Breathing", duration: "50 min", status: "current" },
        { title: "Thought Stopping Practice", duration: "55 min", status: "pending" },
        { title: "Role Play: High Stress Scenarios", duration: "75 min", status: "pending" },
      ];

  return (
    <>
      <div className="page-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 fade-in">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>Build</span>
            <span className="text-xs" style={{ color: T.slateL }}>New Program</span>
          </div>
          <h1 className="font-bold leading-tight fade-up" style={{ fontSize: 40, color: T.cream, letterSpacing: "-0.03em" }}>
            <span className="gold-shimmer">Session Builder</span>
          </h1>
          <p className="mt-3 text-sm fade-up" style={{ color: T.creamDim, maxWidth: 560, animationDelay: "100ms" }}>
            Design personalized rehabilitation programs with AI-generated curriculum, curated content modules, and classroom scheduling.
          </p>
          <div className="flex gap-6 mt-8">
            {[
              { label: "Templates", value: "24", icon: <Layers size={18} />, color: T.gold },
              { label: "Modules", value: "156", icon: <BookMarked size={18} />, color: "#60A5FA" },
              { label: "Active", value: "8", icon: <Zap size={18} />, color: T.green },
            ].map((s, i) => (
              <div key={s.label} className="fade-up flex items-center gap-3" style={{ animationDelay: `${150 + i * 80}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold leading-none" style={{ color: T.cream }}>{s.value}</p>
                  <p className="text-[11px] mt-1" style={{ color: T.slateL }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 flex gap-5">
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* ✨ Gemini AI Generator Card */}
          <div className="fade-up rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${T.midnight} 0%, rgba(201,162,39,0.1) 100%)`, border: `1px solid ${T.gold}44`, boxShadow: T.cardShadow }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: T.gold }} />
                <p className="text-sm font-bold" style={{ color: T.cream }}>✨ Gemini AI Curriculum Generator</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>FastAPI Powered</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[10px] font-semibold" style={{ color: T.slateL }}>Session Topic</label>
                <input type="text" value={aiTopic} onChange={e => setAiTopic(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, color: T.cream }} />
              </div>
              <div>
                <label className="text-[10px] font-semibold" style={{ color: T.slateL }}>Category</label>
                <select value={aiCategory} onChange={e => setAiCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, color: T.cream }}>
                  <option>Respect & Society</option><option>Anger Management</option><option>Life After Prison</option><option>Family & Relationships</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold" style={{ color: T.slateL }}>Target Cellblock</label>
                <select value={targetBlock} onChange={e => setTargetBlock(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, color: T.cream }}>
                  <option>Block C</option><option>Block A</option><option>Block B</option><option>Block D</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={handleGenerateSession} disabled={loadingAi}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
                style={{ backgroundColor: T.gold, color: T.navy }}>
                {loadingAi ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {loadingAi ? "Generating Curriculum..." : "Generate 6-Step Plan via Gemini"}
              </button>

              {generatedSession && (
                <button onClick={handlePublish}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: T.green, color: "#fff" }}>
                  <CheckCircle size={13} />Publish to Schedule
                </button>
              )}
            </div>

            {publishMessage && (
              <p className="mt-2 text-xs font-semibold" style={{ color: T.gold }}>{publishMessage}</p>
            )}
          </div>
          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold" style={{ color: T.cream }}>Build Steps</p>
                <p className="text-[11px] mt-0.5" style={{ color: T.slate }}>Complete 5 steps to launch your program</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>Step {step} of 5</span>
            </div>
            <div className="flex items-start gap-0">
              {steps.map((s, i) => {
                const isDone = i < step - 1;
                const isCurrent = i === step - 1;
                return (
                  <div key={s} className="flex-1 flex items-start relative">
                    <div className="flex flex-col items-center z-10" style={{ cursor: "pointer" }} onClick={() => setStep(i + 1)}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all scale-in"
                        style={{
                          backgroundColor: isDone ? T.green : isCurrent ? T.gold : "rgba(255,255,255,0.06)",
                          color: isCurrent ? T.navy : isDone ? "#fff" : T.slateL,
                          border: isCurrent ? `2px solid ${T.gold}` : "none",
                          boxShadow: isCurrent ? `0 0 0 4px ${T.gold}22` : "none",
                        }}>
                        {isDone ? <CheckCircle size={16} /> : i + 1}
                      </div>
                      <p className={`mt-2 text-xs font-medium text-center ${isCurrent ? "" : ""}`}
                        style={{ color: isDone || isCurrent ? T.cream : T.slateL }}>{s}</p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-[2px]"
                        style={{ backgroundColor: isDone ? T.green : "rgba(255,255,255,0.08)" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold" style={{ color: T.cream }}>Select Program Type</p>
              <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: T.gold, color: T.navy }}><Plus size={13} />Custom</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {programs.map((p, i) => (
                <div key={p.title} className="fade-up relative rounded-xl p-4 cursor-pointer transition-all"
                  style={{
                    animationDelay: `${150 + i * 60}ms`,
                    backgroundColor: p.selected ? `${p.color}18` : "rgba(255,255,255,0.03)",
                    border: `2px solid ${p.selected ? p.color : "transparent"}`,
                    boxShadow: p.selected ? `0 0 0 4px ${p.color}15` : "none",
                  }}
                  onMouseEnter={e => { if (!p.selected) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (!p.selected) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)"; }}>
                  {p.selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center scale-in"
                      style={{ backgroundColor: p.color }}><CheckCircle size={14} color="#fff" /></div>
                  )}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44` }}>{p.icon}</div>
                  <p className="text-sm font-bold" style={{ color: T.cream }}>{p.title}</p>
                  <p className="text-[11px] mt-1" style={{ color: T.slateL }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold" style={{ color: T.cream }}>Session Modules</p>
                <p className="text-[11px] mt-0.5" style={{ color: T.slate }}>Drag modules to reorder · Click + to add</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: T.gold }}><GripVertical size={13} />Reorder</button>
            </div>
            <div className="flex flex-col gap-2">
              {modules.map((m: any, i: number) => (
                <div key={m.title} className="fade-up flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group"
                  style={{
                    animationDelay: `${250 + i * 50}ms`,
                    backgroundColor: m.status === "current" ? `${T.gold}15` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${m.status === "current" ? `${T.gold}44` : "transparent"}`,
                  }}
                  onMouseEnter={e => { if (m.status !== "current") (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (m.status !== "current") (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)"; }}>
                  <div className="text-slate opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"><GripVertical size={14} /></div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: m.status === "done" ? `${T.green}22` : m.status === "current" ? `${T.gold}22` : "rgba(255,255,255,0.06)",
                      color: m.status === "done" ? T.green : m.status === "current" ? T.gold : T.slateL,
                    }}>
                    {m.status === "done" ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: T.cream }}>{m.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px]" style={{ color: T.slateL }}><Clock size={11} className="inline mr-1" />{m.duration}</span>
                    {m.status === "pending" && <Edit size={13} style={{ color: T.slate }} className="cursor-pointer" />}
                    {m.status === "pending" && <Trash2 size={13} style={{ color: T.slate }} className="cursor-pointer hover:text-red-400 transition-colors" />}
                  </div>
                </div>
              ))}
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed cursor-pointer hover:opacity-80 transition-opacity text-xs font-semibold"
                style={{ borderColor: `${T.gold}44`, color: T.gold }}><Plus size={14} />Add Module from Library</button>
            </div>
          </div>
        </div>

        <div className="w-[320px] shrink-0 flex flex-col gap-5">
          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
            <p className="text-sm font-semibold mb-4" style={{ color: T.cream }}>Session Summary</p>
            <div className="space-y-3">
              {[
                { label: "Program", value: "Anger Management", color: T.gold },
                { label: "Modules", value: "5 of 12", color: "#60A5FA" },
                { label: "Duration", value: "4h 45m", color: T.green },
                { label: "Participants", value: "0 selected", color: T.burgundy },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center justify-between fade-up" style={{ animationDelay: `${100 + i * 60}ms` }}>
                  <span className="text-xs" style={{ color: T.slateL }}>{s.label}</span>
                  <span className="text-xs font-semibold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs" style={{ color: T.slateL }}>Completion</span>
                <span className="text-xs font-bold" style={{ color: T.gold }}>40%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="bar-grow h-full rounded-full" style={{ width: "40%", backgroundColor: T.gold }} />
              </div>
            </div>
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${T.green}22`, color: T.green }}>
                <Lightbulb size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: T.cream }}>AI Suggestion</p>
                <p className="text-[10px]" style={{ color: T.slate }}>Based on Block C data</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: T.creamDim }}>
              Consider adding <span style={{ color: T.gold, fontWeight: 600 }}>mindfulness module</span> — 68% of participants show improved anger control after breathing exercises.
            </p>
            <button className="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02]"
              style={{ backgroundColor: `${T.green}22`, color: T.green, border: `1px solid ${T.green}44` }}>
              + Add Mindfulness Module
            </button>
          </div>

          <div className="flex flex-col gap-2 fade-up" style={{ animationDelay: "150ms" }}>
            <button className="w-full py-3 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-[1.02] hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: T.gold, color: T.navy, boxShadow: `0 4px 20px ${T.gold}44` }}>
              <ArrowRight size={14} />Continue to Participants
            </button>
            <button className="w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{ border: `1px solid ${T.gold}33`, color: T.gold }}>Save Draft</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Lightbulb(props: any) {
  return <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 3: MY PRISONERS
// ═══════════════════════════════════════════════════════════════════════════

function PageMyPrisoners() {
  const [intakeWizardOpen, setIntakeWizardOpen] = useState(false);
  const [dbPrisoners, setDbPrisoners] = useState<any[]>([]);

  const loadPrisonerFiles = async () => {
    try {
      const res = await fetchPrisonerFiles();
      if (res && res.data) {
        setDbPrisoners(res.data);
      }
    } catch (err) {
      console.warn("Could not load Neon DB prisoner files:", err);
    }
  };

  useEffect(() => {
    loadPrisonerFiles();
  }, []);

  const combinedPrisoners = dbPrisoners.map((p: any) => ({
    initials: p.fullName ? p.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "PF",
    name: p.fullName,
    id: p.inmateId,
    block: p.securityBlock,
    prog: p.riskLevel?.includes("Low") ? 85 : p.riskLevel?.includes("High") ? 35 : 65,
    risk: p.riskLevel?.includes("Low") ? "Low" : p.riskLevel?.includes("High") ? "High" : "Medium",
    status: "Neon DB",
    sessions: 18,
    empathy: p.riskLevel?.includes("Low") ? 78 : p.riskLevel?.includes("High") ? 32 : 64,
    color: p.riskLevel?.includes("Low") ? T.gold : p.riskLevel?.includes("High") ? T.burgundy : T.amber,
    joined: new Date(p.createdAt || Date.now()).toLocaleDateString()
  }));


  const riskColor: Record<string, string> = { Low: T.green, Medium: T.amber, High: T.burgundy };
  const statusColor: Record<string, string> = { "Neon DB": T.gold, Active: "#60A5FA", "At Risk": T.burgundy, Progress: T.green, Graduating: T.gold, New: "#EF4444" };

  return (
    <>
      <PrisonerIntakeWizard 
        isOpen={intakeWizardOpen} 
        onClose={() => setIntakeWizardOpen(false)} 
        onSuccess={loadPrisonerFiles}
      />
      <div className="page-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 fade-in">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ backgroundColor: `${"#60A5FA"}22`, color: "#60A5FA" }}>Case Load</span>
            <span className="text-xs" style={{ color: T.slateL }}>{combinedPrisoners.length} active prisoner files</span>
          </div>
          <h1 className="font-bold leading-tight fade-up" style={{ fontSize: 40, color: T.cream, letterSpacing: "-0.03em" }}>
            <span style={{ color: T.cream }}>Prisoner </span>
            <span className="gold-shimmer">Rehabilitation Files</span>
          </h1>
          <p className="mt-3 text-sm fade-up" style={{ color: T.creamDim, maxWidth: 560, animationDelay: "100ms" }}>
            Create, track, and manage confidential prisoner rehabilitation intake files stored securely in Neon PostgreSQL.
          </p>
        </div>
      </div>

      <div className="p-6 flex gap-5">
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.slate }} />
                  <input type="text" placeholder="Search by name, ID..." className="pl-10 pr-4 py-2 rounded-xl text-xs outline-none w-64"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.cream }} />
                </div>
                <select className="px-3 py-2 rounded-xl text-xs outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.slateL }}>
                  <option>All Blocks</option><option>Block 4B</option><option>Block 2A</option><option>Block 1C</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIntakeWizardOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:opacity-90 transition-all active:scale-95 shadow-lg"
                  style={{ backgroundColor: T.gold, color: T.navy }}
                >
                  <UserPlus size={14} />
                  <span>+ Intake Prisoner File (Neon DB)</span>
                </button>
                <button className="p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ border: `1px solid ${T.border}`, color: T.slate }}><Download size={14} /></button>
              </div>
            </div>


            <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${T.border}` }}>
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", color: T.slate }}>
                <div className="col-span-3">Participant</div>
                <div className="col-span-1">Block</div>
                <div className="col-span-2">Progress</div>
                <div className="col-span-1">Empathy</div>
                <div className="col-span-1">Risk</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {combinedPrisoners.map((p, i) => (

                <div key={p.id} className="grid grid-cols-12 gap-4 items-center px-4 py-4 fade-up transition-colors cursor-pointer"
                  style={{
                    animationDelay: `${100 + i * 60}ms`,
                    borderTop: `1px solid ${T.border}`,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <Avatar initials={p.initials} size={40} bg={p.color} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: T.cream }}>{p.name}</p>
                      <p className="text-[11px]" style={{ color: T.slate }}>ID: {p.id} · {p.joined}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs font-bold px-2 py-1 rounded-md"
                      style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>{p.block}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                        <div className="bar-grow h-full rounded-full" style={{ width: `${p.prog}%`, backgroundColor: p.color, animationDelay: `${300 + i * 60}ms` }} />
                      </div>
                      <span className="text-[11px] font-bold shrink-0" style={{ color: T.cream }}>{p.prog}%</span>
                    </div>
                    <p className="text-[10px]" style={{ color: T.slate }}>{p.sessions} sessions</p>
                  </div>
                  <div className="col-span-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{
                        background: `conic-gradient(${riskColor[p.risk]} ${p.empathy * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                      }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: T.midnight }}>
                        <span style={{ color: riskColor[p.risk] }}>{p.empathy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: riskColor[p.risk] }}>
                      <Dot color={riskColor[p.risk]} />{p.risk}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${statusColor[p.status]}22`, color: statusColor[p.status] }}>{p.status}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="View Profile"
                      style={{ color: T.slate }}><Eye size={14} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="Edit Plan"
                      style={{ color: T.slate }}><Edit size={14} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="Session Notes"
                      style={{ color: T.slate }}><FileText size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
              <p className="text-xs" style={{ color: T.slate }}>Showing 1–6 of 6 participants</p>
              <div className="flex items-center gap-1">
                {["1", "2", "3"].map((n, i) => (
                  <button key={n} className="w-8 h-8 rounded-lg text-xs font-bold cursor-pointer transition-all"
                    style={{
                      backgroundColor: i === 0 ? T.gold : "transparent",
                      color: i === 0 ? T.navy : T.slateL,
                      border: i === 0 ? "none" : `1px solid ${T.border}`,
                    }}>{n}</button>
                ))}
                <button className="w-8 h-8 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ border: `1px solid ${T.border}`, color: T.slateL }}><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[320px] shrink-0 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 fade-up">
            {[
              { label: "Total", value: "6", icon: <Users size={16} />, color: T.gold },
              { label: "Active", value: "2", icon: <Zap size={16} />, color: "#60A5FA" },
              { label: "At Risk", value: "2", icon: <AlertTriangle size={16} />, color: T.burgundy },
              { label: "Graduating", value: "1", icon: <Award size={16} />, color: T.green },
            ].map((s, i) => (
              <div key={s.label} className="rounded-xl p-4 flex flex-col gap-2 fade-up"
                style={{ animationDelay: `${i * 60}ms`, backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.icon}</div>
                <p className="text-2xl font-bold leading-none" style={{ color: T.cream }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: T.slate }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: T.cream }}>Block Distribution</p>
              <PieChart size={16} style={{ color: T.gold }} />
            </div>
            <div className="flex items-center justify-center my-4 relative">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke={T.burgundy} strokeWidth="3" strokeDasharray="33 100" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke={T.gold} strokeWidth="3" strokeDasharray="25 100" strokeDashoffset="-33" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#60A5FA" strokeWidth="3" strokeDasharray="25 100" strokeDashoffset="-58" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke={T.green} strokeWidth="3" strokeDasharray="17 100" strokeDashoffset="-83" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-3xl font-bold" style={{ color: T.cream }}>6</p>
                  <p className="text-[10px]" style={{ color: T.slate }}>Total</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Block A", pct: "33%", color: T.burgundy },
                { label: "Block B", pct: "17%", color: T.green },
                { label: "Block C", pct: "33%", color: "#60A5FA" },
                { label: "Block D", pct: "17%", color: T.gold },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                  <span className="text-[11px]" style={{ color: T.slate }}>{b.label}</span>
                  <span className="text-[11px] font-bold ml-auto" style={{ color: T.cream }}>{b.pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "150ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} style={{ color: T.amber }} />
              <p className="text-sm font-semibold" style={{ color: T.cream }}>Attention Required</p>
            </div>
            <div className="space-y-3">
              {[
                { name: "Arjun Patel", msg: "Low empathy score · Welfare check needed", color: T.burgundy, urgency: "High" },
                { name: "Suresh Krishnan", msg: "New intake · Orientation session pending", color: T.amber, urgency: "Medium" },
              ].map((a, i) => (
                <div key={a.name} className="fade-up p-3 rounded-xl flex items-start gap-3"
                  style={{ animationDelay: `${200 + i * 50}ms`, backgroundColor: `${a.color}10`, border: `1px solid ${a.color}33` }}>
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `${a.color}33`, color: a.color }}>{a.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold" style={{ color: T.cream }}>{a.name}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: a.color, color: "#fff" }}>{a.urgency}</span>
                    </div>
                    <p className="text-[10px] leading-relaxed" style={{ color: T.slateL }}>{a.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: T.gold, color: T.navy }}>Review All Alerts</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 4: REPORTS & ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════

function PageReports() {
  const barData = [
    { label: "Week 1", val: 62 }, { label: "Week 2", val: 58 }, { label: "Week 3", val: 71 },
    { label: "Week 4", val: 65 }, { label: "Week 5", val: 78 }, { label: "Week 6", val: 82 },
    { label: "Week 7", val: 75 }, { label: "Week 8", val: 88 },
  ];
  const lineData = [45, 52, 48, 61, 58, 67, 72, 70, 78, 82, 79, 88];

  return (
    <>
      <div className="page-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 fade-in">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ backgroundColor: `${T.green}22`, color: T.green }}>Insights</span>
            <span className="text-xs" style={{ color: T.slateL }}>Q3 · 2026</span>
          </div>
          <h1 className="font-bold leading-tight fade-up" style={{ fontSize: 40, color: T.cream, letterSpacing: "-0.03em" }}>
            Reports & <span className="gold-shimmer">Analytics</span>
          </h1>
          <p className="mt-3 text-sm fade-up" style={{ color: T.creamDim, maxWidth: 560, animationDelay: "100ms" }}>
            Data-driven insights into rehabilitation outcomes, engagement trends, and program effectiveness across all blocks.
          </p>
        </div>
      </div>

      <div className="p-6 flex gap-5 flex-wrap">
        <div className="grid grid-cols-4 gap-4 w-full fade-up">
          {[
            { label: "Avg. Progress Rate", value: "68%", delta: "+8.2%", icon: <TrendingUp size={20} />, color: T.green, positive: true },
            { label: "Sessions Delivered", value: "1,284", delta: "+142", icon: <CalendarDays size={20} />, color: T.gold, positive: true },
            { label: "Avg. Empathy Score", value: "62.4", delta: "+5.1", icon: <Heart size={20} />, color: "#60A5FA", positive: true },
            { label: "Reoffending Risk", value: "18%", delta: "-3.4%", icon: <Shield size={20} />, color: T.burgundy, positive: true },
          ].map((s, i) => (
            <div key={s.label} className="rounded-2xl p-5 fade-up"
              style={{
                animationDelay: `${80 + i * 70}ms`,
                backgroundColor: T.midnight,
                border: `1px solid ${T.border}`,
                boxShadow: T.cardShadow,
              }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>{s.icon}</div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{
                    backgroundColor: s.positive ? `${T.green}22` : `${T.burgundy}22`,
                    color: s.positive ? T.green : T.burgundy,
                  }}>
                  {s.positive ? <TrendingUp size={10} /> : <TrendingUp size={10} style={{ transform: "rotate(180deg)" }} />}{s.delta}
                </span>
              </div>
              <p className="text-3xl font-bold leading-none" style={{ color: T.cream }}>{s.value}</p>
              <p className="text-xs mt-2" style={{ color: T.slateL }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-5 w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="fade-up rounded-2xl p-6" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-base font-bold" style={{ color: T.cream }}>Sessions Engagement — 8 Weeks</p>
                  <p className="text-[11px] mt-1" style={{ color: T.slate }}>Participation rate across all programs</p>
                </div>
                <div className="flex items-center gap-2">
                  {["Weekly", "Monthly", "Quarterly"].map((v, i) => (
                    <button key={v} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
                      style={{
                        backgroundColor: i === 0 ? `${T.gold}22` : "transparent",
                        color: i === 0 ? T.gold : T.slateL,
                        border: i === 0 ? `1px solid ${T.gold}44` : `1px solid ${T.border}`,
                      }}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-between gap-2" style={{ height: 240 }}>
                {barData.map((d, i) => (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-2 fade-up" style={{ animationDelay: `${200 + i * 60}ms` }}>
                    <div className="w-full flex items-end" style={{ height: 200 }}>
                      <div className="chart-bar w-full rounded-t-lg relative group cursor-pointer"
                        style={{
                          height: `${d.val}%`,
                          background: `linear-gradient(180deg, ${T.gold} 0%, ${T.gold}88 100%)`,
                          boxShadow: `0 0 20px ${T.gold}33`,
                        }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                          style={{ backgroundColor: T.navy, color: T.gold, border: `1px solid ${T.gold}44` }}>{d.val}%</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: T.slate }}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "100ms" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: T.cream }}>Empathy Trend</p>
                    <p className="text-[11px] mt-0.5" style={{ color: T.slate }}>12-month average</p>
                  </div>
                  <Activity size={16} style={{ color: "#60A5FA" }} />
                </div>
                <svg viewBox="0 0 400 140" className="w-full" style={{ height: 140 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1="0" y1={35 * i + 15} x2="400" y2={35 * i + 15} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  ))}
                  <path d={lineData.map((v, i) => {
                    const x = (i / (lineData.length - 1)) * 390 + 5;
                    const y = 125 - ((v - 40) / 55) * 105;
                    return (i === 0 ? "M" : "L") + x + "," + y;
                  }).join(" ") + " L 395,125 L 5,125 Z"} fill="url(#lineGrad)" />
                  <path d={lineData.map((v, i) => {
                    const x = (i / (lineData.length - 1)) * 390 + 5;
                    const y = 125 - ((v - 40) / 55) * 105;
                    return (i === 0 ? "M" : "L") + x + "," + y;
                  }).join(" ")} fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {lineData.map((v, i) => {
                    const x = (i / (lineData.length - 1)) * 390 + 5;
                    const y = 125 - ((v - 40) / 55) * 105;
                    return i % 3 === 0 ? (
                      <circle key={i} cx={x} cy={y} r="4" fill={T.midnight} stroke="#60A5FA" strokeWidth="2" />
                    ) : null;
                  })}
                </svg>
              </div>

              <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "150ms" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: T.cream }}>Program Effectiveness</p>
                    <p className="text-[11px] mt-0.5" style={{ color: T.slate }}>Completion vs improvement</p>
                  </div>
                  <Target size={16} style={{ color: T.green }} />
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Anger Management", pct: 87, color: T.burgundy },
                    { name: "Cognitive Skills", pct: 74, color: "#60A5FA" },
                    { name: "Family Relations", pct: 69, color: T.green },
                    { name: "Goal Setting", pct: 82, color: T.gold },
                    { name: "Vocational Training", pct: 58, color: T.amber },
                  ].map((p, i) => (
                    <div key={p.name} className="fade-up" style={{ animationDelay: `${200 + i * 60}ms` }}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px]" style={{ color: T.slateL }}>{p.name}</span>
                        <span className="text-[11px] font-bold" style={{ color: T.cream }}>{p.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                        <div className="bar-grow h-full rounded-full" style={{ width: `${p.pct}%`, backgroundColor: p.color, animationDelay: `${250 + i * 80}ms` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[320px] shrink-0 flex flex-col gap-5">
            <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold" style={{ color: T.cream }}>Outcomes By Block</p>
                <Layers size={16} style={{ color: T.gold }} />
              </div>
              <div className="space-y-4">
                {[
                  { block: "Block A", pct: 62, people: 24, color: T.burgundy, trend: "+4" },
                  { block: "Block B", pct: 71, people: 19, color: T.green, trend: "+9" },
                  { block: "Block C", pct: 74, people: 28, color: "#60A5FA", trend: "+6" },
                  { block: "Block D", pct: 58, people: 22, color: T.gold, trend: "+2" },
                ].map((b, i) => (
                  <div key={b.block} className="fade-up" style={{ animationDelay: `${100 + i * 60}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: `${b.color}22`, color: b.color }}>{b.block.split(" ")[1]}</span>
                        <span className="text-xs font-semibold" style={{ color: T.cream }}>{b.block}</span>
                        <span className="text-[10px]" style={{ color: T.slate }}>({b.people})</span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: T.green }}>{b.trend}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <div className="bar-grow h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color, animationDelay: `${150 + i * 80}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: T.cream }}>Top Performers</p>
                  <p className="text-[10px]" style={{ color: T.slate }}>This quarter</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { rank: 1, initials: "DK", name: "Deepak Kumar", score: 92, color: T.gold },
                  { rank: 2, initials: "MN", name: "Manoj Nair", score: 88, color: "#C0C0C0" },
                  { rank: 3, initials: "VS", name: "Vikram Sharma", score: 80, color: "#CD7F32" },
                ].map((p, i) => (
                  <div key={p.rank} className="fade-up flex items-center gap-3 p-3 rounded-xl"
                    style={{ animationDelay: `${150 + i * 60}ms`, backgroundColor: `${p.color}10` }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{ backgroundColor: p.color, color: T.navy }}>#{p.rank}</div>
                    <Avatar initials={p.initials} size={32} bg={T.midnightL} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: T.cream }}>{p.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} fill={T.gold} style={{ color: T.gold }} />
                        <span className="text-[10px] font-bold" style={{ color: T.gold }}>{p.score} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 fade-up" style={{ animationDelay: "150ms" }}>
              <button className="w-full py-3 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ backgroundColor: T.gold, color: T.navy, boxShadow: `0 4px 20px ${T.gold}44` }}>
                <Download size={14} />Export Full Report
              </button>
              <button className="w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                style={{ border: `1px solid ${T.gold}33`, color: T.gold }}>
                <RefreshCw size={13} />Schedule Weekly Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 5: STORY LIBRARY
// ═══════════════════════════════════════════════════════════════════════════

function PageStoryLibrary() {
  const [selectedCat, setSelectedCat] = useState("All");
  const cats = ["All", "Redemption", "Family", "Addiction", "Growth", "Education"];

  const stories = [
    { title: "The Carpenter's Second Chance", cat: "Redemption", read: "8 min", level: "Beginner", views: "1.2K", rating: 4.8, cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop&auto=format&q=70", color: T.gold, tag: "New" },
    { title: "Letters to My Daughter", cat: "Family", read: "12 min", level: "Intermediate", views: "842", rating: 4.9, cover: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=500&fit=crop&auto=format&q=70", color: "#60A5FA" },
    { title: "Breaking the Cycle", cat: "Addiction", read: "15 min", level: "Advanced", views: "2.1K", rating: 4.7, cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop&auto=format&q=70", color: T.burgundy },
    { title: "Learning to Read at 32", cat: "Education", read: "10 min", level: "Beginner", views: "956", rating: 4.9, cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=500&fit=crop&auto=format&q=70", color: T.green, tag: "Popular" },
    { title: "Father & Son Reunion", cat: "Family", read: "14 min", level: "Intermediate", views: "1.5K", rating: 4.6, cover: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=500&fit=crop&auto=format&q=70", color: T.amber },
    { title: "The Road Within", cat: "Growth", read: "11 min", level: "Intermediate", views: "678", rating: 4.5, cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=500&fit=crop&auto=format&q=70", color: "#22C55E" },
    { title: "Mending Fences", cat: "Redemption", read: "9 min", level: "Beginner", views: "3.4K", rating: 4.8, cover: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=500&fit=crop&auto=format&q=70", color: T.gold },
    { title: "From Darkness to Light", cat: "Addiction", read: "18 min", level: "Advanced", views: "2.8K", rating: 4.9, cover: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=500&fit=crop&auto=format&q=70", color: T.burgundy, tag: "Staff Pick" },
  ];

  return (
    <>
      <div className="page-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 fade-in">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>Resource</span>
            <span className="text-xs" style={{ color: T.slateL }}>24 curated narratives</span>
          </div>
          <h1 className="font-bold leading-tight fade-up" style={{ fontSize: 40, color: T.cream, letterSpacing: "-0.03em" }}>
            Story <span className="gold-shimmer">Library</span>
          </h1>
          <p className="mt-3 text-sm fade-up" style={{ color: T.creamDim, maxWidth: 560, animationDelay: "100ms" }}>
            Powerful narratives of hope, transformation, and second chances — carefully curated to inspire empathy and reflection.
          </p>
        </div>
      </div>

      <div className="p-6 flex gap-5">
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="fade-up flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {cats.map((c, i) => (
                <button key={c} onClick={() => setSelectedCat(c)}
                  className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all fade-up"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    backgroundColor: selectedCat === c ? T.gold : "rgba(255,255,255,0.04)",
                    color: selectedCat === c ? T.navy : T.slateL,
                    border: selectedCat === c ? "none" : `1px solid ${T.border}`,
                    boxShadow: selectedCat === c ? `0 4px 16px ${T.gold}44` : "none",
                  }}>{c}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.slate }} />
                <input type="text" placeholder="Search stories..." className="pl-10 pr-4 py-2 rounded-xl text-xs outline-none w-52"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.cream }} />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: T.gold, color: T.navy }}><Plus size={13} />Add Story</button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {stories.filter(s => selectedCat === "All" || s.cat === selectedCat).map((s, i) => (
              <div key={s.title} className="fade-up rounded-2xl overflow-hidden cursor-pointer group transition-all"
                style={{
                  animationDelay: `${i * 60}ms`,
                  backgroundColor: T.midnight,
                  border: `1px solid ${T.border}`,
                  boxShadow: T.cardShadow,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.5)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = T.cardShadow; }}>
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img src={s.cover} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${T.midnight} 100%)` }} />
                  {s.tag && (
                    <span className="absolute top-3 left-3 text-[9px] font-bold px-2 py-1 rounded-full scale-in"
                      style={{ backgroundColor: s.color, color: s.color === T.gold ? T.navy : "#fff" }}>{s.tag}</span>
                  )}
                  <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(10,22,40,0.72)", color: s.color, backdropFilter: "blur(8px)" }}>{s.cat}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "rgba(10,22,40,0.6)" }}>
                    <button className="w-12 h-12 rounded-full flex items-center justify-center scale-in"
                      style={{ backgroundColor: T.gold, color: T.navy, boxShadow: `0 4px 20px ${T.gold}55` }}>
                      <Play size={16} fill={T.navy} />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-bold leading-snug group-hover:text-gold transition-colors" style={{ color: T.cream }}>{s.title}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={10} fill={n <= Math.round(s.rating) ? T.gold : "transparent"} style={{ color: n <= Math.round(s.rating) ? T.gold : T.slate }} />
                      ))}
                      <span className="text-[10px] font-bold ml-1" style={{ color: T.gold }}>{s.rating}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: T.slateL }}><Eye size={10} className="inline mr-1" />{s.views}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.level}</span>
                    <span className="text-[10px] ml-auto" style={{ color: T.slateL }}><Clock size={10} className="inline mr-1" />{s.read}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[300px] shrink-0 flex flex-col gap-5">
          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: T.cream }}>My Reading List</p>
              <BookMarked size={16} style={{ color: T.gold }} />
            </div>
            <div className="space-y-2.5">
              {[
                { title: "The Carpenter's Second...", prog: 75, color: T.gold },
                { title: "Letters to My Daughter", prog: 30, color: "#60A5FA" },
                { title: "Learning to Read at 32", prog: 10, color: T.green },
              ].map((r, i) => (
                <div key={r.title} className="fade-up p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  style={{ animationDelay: `${100 + i * 50}ms`, backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <div className="flex justify-between mb-2">
                    <p className="text-[11px] font-semibold truncate pr-2" style={{ color: T.cream }}>{r.title}</p>
                    <span className="text-[10px] font-bold shrink-0" style={{ color: r.color }}>{r.prog}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                    <div className="bar-grow h-full rounded-full" style={{ width: `${r.prog}%`, backgroundColor: r.color, animationDelay: `${150 + i * 60}ms` }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:opacity-90"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: T.cream, border: `1px solid ${T.border}` }}>View All Saved</button>
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "80ms" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: T.cream }}>Categories</p>
              <FolderOpen size={16} style={{ color: "#60A5FA" }} />
            </div>
            <div className="space-y-2">
              {[
                { name: "Redemption", count: 7, color: T.gold },
                { name: "Family Bonds", count: 5, color: "#60A5FA" },
                { name: "Addiction Recovery", count: 4, color: T.burgundy },
                { name: "Personal Growth", count: 5, color: T.green },
                { name: "Education", count: 3, color: T.amber },
              ].map((c, i) => (
                <div key={c.name} className="fade-up flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
                  style={{ animationDelay: `${120 + i * 50}ms` }}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs font-medium" style={{ color: T.slateL }}>{c.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${c.color}22`, color: c.color }}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up rounded-2xl p-5" style={{
            background: `linear-gradient(135deg, ${T.gold}22 0%, ${T.midnight} 100%)`,
            border: `1px solid ${T.gold}44`,
            boxShadow: T.cardShadow,
            animationDelay: "120ms"
          }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} style={{ color: T.gold }} />
              <p className="text-xs font-bold" style={{ color: T.gold }}>PRO TIP</p>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: T.cream }}>
              Pair <span style={{ color: T.gold, fontWeight: 600 }}>Letters to My Daughter</span> with the Family Relations program — participants show 40% higher engagement.
            </p>
            <button className="w-full py-2 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
              style={{ backgroundColor: T.gold, color: T.navy }}>Assign to Block C</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Sparkles(props: any) {
  return <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 6: ROLEPLAY HISTORY
// ═══════════════════════════════════════════════════════════════════════════

function PageRoleplay() {
  const [scenariosList, setScenariosList] = useState<any[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("scen-101");
  const [participantName, setParticipantName] = useState("Vikram Sharma (Block C)");
  const [activeLog, setActiveLog] = useState<any>(null);
  const [userDialogue, setUserDialogue] = useState("");
  const [loadingTurn, setLoadingTurn] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  useEffect(() => {
    fetchRoleplayScenarios().then(data => {
      if (data && data.length > 0) {
        setScenariosList(data);
        setSelectedScenarioId(data[0].scenarioId);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleStartSimulation = async () => {
    try {
      const log = await startRoleplay(selectedScenarioId, participantName);
      setActiveLog(log);
      setShowSimulatorModal(true);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSendTurn = async () => {
    if (!activeLog || !userDialogue.trim()) return;
    setLoadingTurn(true);
    try {
      const res = await submitRoleplayTurn(activeLog.logId, userDialogue);
      setActiveLog(res.sessionLog || activeLog);
      setUserDialogue("");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingTurn(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!activeLog) return;
    try {
      const completed = await completeRoleplay(activeLog.logId);
      setActiveLog(completed);
    } catch (err: any) {
      console.error(err);
    }
  };

  const sessions = [
    { title: "De-escalation — Bar Fight", date: "Jul 24", duration: "22 min", score: 86, block: "C", participants: 8, scenario: "High Conflict", status: "Completed", color: T.green, icon: <Handshake size={18} /> },
    { title: "Family Visit — Tense Reunion", date: "Jul 22", duration: "35 min", score: 72, block: "A", participants: 5, scenario: "Emotional", status: "Completed", color: "#60A5FA", icon: <Heart size={18} /> },
    { title: "Job Interview Nerves", date: "Jul 20", duration: "28 min", score: 91, block: "D", participants: 4, scenario: "Vocational", status: "Completed", color: T.gold, icon: <Target size={18} />, tag: "Top Score" },
    { title: "Confronting Authority", date: "Jul 18", duration: "19 min", score: 54, block: "B", participants: 6, scenario: "Authority", status: "Review", color: T.amber, icon: <Shield size={18} />, tag: "Needs Review" },
    { title: "Apology & Forgiveness", date: "Jul 16", duration: "31 min", score: 78, block: "C", participants: 7, scenario: "Emotional", status: "Completed", color: T.green, icon: <Heart size={18} /> },
    { title: "Peer Pressure Simulation", date: "Jul 14", duration: "24 min", score: 65, block: "A", participants: 9, scenario: "Social", status: "Completed", color: T.burgundy, icon: <Users size={18} /> },
  ];

  return (
    <>
      <div className="page-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 fade-in">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ backgroundColor: `${T.burgundy}22`, color: T.burgundy }}>Practice</span>
            <span className="text-xs" style={{ color: T.slateL }}>24 scenarios · 6 active</span>
          </div>
          <h1 className="font-bold leading-tight fade-up" style={{ fontSize: 40, color: T.cream, letterSpacing: "-0.03em" }}>
            Roleplay <span className="gold-shimmer">Simulator & History</span>
          </h1>
          <p className="mt-3 text-sm fade-up" style={{ color: T.creamDim, maxWidth: 560, animationDelay: "100ms" }}>
            Engage in live AI-driven roleplay simulations powered by Gemini AI to evaluate de-escalation ratings, tone control, and empathy.
          </p>
        </div>
      </div>

      <div className="p-6 flex gap-5">
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* 🎭 Interactive Roleplay Launcher Card */}
          <div className="fade-up rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${T.midnight} 0%, ${T.burgundy}22 100%)`, border: `1px solid ${T.burgundy}44`, boxShadow: T.cardShadow }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Theater size={20} style={{ color: T.gold }} />
                <p className="text-sm font-bold" style={{ color: T.cream }}>🎭 Interactive Gemini Roleplay Simulator</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${T.gold}22`, color: T.gold }}>FastAPI Gemini Engine</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[10px] font-semibold" style={{ color: T.slateL }}>Select Practice Scenario</label>
                <select value={selectedScenarioId} onChange={e => setSelectedScenarioId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, color: T.cream }}>
                  {scenariosList.map(s => (
                    <option key={s.scenarioId} value={s.scenarioId}>{s.title} ({s.category})</option>
                  ))}
                  <option value="scen-101">De-escalating Block Conflict</option>
                  <option value="scen-102">Re-entry Job Interview Practice</option>
                  <option value="scen-103">Authority Figure Interaction</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold" style={{ color: T.slateL }}>Participant Identifier</label>
                <input type="text" value={participantName} onChange={e => setParticipantName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, color: T.cream }} />
              </div>
            </div>

            <button onClick={handleStartSimulation}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
              style={{ backgroundColor: T.gold, color: T.navy, boxShadow: `0 4px 16px ${T.gold}44` }}>
              <Play size={13} fill={T.navy} />Launch Roleplay Simulation Session
            </button>
          </div>

          {/* 💬 Roleplay Simulator Modal / Drawer */}
          {showSimulatorModal && activeLog && (
            <div className="fade-up rounded-2xl p-5 relative" style={{ backgroundColor: T.midnight, border: `2px solid ${T.gold}`, boxShadow: T.cardShadow }}>
              <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: T.cream }}>🎭 Active Simulation: {activeLog.scenarioTitle}</p>
                  <p className="text-[11px]" style={{ color: T.slate }}>Participant: {activeLog.participantName} · Status: <span style={{ color: T.green }}>{activeLog.status}</span></p>
                </div>
                <button onClick={() => setShowSimulatorModal(false)} className="p-1 rounded-lg hover:bg-white/10" style={{ color: T.slateL }}><X size={16} /></button>
              </div>

              {/* Chat turns */}
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
                {activeLog.turns && activeLog.turns.map((t: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl px-4 py-2 text-xs" style={{ backgroundColor: T.midnightL, color: T.cream, border: `1px solid ${T.border}` }}>
                        <p className="font-semibold text-[10px]" style={{ color: T.gold }}>Participant Dialogue:</p>
                        <p className="mt-0.5">{t.userInput}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 text-xs" style={{ backgroundColor: "rgba(201,162,39,0.08)", color: T.cream, border: `1px solid ${T.gold}44` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[10px]" style={{ color: T.gold }}>Gemini AI Actor Response:</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${T.green}22`, color: T.green }}>De-escalation: {t.deEscalationScore}/100</span>
                        </div>
                        <p className="leading-relaxed">{t.actorResponse}</p>
                        {t.empathyFeedback && (
                          <p className="mt-2 text-[10px] italic border-t pt-1" style={{ borderColor: `${T.gold}22`, color: T.creamDim }}>
                            💡 Empathy Feedback: {t.empathyFeedback}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {activeLog.turns?.length === 0 && (
                  <p className="text-xs text-center py-6" style={{ color: T.slateL }}>Type your opening dialogue response to start de-escalation practice...</p>
                )}
              </div>

              {/* Dialogue input */}
              <div className="flex gap-2">
                <input type="text" value={userDialogue} onChange={e => setUserDialogue(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSendTurn(); }}
                  placeholder="Type participant dialogue..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, color: T.cream }} />
                <button onClick={handleSendTurn} disabled={loadingTurn}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  style={{ backgroundColor: T.gold, color: T.navy }}>
                  {loadingTurn ? "Processing..." : "Send Dialogue"}
                </button>
                <button onClick={handleCompleteSession}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ backgroundColor: `${T.burgundy}44`, color: T.cream, border: `1px solid ${T.burgundy}` }}>
                  Complete
                </button>
              </div>

              {activeLog.aiAnalysisSummary && (
                <div className="mt-3 p-3 rounded-xl text-xs" style={{ backgroundColor: `${T.green}18`, border: `1px solid ${T.green}44`, color: T.cream }}>
                  <p className="font-bold" style={{ color: T.green }}>✨ Session Final Analysis Summary:</p>
                  <p className="mt-1 text-[11px]">{activeLog.aiAnalysisSummary}</p>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 fade-up">
            {[
              { label: "Sessions This Month", value: "47", sub: "+12 vs last month", icon: <Clapperboard size={20} />, color: T.gold, positive: true },
              { label: "Avg. Performance Score", value: "74.2", sub: "+5.8 improvement", icon: <Award size={20} />, color: T.green, positive: true },
              { label: "Scenarios Mastered", value: "18", sub: "of 24 available", icon: <CheckSquare size={20} />, color: "#60A5FA", positive: true },
            ].map((s, i) => (
              <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4 fade-up"
                style={{ animationDelay: `${80 + i * 70}ms`, backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-3xl font-bold leading-none" style={{ color: T.cream }}>{s.value}</p>
                  <p className="text-xs mt-1.5" style={{ color: T.slateL }}>{s.label}</p>
                  <p className="text-[10px] mt-0.5 font-semibold" style={{ color: s.color }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold" style={{ color: T.cream }}>Recent Sessions</p>
                <p className="text-[11px] mt-0.5" style={{ color: T.slate }}>Click a session to view recording & AI analysis</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 rounded-xl text-xs outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.slateL }}>
                  <option>All Scenarios</option><option>High Conflict</option><option>Emotional</option><option>Vocational</option>
                </select>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: T.gold, color: T.navy }}><Play size={12} />Start New Session</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {sessions.map((s, i) => (
                <div key={s.title} className="fade-up rounded-xl overflow-hidden transition-all group cursor-pointer"
                  style={{
                    animationDelay: `${120 + i * 60}ms`,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: `1px solid ${T.border}`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = `${s.color}55`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = T.border; }}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${s.color}18`, color: s.color, border: `1px solid ${s.color}44` }}>
                        {s.icon}
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-in"
                        style={{ backgroundColor: s.color, color: "#fff", boxShadow: `0 2px 8px ${s.color}55` }}>
                        <Play size={10} fill="#fff" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <p className="text-sm font-semibold" style={{ color: T.cream }}>{s.title}</p>
                        {s.tag && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.tag}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-wrap text-[11px]" style={{ color: T.slate }}>
                        <span><CalendarDays size={11} className="inline mr-1" />{s.date}</span>
                        <span><Clock size={11} className="inline mr-1" />{s.duration}</span>
                        <span><Users size={11} className="inline mr-1" />{s.participants} participants</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{ backgroundColor: `${s.color}18`, color: s.color }}>{s.scenario}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      <div className="text-center">
                        <div className="relative w-14 h-14">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={`${s.score} 100`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold" style={{ color: T.cream }}>{s.score}</span>
                          </div>
                        </div>
                        <p className="text-[9px] mt-1 font-semibold" style={{ color: s.color }}>{s.status}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: T.slate }} title="Download"><Download size={14} /></button>
                        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: T.slate }} title="Analysis"><BarChart2 size={14} /></button>
                        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: T.slate }} title="More"><MoreHorizontal size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[320px] shrink-0 flex flex-col gap-5">
          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: T.cream }}>Skill Breakdown</p>
              <Activity size={16} style={{ color: T.green }} />
            </div>
            <div className="space-y-3.5">
              {[
                { name: "Empathy", score: 82, color: "#60A5FA" },
                { name: "Active Listening", score: 76, color: T.green },
                { name: "De-escalation", score: 68, color: T.gold },
                { name: "Emotion Regulation", score: 71, color: T.amber },
                { name: "Assertiveness", score: 59, color: T.burgundy },
              ].map((sk, i) => (
                <div key={sk.name} className="fade-up" style={{ animationDelay: `${100 + i * 50}ms` }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px]" style={{ color: T.slateL }}>{sk.name}</span>
                    <span className="text-[11px] font-bold" style={{ color: sk.color }}>{sk.score}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                    <div className="bar-grow h-full rounded-full" style={{ width: `${sk.score}%`, backgroundColor: sk.color, animationDelay: `${150 + i * 80}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up rounded-2xl overflow-hidden" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "80ms" }}>
            <div className="relative" style={{ height: 120 }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop&auto=format&q=70"
                alt="AI Analysis" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.midnight} 0%, transparent 100%)` }} />
            </div>
            <div className="p-4 pt-0 -mt-6 relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: T.burgundy }}>
                  <Brain style={{ color: "#fff" }} size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: T.cream }}>AI Insights</p>
                  <p className="text-[10px]" style={{ color: T.slate }}>Jul 18 session</p>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed mb-3" style={{ color: T.creamDim }}>
                Participant #4 showed <span style={{ color: T.gold, fontWeight: 600 }}>strong empathy cues</span> but missed 2 de-escalation opportunities. Recommend: <span style={{ color: "#60A5FA", fontWeight: 600 }}>Calm Down Routine</span> module.
              </p>
              <button className="w-full py-2 rounded-lg text-[11px] font-bold cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                style={{ backgroundColor: `${T.burgundy}22`, color: T.burgundy, border: `1px solid ${T.burgundy}44` }}>
                <Eye size={12} />View Full AI Analysis
              </button>
            </div>
          </div>

          <div className="fade-up rounded-2xl p-5" style={{ backgroundColor: T.midnight, border: `1px solid ${T.border}`, boxShadow: T.cardShadow, animationDelay: "120ms" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: T.cream }}>Scenarios Library</p>
              <Clapperboard size={16} style={{ color: T.burgundy }} />
            </div>
            <div className="space-y-2">
              {[
                { name: "De-escalation Scenarios", total: 8, done: 5, color: T.green },
                { name: "Emotional Reunion", total: 5, done: 3, color: "#60A5FA" },
                { name: "Vocational Practice", total: 6, done: 6, color: T.gold },
                { name: "Authority Figures", total: 5, done: 4, color: T.amber },
              ].map((sc, i) => (
                <div key={sc.name} className="fade-up p-2.5 rounded-xl"
                  style={{ animationDelay: `${160 + i * 50}ms`, backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: T.cream }}>{sc.name}</span>
                    <span className="text-[10px] font-bold" style={{ color: sc.color }}>{sc.done}/{sc.total}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                    <div className="bar-grow h-full rounded-full"
                      style={{ width: `${(sc.done / sc.total) * 100}%`, backgroundColor: sc.color, animationDelay: `${200 + i * 80}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App({ initialUser }: { initialUser?: any }) {
  const router = useRouter();
  const [active, setActive] = useState(1);
  const [currentUser, setCurrentUser] = useState<any>(initialUser || null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchCurrentUser();
        if (res && res.user) {
          setCurrentUser(res.user);
        }
      } catch (err) {
        console.warn("Could not fetch logged-in user profile:", err);
      }
    }
    loadProfile();
  }, []);

  // 5-Minute Auto-Logout Timer Hook
  useEffect(() => {
    if (timeLeft <= 0) {
      clearAuthToken();
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const handleLogout = () => {
    clearAuthToken();
    router.push("/");
  };

  const renderPage = () => {
    switch (active) {
      case 1: return <PageToday currentUser={currentUser} />;
      case 2: return <PageSessionBuilder />;
      case 3: return <PageMyPrisoners />;
      case 4: return <PageReports />;
      case 5: return <PageStoryLibrary />;
      case 6: return <PageRoleplay />;
      default: return <PageToday currentUser={currentUser} />;
    }
  };

  return (
    <>
      <Styles />
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser || { fullName: "Counselor Officer", email: "demo@kintsu.org", role: "Counselor" }}
        onLogout={handleLogout}
      />

      <div className="flex min-h-screen" style={{ backgroundColor: T.midnight, fontFamily: "Inter, sans-serif" }}>
        <Sidebar 
          active={active} 
          setActive={setActive} 
          currentUser={currentUser}
          onOpenProfile={() => setProfileModalOpen(true)}
          onLogout={handleLogout}
          timeLeft={timeLeft}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto" style={{ backgroundColor: T.midnight }}>
          <div key={active} className="fade-in" style={{ animationDuration: "350ms" }}>
            {renderPage()}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}


