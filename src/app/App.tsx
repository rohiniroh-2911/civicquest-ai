import { useState, useRef } from "react";
import {
  Home, AlertCircle, CheckCircle2, Clock, BarChart3, User,
  LogOut, Bell, Menu, X, Upload, MapPin, Brain, Shield, Star,
  TrendingUp, Award, Zap, Eye, Flag, Search, Building2,
  Droplets, Trash2, Lightbulb, Waves, Moon, Sun, Trophy,
  ArrowRight, Activity, AlertTriangle, CheckSquare, XSquare,
  Crown, Sparkles, Check, Settings, ChevronDown, Flame,
  RotateCcw, Navigation, Target, ChevronRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { toast, Toaster } from "sonner";
import { motion } from "motion/react";

/* ─── Types ─────────────────────────────────────────────────────── */
type Page =
  | "landing" | "login" | "register" | "dashboard" | "report"
  | "verification" | "rewards" | "leaderboard" | "analytics"
  | "profile" | "admin";

type Severity = "low" | "medium" | "high" | "critical";
type IssueStatus = "pending" | "in_progress" | "resolved" | "duplicate";

interface AppUser {
  name: string; email: string; points: number; trust_score: number;
  level: string; level_num: number; reports: number; verifications: number;
  badges: string[]; created_at: string; initials: string; isAdmin: boolean;
}

interface Issue {
  id: string; title: string; category: string; severity: Severity;
  status: IssueStatus; location: string; priority_score: number;
  reports: number; verifications: number; department: string;
  created_at: string; reporter: string; ai_summary: string;
}

/* ─── Static data ────────────────────────────────────────────────── */
const DEMO_USER: AppUser = {
  name: "Arjun Sharma", email: "arjun.sharma@civicquest.in",
  points: 2340, trust_score: 87, level: "Community Guardian", level_num: 3,
  reports: 47, verifications: 103, isAdmin: false, initials: "AS",
  badges: ["Early Adopter", "Pothole Hunter", "Verified Reporter", "Neighborhood Watch", "30-Day Streak"],
  created_at: "2024-03-15",
};

const ISSUES: Issue[] = [
  { id: "i1", title: "Deep Pothole on MG Road Near City Mall", category: "Pothole", severity: "high", status: "pending", location: "MG Road, Bengaluru – 560001", priority_score: 84, reports: 12, verifications: 8, department: "Road Department", created_at: "2024-06-20", reporter: "Priya Nair", ai_summary: "Deep pothole ~45 cm wide in a high-traffic corridor. Significant vehicle-damage and tyre-puncture risk." },
  { id: "i2", title: "Water Pipe Burst on 5th Cross", category: "Water Leakage", severity: "critical", status: "in_progress", location: "5th Cross, Indiranagar, Bengaluru", priority_score: 96, reports: 23, verifications: 19, department: "Water Board", created_at: "2024-06-19", reporter: "Rahul Mehta", ai_summary: "Major pipe burst causing road flooding. Immediate municipal intervention required." },
  { id: "i3", title: "Overflowing Garbage Bin at Park Junction", category: "Garbage Accumulation", severity: "medium", status: "pending", location: "Park Junction, Koramangala, Bengaluru", priority_score: 61, reports: 7, verifications: 5, department: "Waste Management", created_at: "2024-06-18", reporter: "Anita Reddy", ai_summary: "Municipal bin overflowing for 3+ days. Decomposing waste is a health hazard." },
  { id: "i4", title: "Street Light Out on Main Boulevard", category: "Broken Streetlight", severity: "medium", status: "resolved", location: "Main Boulevard, HSR Layout, Bengaluru", priority_score: 55, reports: 5, verifications: 4, department: "Electrical Department", created_at: "2024-06-15", reporter: "Kiran Kumar", ai_summary: "Single streetlight failure reduces night visibility in a pedestrian zone." },
  { id: "i5", title: "Blocked Drain Causing Waterlogging", category: "Drainage Issue", severity: "high", status: "pending", location: "Silk Board Junction, Bengaluru", priority_score: 79, reports: 18, verifications: 14, department: "Municipal Engineering", created_at: "2024-06-17", reporter: "Deepa Iyer", ai_summary: "Clogged storm drain causing 2 ft waterlogging and significant traffic disruption." },
  { id: "i6", title: "Damaged Bridge Railing – Hebbal Flyover", category: "Infrastructure Damage", severity: "critical", status: "in_progress", location: "Hebbal Flyover, Bengaluru – 560024", priority_score: 92, reports: 31, verifications: 27, department: "Road Department", created_at: "2024-06-16", reporter: "Suresh Babu", ai_summary: "Severe structural damage to bridge railing posing a fall risk. Flagged critical by Structural Agent." },
  { id: "i7", title: "Multiple Potholes on Outer Ring Road", category: "Pothole", severity: "high", status: "pending", location: "Outer Ring Road, Marathahalli, Bengaluru", priority_score: 76, reports: 9, verifications: 6, department: "Road Department", created_at: "2024-06-21", reporter: "Meena Pillai", ai_summary: "Cluster of 5+ potholes spanning a 200 m stretch. High vehicle density increases risk." },
  { id: "i8", title: "Sewage Overflow – Residential Street", category: "Drainage Issue", severity: "critical", status: "pending", location: "14th B Main, Jayanagar, Bengaluru", priority_score: 98, reports: 28, verifications: 22, department: "Municipal Engineering", created_at: "2024-06-22", reporter: "Vinod Rao", ai_summary: "Sewage overflow contaminating a residential area. Immediate health emergency declared." },
];

const LEADERBOARD = [
  { rank: 1, name: "Priya Nair", points: 4820, trust: 94, reports: 89, level: "Civic Hero", initials: "PN" },
  { rank: 2, name: "Rahul Mehta", points: 4150, trust: 91, reports: 76, level: "City Champion", initials: "RM" },
  { rank: 3, name: "Anita Reddy", points: 3690, trust: 89, reports: 68, level: "City Champion", initials: "AR" },
  { rank: 4, name: "Arjun Sharma", points: 2340, trust: 87, reports: 47, level: "Community Guardian", initials: "AS" },
  { rank: 5, name: "Kiran Kumar", points: 2180, trust: 85, reports: 43, level: "Community Guardian", initials: "KK" },
  { rank: 6, name: "Deepa Iyer", points: 1920, trust: 82, reports: 38, level: "Civic Contributor", initials: "DI" },
  { rank: 7, name: "Suresh Babu", points: 1650, trust: 80, reports: 34, level: "Civic Contributor", initials: "SB" },
  { rank: 8, name: "Meena Pillai", points: 1380, trust: 78, reports: 29, level: "Civic Contributor", initials: "MP" },
  { rank: 9, name: "Vinod Rao", points: 1120, trust: 75, reports: 23, level: "Community Reporter", initials: "VR" },
  { rank: 10, name: "Savita Joshi", points: 890, trust: 72, reports: 18, level: "Community Reporter", initials: "SJ" },
];

const CAT_DATA = [
  { name: "Pothole", count: 128 }, { name: "Water", count: 87 },
  { name: "Garbage", count: 65 }, { name: "Streetlight", count: 43 },
  { name: "Drainage", count: 72 }, { name: "Infrastructure", count: 38 },
];
const SEV_DATA = [
  { name: "Critical", value: 18, color: "#ef4444" },
  { name: "High", value: 34, color: "#f97316" },
  { name: "Medium", value: 89, color: "#eab308" },
  { name: "Low", value: 122, color: "#22c55e" },
];
const TREND_DATA = [
  { week: "W1 Jun", reported: 45, resolved: 32 },
  { week: "W2 Jun", reported: 52, resolved: 41 },
  { week: "W3 Jun", reported: 38, resolved: 44 },
  { week: "W4 Jun", reported: 61, resolved: 38 },
  { week: "W1 Jul", reported: 48, resolved: 52 },
];
const PREDICT_DATA = [
  { month: "Jul", potholes: 45, drainage: 28, water: 15 },
  { month: "Aug", potholes: 62, drainage: 51, water: 22 },
  { month: "Sep", potholes: 58, drainage: 68, water: 31 },
  { month: "Oct", potholes: 35, drainage: 42, water: 18 },
  { month: "Nov", potholes: 29, drainage: 31, water: 12 },
  { month: "Dec", potholes: 22, drainage: 19, water: 9 },
];

const LEVELS = [
  { name: "Community Reporter", min: 0, max: 500 },
  { name: "Civic Contributor", min: 500, max: 1500 },
  { name: "Community Guardian", min: 1500, max: 3000 },
  { name: "City Champion", min: 3000, max: 5000 },
  { name: "Civic Hero", min: 5000, max: 10000 },
];

const BADGES_ALL = [
  { id: "early", label: "Early Adopter", icon: "🚀", earned: true },
  { id: "pothole", label: "Pothole Hunter", icon: "🕳️", earned: true },
  { id: "verified", label: "Verified Reporter", icon: "✅", earned: true },
  { id: "watch", label: "Neighborhood Watch", icon: "👁️", earned: true },
  { id: "streak", label: "30-Day Streak", icon: "🔥", earned: true },
  { id: "hero", label: "Community Hero", icon: "🦸", earned: false },
  { id: "champ", label: "City Champion", icon: "🏆", earned: false },
  { id: "predict", label: "Data Prophet", icon: "🔮", earned: false },
];

const COUPONS = [
  { threshold: 10, discount: "5%", earned: true, code: "CQ-5CIVIC" },
  { threshold: 25, discount: "10%", earned: true, code: "CQ-10CIVIC" },
  { threshold: 50, discount: "15%", earned: false, code: "CQ-15CIVIC" },
  { threshold: 100, discount: "20%", earned: false, code: "CQ-20CIVIC" },
  { threshold: 250, discount: "30%", earned: false, code: "CQ-30CIVIC" },
];

/* ─── Utility helpers ───────────────────────────────────────────── */
const sevBadge = (s: Severity) =>
  ({ critical: "bg-red-500/15 text-red-400 border border-red-500/25", high: "bg-orange-500/15 text-orange-400 border border-orange-500/25", medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25", low: "bg-green-500/15 text-green-400 border border-green-500/25" })[s];

const statusBadge = (s: IssueStatus) =>
  ({ pending: "bg-yellow-500/15 text-yellow-400", in_progress: "bg-blue-500/15 text-blue-400", resolved: "bg-green-500/15 text-green-400", duplicate: "bg-gray-500/15 text-gray-400" })[s];

const catIcon = (cat: string) => {
  if (cat === "Pothole") return <Waves className="w-4 h-4" />;
  if (cat === "Water Leakage") return <Droplets className="w-4 h-4" />;
  if (cat === "Garbage Accumulation") return <Trash2 className="w-4 h-4" />;
  if (cat === "Broken Streetlight") return <Lightbulb className="w-4 h-4" />;
  if (cat === "Drainage Issue") return <Waves className="w-4 h-4" />;
  return <Building2 className="w-4 h-4" />;
};

const getLevelProgress = (pts: number) => {
  const lv = LEVELS.find(l => pts >= l.min && pts < l.max) ?? LEVELS[4];
  return Math.min(100, Math.round(((pts - lv.min) / (lv.max - lv.min)) * 100));
};

/* ─── Small shared components ───────────────────────────────────── */
function Avatar({ initials, size = "md", color = "primary" }: { initials: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" }[size];
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${color === "accent" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
      {initials}
    </div>
  );
}

function Badge({ label, variant = "default" }: { label: string; variant?: "default" | "primary" | "accent" | "warning" }) {
  const cls = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    warning: "bg-orange-500/15 text-orange-400",
  }[variant];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

function StatCard({ label, value, icon: Icon, color, delta }: { label: string; value: string | number; icon: React.ElementType; color: string; delta?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-bold font-[Outfit] mt-0.5">{value}</p>
        {delta && <p className="text-xs text-accent mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{delta}</p>}
      </div>
    </motion.div>
  );
}

function IssueRow({ issue, onView }: { issue: Issue; onView?: (id: string) => void }) {
  return (
    <tr className="border-b border-border hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => onView?.(issue.id)}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{catIcon(issue.category)}</span>
          <span className="text-sm font-medium line-clamp-1">{issue.title}</span>
        </div>
      </td>
      <td className="py-3 px-4 hidden md:table-cell">
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${sevBadge(issue.severity)}`}>{issue.severity}</span>
      </td>
      <td className="py-3 px-4 hidden lg:table-cell">
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${statusBadge(issue.status)}`}>{issue.status.replace("_", " ")}</span>
      </td>
      <td className="py-3 px-4 hidden xl:table-cell">
        <div className="flex items-center gap-1 text-sm">
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${issue.priority_score >= 80 ? "bg-red-500" : issue.priority_score >= 60 ? "bg-orange-500" : "bg-yellow-500"}`} style={{ width: `${issue.priority_score}%` }} />
          </div>
          <span className="text-muted-foreground text-xs">{issue.priority_score}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-muted-foreground text-sm hidden sm:table-cell">{issue.created_at}</td>
    </tr>
  );
}

/* ─── Navbar ────────────────────────────────────────────────────── */
function Navbar({ user, dark, onToggleDark, onNav, onLogout, sideOpen, onSideToggle }:
  { user: AppUser | null; dark: boolean; onToggleDark: () => void; onNav: (p: Page) => void; onLogout: () => void; sideOpen: boolean; onSideToggle: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/90 backdrop-blur-md border-b border-border flex items-center px-4 gap-3">
      {user && (
        <button onClick={onSideToggle} className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden">
          {sideOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}
      <button onClick={() => onNav("landing")} className="flex items-center gap-2 font-bold font-[Outfit] text-lg text-foreground hover:text-primary transition-colors">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        CivicQuest <span className="text-primary">AI</span>
      </button>

      <div className="flex-1" />

      <button onClick={onToggleDark} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {user ? (
        <>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button onClick={() => onNav("profile")} className="flex items-center gap-2 hover:bg-muted rounded-lg px-2 py-1 transition-colors">
            <Avatar initials={user.initials} size="sm" />
            <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <button onClick={() => onNav("login")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">Login</button>
          <button onClick={() => onNav("register")} className="text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">Sign Up</button>
        </div>
      )}
    </header>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────────── */
function Sidebar({ current, onNav, user, open, onClose }: { current: Page; onNav: (p: Page) => void; user: AppUser; open: boolean; onClose: () => void }) {
  const links: { page: Page; label: string; icon: React.ElementType }[] = [
    { page: "dashboard", label: "Dashboard", icon: Home },
    { page: "report", label: "Report Issue", icon: AlertCircle },
    { page: "verification", label: "Verification", icon: CheckSquare },
    { page: "rewards", label: "Rewards", icon: Award },
    { page: "leaderboard", label: "Leaderboard", icon: Trophy },
    { page: "analytics", label: "Analytics", icon: BarChart3 },
    { page: "profile", label: "Profile", icon: User },
    ...(user.isAdmin ? [{ page: "admin" as Page, label: "Admin", icon: Settings }] : []),
  ];

  const base = "fixed top-16 left-0 bottom-0 z-40 w-60 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300";
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={`${base} ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ page, label, icon: Icon }) => (
            <button key={page} onClick={() => { onNav(page); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${current === page ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {page === "report" && <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2">
            <p className="text-xs text-sidebar-foreground/60 mb-1">Trust Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-sidebar-accent rounded-full">
                <div className="h-full bg-accent rounded-full" style={{ width: `${user.trust_score}%` }} />
              </div>
              <span className="text-xs font-bold text-accent">{user.trust_score}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─── Landing Page ──────────────────────────────────────────────── */
function LandingPage({ onNav }: { onNav: (p: Page) => void }) {
  const features = [
    { icon: Brain, title: "AI-Powered Analysis", desc: "Gemini Vision identifies issue type, severity, and responsible department automatically.", color: "text-blue-400 bg-blue-500/10" },
    { icon: Shield, title: "Smart Deduplication", desc: "Detects similar nearby reports and groups them — no more duplicate complaints flooding the system.", color: "text-purple-400 bg-purple-500/10" },
    { icon: CheckSquare, title: "Community Verification", desc: "Citizens confirm, flag, or mark issues resolved, creating a crowdsourced trust layer.", color: "text-green-400 bg-green-500/10" },
    { icon: Target, title: "Priority Engine", desc: "Dynamic priority scores (0–100) based on severity, verifications, age, and trust scores.", color: "text-orange-400 bg-orange-500/10" },
    { icon: Award, title: "Rewards Program", desc: "Earn points, unlock badges, and collect discount coupons for every verified contribution.", color: "text-yellow-400 bg-yellow-500/10" },
    { icon: TrendingUp, title: "Predictive Insights", desc: "Historical AI analysis surfaces recurring hotspots and seasonal risk zones before problems escalate.", color: "text-teal-400 bg-teal-500/10" },
  ];

  const steps = [
    { num: "01", title: "Snap & Submit", desc: "Upload a photo of the issue with a brief description and your location." },
    { num: "02", title: "AI Analyzes", desc: "Gemini Vision classifies the issue, assesses severity, and routes it to the right department." },
    { num: "03", title: "Community Verifies", desc: "Neighbours confirm the report, increasing its priority score in real-time." },
    { num: "04", title: "Resolved & Rewarded", desc: "Issue gets fixed. You earn points, badges, and rewards for your contribution." },
  ];

  const floatingIssues = [
    { label: "Pothole detected", sev: "High", color: "text-orange-400", icon: "🕳️" },
    { label: "Water leakage", sev: "Critical", color: "text-red-400", icon: "💧" },
    { label: "Streetlight out", sev: "Medium", color: "text-yellow-400", icon: "💡" },
    { label: "Garbage overflow", sev: "Medium", color: "text-green-400", icon: "🗑️" },
  ];

  return (
    <div className="min-h-screen font-[Figtree]">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/6 pointer-events-none" />
        <div className="absolute top-24 right-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-8 w-48 h-48 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Google Gemini AI
            </div>
            <h1 className="text-5xl lg:text-6xl font-black font-[Outfit] leading-tight mb-6">
              Making Community<br />
              <span className="text-primary">Problem Reporting</span><br />
              Smarter with AI
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              CivicQuest AI turns every citizen into a change-maker. Report infrastructure issues, let AI route them, watch your community verify them, and get rewarded when they are fixed.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => onNav("register")} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25">
                Start Reporting Free <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => onNav("dashboard")} className="flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors">
                <Eye className="w-4 h-4" /> View Dashboard
              </button>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-border">
              {[["12,400+", "Issues Reported"], ["8,900+", "Resolved"], ["50K+", "Active Citizens"], ["94%", "AI Accuracy"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl font-black font-[Outfit] text-primary">{v}</p>
                  <p className="text-sm text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <div className="relative h-80 lg:h-auto hidden md:block">
            <div className="relative w-full h-96">
              {floatingIssues.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 + 0.3 }}
                  style={{ top: `${i * 22}%`, right: i % 2 === 0 ? "5%" : "20%" }}
                  className="absolute bg-card border border-border rounded-xl p-3 shadow-lg w-52">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Severity:</span>
                    <span className={`font-bold ${item.color}`}>{item.sev}</span>
                    <span className="ml-auto flex items-center gap-1 text-accent"><Brain className="w-3 h-3" /> AI</span>
                  </div>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
                className="absolute bottom-0 right-8 bg-card border border-accent/30 rounded-xl p-4 w-48">
                <p className="text-xs text-muted-foreground mb-1">Priority Score</p>
                <p className="text-3xl font-black font-[Outfit] text-accent">96</p>
                <p className="text-xs text-red-400 font-medium mt-1">⚡ Critical — Routed to Water Board</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black font-[Outfit] text-center mb-3">How CivicQuest Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">From spotting a problem to getting it fixed — powered by AI and community action.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 relative">
                <div className="text-5xl font-black font-[Outfit] text-muted-foreground/20 mb-3">{s.num}</div>
                <h3 className="font-bold text-base mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && <ChevronRight className="absolute -right-4 top-1/2 -translate-y-1/2 text-border w-6 h-6 hidden lg:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black font-[Outfit] text-center mb-3">Everything You Need</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Nine specialized AI agents work in concert to handle every step of the civic issue lifecycle.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary/5 border-y border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black font-[Outfit] mb-4">Your City Needs You</h2>
          <p className="text-muted-foreground text-lg mb-8">Join 50,000+ citizens already making their communities safer, cleaner, and better connected with AI.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => onNav("register")} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/30">
              Join CivicQuest — It&#39;s Free <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 text-center text-muted-foreground text-sm border-t border-border">
        © 2024 CivicQuest AI · Making cities smarter, one report at a time.
      </footer>
    </div>
  );
}

/* ─── Auth pages ────────────────────────────────────────────────── */
function LoginPage({ onNav, onLogin }: { onNav: (p: Page) => void; onLogin: (u: AppUser) => void }) {
  const [email, setEmail] = useState("arjun.sharma@civicquest.in");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (email && password) {
      onLogin(DEMO_USER);
      toast.success("Welcome back, Arjun!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 font-[Figtree]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black font-[Outfit]">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your CivicQuest account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
          <div>
            <label className="text-sm font-semibold block mb-1.5">Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1.5">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><RotateCcw className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <button type="button" onClick={() => onNav("register")} className="text-primary font-semibold hover:underline">Create one</button>
          </p>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-4">Demo credentials pre-filled — just click Sign In.</p>
      </motion.div>
    </div>
  );
}

function RegisterPage({ onNav, onLogin }: { onNav: (p: Page) => void; onLogin: (u: AppUser) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onLogin({ ...DEMO_USER, name: form.name || "New User", email: form.email || "user@civicquest.in", initials: (form.name || "NU").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() });
    toast.success("Account created! Welcome to CivicQuest.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 font-[Figtree]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black font-[Outfit]">Join CivicQuest</h1>
          <p className="text-muted-foreground mt-1">Start making a difference in your community</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-4">
          {[["Full Name", "name", "text", "Arjun Sharma"], ["Email Address", "email", "email", "you@example.com"], ["Password", "password", "password", "••••••••"], ["Confirm Password", "confirm", "password", "••••••••"]].map(([label, key, type, placeholder]) => (
            <div key={key}>
              <label className="text-sm font-semibold block mb-1.5">{label}</label>
              <input value={(form as Record<string, string>)[key]} onChange={set(key)} type={type} className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" placeholder={placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
            {loading ? <><RotateCcw className="w-4 h-4 animate-spin" /> Creating account…</> : "Create Account"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already a member?{" "}
            <button type="button" onClick={() => onNav("login")} className="text-primary font-semibold hover:underline">Sign in</button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────────── */
function DashboardPage({ onNav }: { onNav: (p: Page) => void }) {
  const stats = [
    { label: "Total Issues", value: 433, icon: AlertCircle, color: "bg-blue-500/15 text-blue-400", delta: "+24 this week" },
    { label: "Pending", value: 184, icon: Clock, color: "bg-yellow-500/15 text-yellow-400" },
    { label: "Resolved", value: 211, icon: CheckCircle2, color: "bg-green-500/15 text-green-400", delta: "+18 resolved" },
    { label: "Critical", value: 38, icon: Flame, color: "bg-red-500/15 text-red-400" },
  ];

  return (
    <div className="space-y-6 font-[Figtree]">
      <div>
        <h1 className="text-2xl font-black font-[Outfit]">Public Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Real-time overview of civic issues across Bengaluru</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Category bar chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CAT_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity pie */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold mb-4">Severity Split</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SEV_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {SEV_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {SEV_DATA.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4">Weekly Report vs. Resolution Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={TREND_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gRep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="reported" name="Reported" stroke="var(--primary)" fill="url(#gRep)" strokeWidth={2} />
            <Area type="monotone" dataKey="resolved" name="Resolved" stroke="var(--accent)" fill="url(#gRes)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent issues table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold">Recent Reports</h3>
          <button onClick={() => onNav("verification")} className="text-sm text-primary hover:underline flex items-center gap-1">View all <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left py-2.5 px-4 font-medium">Issue</th>
              <th className="text-left py-2.5 px-4 font-medium hidden md:table-cell">Severity</th>
              <th className="text-left py-2.5 px-4 font-medium hidden lg:table-cell">Status</th>
              <th className="text-left py-2.5 px-4 font-medium hidden xl:table-cell">Priority</th>
              <th className="text-left py-2.5 px-4 font-medium hidden sm:table-cell">Date</th>
            </tr></thead>
            <tbody>{ISSUES.slice(0, 6).map(issue => <IssueRow key={issue.id} issue={issue} />)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Report Issue ──────────────────────────────────────────────── */
function ReportIssuePage() {
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [stage, setStage] = useState<"form" | "analyzing" | "result">("form");
  const [aiResult, setAiResult] = useState<null | { type: string; category: string; severity: Severity; department: string; summary: string; priority: number; duplicate: boolean }>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasImage) { toast.error("Please upload an image of the issue"); return; }
    if (!desc.trim()) { toast.error("Please describe the issue"); return; }
    setStage("analyzing");
    await new Promise(r => setTimeout(r, 2800));
    setAiResult({
      type: "Pothole", category: "Road Infrastructure", severity: "high",
      department: "Road Department – BBMP Zone 5",
      summary: "Gemini Vision detected a large road depression approximately 50 cm × 40 cm with an estimated depth of 8 cm. The surrounding area shows signs of water pooling, suggesting subsurface erosion. Classified as High severity based on traffic density (arterial road) and pedestrian proximity. No exact duplicate found within 200 m. Authority routed to BBMP Road Department.",
      priority: 81, duplicate: false,
    });
    setStage("result");
  };

  const handleReset = () => { setStage("form"); setAiResult(null); setHasImage(false); setDesc(""); setLocation(""); };

  const sevColor = (s: Severity) => ({ critical: "text-red-400", high: "text-orange-400", medium: "text-yellow-400", low: "text-green-400" })[s];

  return (
    <div className="max-w-2xl font-[Figtree]">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-[Outfit]">Report an Issue</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Upload a photo, describe the problem, and let AI do the rest.</p>
      </div>

      {stage === "form" && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="text-sm font-semibold block mb-3">Issue Photo *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition-colors ${hasImage ? "border-accent/50 bg-accent/5" : "border-border hover:border-primary/50 hover:bg-primary/3"}`}>
              {hasImage ? (
                <div className="text-center">
                  <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium text-accent">Photo attached</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Click to upload photo</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, HEIC up to 10 MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.length) setHasImage(true); }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5">Description *</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe the issue in detail — size, duration, how it affects the area…" className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5"><MapPin className="inline w-4 h-4 mr-1" />Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} type="text" placeholder="e.g., MG Road near City Mall, Bengaluru" className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" />
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors">
            <Brain className="w-5 h-5" /> Analyze with AI & Submit
          </button>
        </motion.form>
      )}

      {stage === "analyzing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-bold font-[Outfit] mb-2">AI Agents at Work</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">Gemini Vision is analyzing your image. Classification, severity assessment, and duplicate detection in progress…</p>
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {["Vision Agent: Processing image…", "Classification Agent: Identifying type…", "Severity Agent: Assessing risk…", "Duplicate Detection: Scanning nearby reports…"].map((label, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin flex-shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                <span className="text-muted-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {stage === "result" && aiResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-card border border-accent/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center"><Brain className="w-5 h-5 text-accent" /></div>
              <div>
                <h3 className="font-bold">AI Analysis Complete</h3>
                <p className="text-xs text-muted-foreground">Powered by Google Gemini 2.5 Flash</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs bg-green-500/15 text-green-400 px-3 py-1 rounded-full font-medium">
                <Check className="w-3.5 h-3.5" /> Submitted
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[["Issue Type", aiResult.type], ["Category", aiResult.category], ["Department", aiResult.department], ["Duplicate", aiResult.duplicate ? "Yes — linked" : "No — new report"]].map(([k, v]) => (
                <div key={k} className="bg-muted/60 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{k}</p>
                  <p className="text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Severity</p>
                <p className={`text-sm font-bold capitalize ${sevColor(aiResult.severity)}`}>{aiResult.severity}</p>
              </div>
              <div className="bg-muted/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Priority Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${aiResult.priority}%` }} />
                  </div>
                  <span className="text-sm font-bold text-orange-400">{aiResult.priority}</span>
                </div>
              </div>
            </div>
            <div className="bg-primary/8 border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1 font-semibold">AI Summary</p>
              <p className="text-sm leading-relaxed">{aiResult.summary}</p>
            </div>
          </div>
          <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-xl font-semibold hover:bg-muted transition-colors">
            <RotateCcw className="w-4 h-4" /> Report Another Issue
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Community Verification ────────────────────────────────────── */
function VerificationPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [verified, setVerified] = useState<Set<string>>(new Set());
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  const filtered = ISSUES.filter(i => filter === "all" ? true : filter === "pending" ? i.status === "pending" : i.status === "resolved");

  const doVerify = (id: string) => { setVerified(s => new Set([...s, id])); toast.success("Issue verified — +5 points earned!"); };
  const doResolve = (id: string) => { setResolved(s => new Set([...s, id])); toast.success("Marked as resolved — +10 points!"); };
  const doFlag = (id: string) => { setFlagged(s => new Set([...s, id])); toast.info("Report flagged for review."); };

  return (
    <div className="font-[Figtree]">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-[Outfit]">Community Verification</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Help verify, resolve, or flag reports to keep the data accurate.</p>
      </div>

      <div className="flex items-center gap-2 mb-5">
        {(["all", "pending", "resolved"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{f}</button>
        ))}
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} issues</span>
      </div>

      <div className="space-y-4">
        {filtered.map(issue => {
          const isVer = verified.has(issue.id);
          const isRes = resolved.has(issue.id);
          const isFlag = flagged.has(issue.id);
          return (
            <motion.div key={issue.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground mt-0.5">{catIcon(issue.category)}</div>
                  <div>
                    <h3 className="font-semibold text-sm">{issue.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{issue.location}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium flex-shrink-0 ${sevBadge(issue.severity)}`}>{issue.severity}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{issue.ai_summary}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Eye className="w-3.5 h-3.5" />{issue.verifications} verified
                <span className="mx-1">·</span>
                <Activity className="w-3.5 h-3.5" />{issue.reports} reports
                <span className="mx-1">·</span>
                <Building2 className="w-3.5 h-3.5" />{issue.department}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => doVerify(issue.id)} disabled={isVer || isRes} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isVer ? "bg-green-500/15 text-green-400" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"} disabled:opacity-50`}>
                  <CheckSquare className="w-3.5 h-3.5" />{isVer ? "Verified" : "Verify Exists"}
                </button>
                <button onClick={() => doResolve(issue.id)} disabled={isRes} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isRes ? "bg-blue-500/15 text-blue-400" : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"} disabled:opacity-50`}>
                  <Check className="w-3.5 h-3.5" />{isRes ? "Marked Resolved" : "Mark Resolved"}
                </button>
                <button onClick={() => doFlag(issue.id)} disabled={isFlag} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isFlag ? "bg-red-500/15 text-red-400" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"} disabled:opacity-50`}>
                  <XSquare className="w-3.5 h-3.5" />{isFlag ? "Flagged" : "Flag False"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Rewards ───────────────────────────────────────────────────── */
function RewardsPage({ user }: { user: AppUser }) {
  const progress = getLevelProgress(user.points);
  const currentLv = LEVELS.find(l => user.points >= l.min && user.points < l.max) ?? LEVELS[4];
  const nextLv = LEVELS[LEVELS.indexOf(currentLv) + 1];

  return (
    <div className="font-[Figtree] space-y-6">
      <div>
        <h1 className="text-2xl font-black font-[Outfit]">Rewards</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Earn points by contributing to your community.</p>
      </div>

      {/* Level card */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <h2 className="text-2xl font-black font-[Outfit] text-primary">{user.level}</h2>
            <p className="text-sm text-muted-foreground">{user.points.toLocaleString()} points</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-black font-[Outfit]">{user.trust_score}</p>
            <p className="text-xs text-muted-foreground">Trust Score</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{currentLv.name}</span>
            {nextLv && <span>{nextLv.name} ({(nextLv.min - user.points).toLocaleString()} pts away)</span>}
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">{currentLv.min.toLocaleString()}</span>
            <span className="font-bold text-primary">{progress}%</span>
            <span className="text-muted-foreground">{currentLv.max.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Level roadmap */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4">Level Roadmap</h3>
        <div className="space-y-3">
          {LEVELS.map(lv => {
            const done = user.points >= lv.max;
            const active = user.level === lv.name;
            return (
              <div key={lv.name} className={`flex items-center gap-3 p-3 rounded-lg ${active ? "bg-primary/10 border border-primary/20" : "bg-muted/40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-accent text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {done ? <Check className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${active ? "text-primary" : ""}`}>{lv.name}</p>
                  <p className="text-xs text-muted-foreground">{lv.min.toLocaleString()} – {lv.max.toLocaleString()} points</p>
                </div>
                {active && <Badge label="Current" variant="primary" />}
                {done && <Badge label="Completed" variant="accent" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4">Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES_ALL.map(badge => (
            <div key={badge.id} className={`p-4 rounded-xl text-center border transition-colors ${badge.earned ? "bg-primary/8 border-primary/20" : "bg-muted/40 border-border opacity-50"}`}>
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-xs font-semibold">{badge.label}</p>
              {!badge.earned && <p className="text-xs text-muted-foreground mt-1">Locked</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Coupons */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4">Discount Coupons</h3>
        <div className="space-y-3">
          {COUPONS.map(c => (
            <div key={c.code} className={`flex items-center gap-4 p-4 rounded-xl border ${c.earned ? "bg-accent/8 border-accent/25" : "bg-muted/30 border-border opacity-60"}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black font-[Outfit] text-lg flex-shrink-0 ${c.earned ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>{c.discount}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.discount} Reward Coupon</p>
                <p className="text-xs text-muted-foreground">{c.threshold} verified reports required</p>
                {c.earned && <p className="text-xs font-mono text-accent mt-1">{c.code}</p>}
              </div>
              {c.earned ? <Badge label="Earned" variant="accent" /> : <Badge label="Locked" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Leaderboard ───────────────────────────────────────────────── */
function LeaderboardPage({ user }: { user: AppUser }) {
  const [period, setPeriod] = useState<"week" | "month" | "all">("all");
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="font-[Figtree]">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-[Outfit]">Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Top contributors making their communities better.</p>
      </div>

      <div className="flex gap-2 mb-5">
        {(["week", "month", "all"] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${period === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((u, idx) => {
          const isFirst = idx === 1;
          return (
            <motion.div key={u.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className={`${isFirst ? "bg-primary/15 border-primary/30" : "bg-card border-border"} border rounded-xl p-4 text-center ${isFirst ? "ring-2 ring-primary/20" : ""}`}>
              <div className="text-2xl mb-2">{medals[u.rank - 1]}</div>
              <Avatar initials={u.initials} size="md" color={isFirst ? "primary" : "default"} />
              <p className={`text-xs font-bold mt-2 ${isFirst ? "text-primary" : ""}`}>{u.name.split(" ")[0]}</p>
              <p className="text-lg font-black font-[Outfit]">{u.points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">pts</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="text-xs text-muted-foreground border-b border-border">
            <th className="text-left py-3 px-4 font-medium">#</th>
            <th className="text-left py-3 px-4 font-medium">Citizen</th>
            <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Level</th>
            <th className="text-right py-3 px-4 font-medium">Points</th>
            <th className="text-right py-3 px-4 font-medium hidden md:table-cell">Trust</th>
            <th className="text-right py-3 px-4 font-medium hidden lg:table-cell">Reports</th>
          </tr></thead>
          <tbody>
            {LEADERBOARD.map((u, i) => {
              const isMe = u.name === user.name;
              return (
                <tr key={u.rank} className={`border-b border-border transition-colors ${isMe ? "bg-primary/8" : "hover:bg-muted/40"}`}>
                  <td className="py-3 px-4 text-sm font-bold">{u.rank <= 3 ? medals[u.rank - 1] : u.rank}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar initials={u.initials} size="sm" color={isMe ? "primary" : "default"} />
                      <div>
                        <p className={`text-sm font-semibold ${isMe ? "text-primary" : ""}`}>{u.name}{isMe && " (You)"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell"><Badge label={u.level} variant={isMe ? "primary" : "default"} /></td>
                  <td className="py-3 px-4 text-right font-bold text-sm">{u.points.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-sm hidden md:table-cell">
                    <span className="text-accent font-semibold">{u.trust}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground hidden lg:table-cell">{u.reports}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Analytics / Predictive Insights ──────────────────────────── */
function AnalyticsPage() {
  const hotspots = [
    { zone: "Silk Board Junction", risk: 94, issues: 38, type: "Drainage / Pothole" },
    { zone: "Hebbal Flyover", risk: 89, issues: 31, type: "Infrastructure" },
    { zone: "MG Road Corridor", risk: 76, issues: 24, type: "Pothole / Streetlight" },
    { zone: "Koramangala 5th Block", risk: 68, issues: 19, type: "Garbage / Drainage" },
    { zone: "Indiranagar 100ft Road", risk: 61, issues: 16, type: "Water Leakage" },
  ];

  const seasonal = [
    { season: "Monsoon (Jun–Sep)", trend: "Drainage & flooding issues spike 3× average", icon: "🌧️", severity: "critical" },
    { season: "Summer (Mar–May)", trend: "Water leakages increase 2× due to heat-stress on pipes", icon: "☀️", severity: "high" },
    { season: "Winter (Dec–Feb)", trend: "Pothole formation peaks due to temperature cycling", icon: "🌫️", severity: "medium" },
  ];

  return (
    <div className="font-[Figtree] space-y-6">
      <div>
        <h1 className="text-2xl font-black font-[Outfit]">Predictive Insights</h1>
        <p className="text-muted-foreground text-sm mt-0.5">AI-driven analysis of historical data to anticipate future infrastructure issues.</p>
      </div>

      {/* Forecast area chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-1">6-Month Issue Forecast</h3>
        <p className="text-xs text-muted-foreground mb-4">Predicted issue counts by category based on historical patterns and seasonal models.</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={PREDICT_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gPot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gDra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gWat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="potholes" name="Potholes" stroke="#f97316" fill="url(#gPot)" strokeWidth={2} />
            <Area type="monotone" dataKey="drainage" name="Drainage" stroke="#818cf8" fill="url(#gDra)" strokeWidth={2} />
            <Area type="monotone" dataKey="water" name="Water" stroke="#38bdf8" fill="url(#gWat)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Risk hotspots */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Navigation className="w-4 h-4 text-red-400" />High-Risk Hotspots</h3>
        <div className="space-y-3">
          {hotspots.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4 p-3 bg-muted/40 rounded-lg">
              <div className="text-sm font-bold text-muted-foreground w-5">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{h.zone}</p>
                <p className="text-xs text-muted-foreground">{h.type} · {h.issues} historical issues</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${h.risk >= 85 ? "bg-red-500" : h.risk >= 70 ? "bg-orange-500" : "bg-yellow-500"}`} style={{ width: `${h.risk}%` }} />
                  </div>
                  <span className={`text-sm font-bold ${h.risk >= 85 ? "text-red-400" : h.risk >= 70 ? "text-orange-400" : "text-yellow-400"}`}>{h.risk}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Seasonal insights */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4">Seasonal Trend Analysis</h3>
        <div className="space-y-3">
          {seasonal.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-muted/40 rounded-xl">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold">{s.season}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.trend}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${sevBadge(s.severity as Severity)}`}>{s.severity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Avg. Resolution Time", value: "4.2 days", sub: "↓ 18% vs last month", icon: Clock, color: "bg-blue-500/15 text-blue-400" },
          { label: "Prediction Accuracy", value: "91.4%", sub: "Verified by outcome data", icon: Target, color: "bg-accent/15 text-accent" },
          { label: "Proactive Fixes", value: "127", sub: "Issues pre-empted this quarter", icon: Zap, color: "bg-yellow-500/15 text-yellow-400" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>
    </div>
  );
}

/* ─── Profile ───────────────────────────────────────────────────── */
function ProfilePage({ user }: { user: AppUser }) {
  const progress = getLevelProgress(user.points);
  const activity = [
    { action: "Reported: Pothole on MG Road", pts: "+10", date: "Jun 22", type: "report" },
    { action: "Verified: Sewage overflow – Jayanagar", pts: "+5", date: "Jun 21", type: "verify" },
    { action: "Verified: Bridge railing damage", pts: "+5", date: "Jun 20", type: "verify" },
    { action: "Reported: Water pipe burst – 5th Cross", pts: "+10", date: "Jun 19", type: "report" },
    { action: "Marked resolved: Streetlight – HSR", pts: "+15", date: "Jun 15", type: "resolve" },
    { action: "Earned badge: 30-Day Streak", pts: "+50", date: "Jun 10", type: "badge" },
  ];

  return (
    <div className="font-[Figtree] max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black font-[Outfit]">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Your civic contribution record.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-black font-[Outfit] text-primary flex-shrink-0">{user.initials}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black font-[Outfit]">{user.name}</h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge label={user.level} variant="primary" />
            <Badge label={`Trust: ${user.trust_score}`} variant="accent" />
            <Badge label={`Member since ${user.created_at}`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Reports", value: user.reports, icon: AlertCircle, color: "text-blue-400" },
          { label: "Verifications", value: user.verifications, icon: CheckSquare, color: "text-green-400" },
          { label: "Points", value: user.points.toLocaleString(), icon: Star, color: "text-yellow-400" },
          { label: "Trust Score", value: user.trust_score, icon: Shield, color: "text-accent" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <p className="text-xl font-black font-[Outfit]">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold">{user.level} Progress</p>
          <p className="text-sm font-bold text-primary">{progress}%</p>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-primary to-accent rounded-full" />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">660 more points to reach City Champion</p>
      </div>

      {/* Badges */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-3">Badges Earned</h3>
        <div className="flex flex-wrap gap-2">
          {user.badges.map(b => {
            const badge = BADGES_ALL.find(x => x.label === b);
            return (
              <div key={b} className="flex items-center gap-1.5 bg-primary/8 border border-primary/20 rounded-full px-3 py-1.5 text-xs font-semibold">
                <span>{badge?.icon ?? "🏅"}</span> {b}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4">Activity History</h3>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.type === "report" ? "bg-blue-500/15 text-blue-400" : a.type === "verify" ? "bg-green-500/15 text-green-400" : a.type === "resolve" ? "bg-accent/15 text-accent" : "bg-yellow-500/15 text-yellow-400"}`}>
                {a.type === "report" ? <AlertCircle className="w-4 h-4" /> : a.type === "verify" ? <CheckSquare className="w-4 h-4" /> : a.type === "resolve" ? <Check className="w-4 h-4" /> : <Award className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.date}</p>
              </div>
              <span className="text-xs font-bold text-accent">{a.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard ───────────────────────────────────────────── */
function AdminPage({ onNav }: { onNav: (p: Page) => void }) {
  const [issues, setIssues] = useState(ISSUES);
  const [tab, setTab] = useState<"issues" | "users">("issues");

  const changeStatus = (id: string, status: IssueStatus) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    toast.success(`Status updated to "${status.replace("_", " ")}"`);
  };
  const deleteIssue = (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
    toast.info("Report removed.");
  };

  return (
    <div className="font-[Figtree]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-[Outfit]">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage reports, users, and platform health.</p>
        </div>
        <div className="flex items-center gap-2 bg-red-500/15 text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium">
          <Shield className="w-4 h-4" /> Admin Mode
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Issues", value: issues.length, icon: AlertCircle, color: "bg-blue-500/15 text-blue-400" },
          { label: "Pending", value: issues.filter(i => i.status === "pending").length, icon: Clock, color: "bg-yellow-500/15 text-yellow-400" },
          { label: "In Progress", value: issues.filter(i => i.status === "in_progress").length, icon: Activity, color: "bg-primary/15 text-primary" },
          { label: "Resolved", value: issues.filter(i => i.status === "resolved").length, icon: CheckCircle2, color: "bg-green-500/15 text-green-400" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(["issues", "users"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {tab === "issues" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs text-muted-foreground border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium">Issue</th>
                <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Severity</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Status</th>
                <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Department</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium line-clamp-1">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{issue.reporter}</p>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${sevBadge(issue.severity)}`}>{issue.severity}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <select value={issue.status} onChange={e => changeStatus(issue.id, e.target.value as IssueStatus)}
                        className="text-xs bg-muted border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40 capitalize">
                        {["pending", "in_progress", "resolved", "duplicate"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground hidden lg:table-cell">{issue.department}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => deleteIssue(issue.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs text-muted-foreground border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium">User</th>
                <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Level</th>
                <th className="text-right py-3 px-4 font-medium hidden md:table-cell">Points</th>
                <th className="text-right py-3 px-4 font-medium hidden lg:table-cell">Trust</th>
                <th className="text-right py-3 px-4 font-medium">Reports</th>
              </tr></thead>
              <tbody>
                {LEADERBOARD.map(u => (
                  <tr key={u.rank} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar initials={u.initials} size="sm" />
                        <span className="text-sm font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell"><Badge label={u.level} variant="default" /></td>
                    <td className="py-3 px-4 text-right text-sm font-bold hidden md:table-cell">{u.points.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm text-accent font-bold hidden lg:table-cell">{u.trust}</td>
                    <td className="py-3 px-4 text-right text-sm text-muted-foreground">{u.reports}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── App shell ─────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [user, setUser] = useState<AppUser | null>(null);
  const [dark, setDark] = useState(true);
  const [sideOpen, setSideOpen] = useState(false);

  const navigate = (p: Page) => {
    if (["dashboard", "report", "verification", "rewards", "leaderboard", "analytics", "profile", "admin"].includes(p) && !user) {
      setPage("login");
      return;
    }
    setPage(p);
    setSideOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (u: AppUser) => { setUser(u); setPage("dashboard"); };
  const handleLogout = () => { setUser(null); setPage("landing"); toast.info("Logged out."); };
  const toggleDark = () => setDark(d => !d);

  const isAuth = user !== null;
  const isPublic = page === "landing" || page === "login" || page === "register";

  return (
    <div className={`${dark ? "dark" : ""} font-[Figtree]`}>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster position="top-right" richColors />

        <Navbar
          user={user}
          dark={dark}
          onToggleDark={toggleDark}
          onNav={navigate}
          onLogout={handleLogout}
          sideOpen={sideOpen}
          onSideToggle={() => setSideOpen(o => !o)}
        />

        {isAuth && (
          <Sidebar
            current={page}
            onNav={navigate}
            user={user}
            open={sideOpen}
            onClose={() => setSideOpen(false)}
          />
        )}

        <main className={`pt-16 ${isAuth ? "lg:pl-60" : ""}`}>
          {isPublic ? (
            <>
              {page === "landing" && <LandingPage onNav={navigate} />}
              {page === "login" && <LoginPage onNav={navigate} onLogin={handleLogin} />}
              {page === "register" && <RegisterPage onNav={navigate} onLogin={handleLogin} />}
            </>
          ) : (
            <div className="p-5 md:p-8">
              {page === "dashboard" && <DashboardPage onNav={navigate} />}
              {page === "report" && <ReportIssuePage />}
              {page === "verification" && <VerificationPage />}
              {page === "rewards" && user && <RewardsPage user={user} />}
              {page === "leaderboard" && user && <LeaderboardPage user={user} />}
              {page === "analytics" && <AnalyticsPage />}
              {page === "profile" && user && <ProfilePage user={user} />}
              {page === "admin" && <AdminPage onNav={navigate} />}
            </div>
          )}
        </main>

        {/* Logout button for mobile */}
        {isAuth && (
          <button onClick={handleLogout}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-card border border-border shadow-lg rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors lg:hidden">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        )}
      </div>
    </div>
  );
}
