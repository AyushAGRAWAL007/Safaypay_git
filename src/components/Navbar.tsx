import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserCheck,
  Brain,
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  Shield as ShieldIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Full Navbar.tsx — Option B (neon SP, increased intensity)
 * - Logo: SP outline-only, saturated blue→green→purple stroke
 * - Aura: intense, animated (no white)
 * - Navbar shadow: Google-style neutral shadow
 * - Uploaded aurora image available at: /mnt/data/images.png
 */

const AURORA_URL = "/mnt/data/images.png"; // your uploaded image (optional background)

/* ---------- SP Logo (saturated blue/green/purple) ---------- */
const SafayPayLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg
    className={className}
    viewBox="0 0 120 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <defs>
      {/* Intense gradient: green -> blue -> purple */}
      <linearGradient id="spGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />   {/* bright green */}
        <stop offset="45%" stopColor="#0EA5E9" />  {/* vivid blue/cyan */}
        <stop offset="100%" stopColor="#7C3AED" /> {/* purple */}
      </linearGradient>

      {/* complementary inner gradient for vertical stroke */}
      <linearGradient id="spInner" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>

      {/* strong outer blur for the aura */}
      <filter id="outerAura" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="18" result="blurOuter" />
        <feMerge>
          <feMergeNode in="blurOuter" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* inner subtle blur */}
      <filter id="innerAura" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="8" result="blurInner" />
        <feMerge>
          <feMergeNode in="blurInner" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* outer blurred aura rectangle (intense but clipped) */}
    <rect x="0" y="0" width="120" height="80" rx="14" fill="url(#spGrad)" opacity="0.18" filter="url(#outerAura)" />

    {/* crisp internal rounded area for subtle contrast (no white) */}
    <rect x="6" y="6" width="108" height="68" rx="12" fill="none" stroke="rgba(5,10,20,0.05)" />

    {/* S stroke — stronger width for presence */}
    <path
      d="M20 28
         C20 18, 38 16, 44 16
         C56 16, 60 26, 48 30
         C38 33, 30 36, 30 46
         C30 56, 44 60, 54 60"
      fill="none"
      stroke="url(#spGrad)"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* vertical connector (thin) */}
    <path d="M60 16 L60 64" stroke="url(#spInner)" strokeWidth="2" strokeLinecap="round" />

    {/* P bowl */}
    <path
      d="M76 22
         C86 22, 92 28, 92 36
         C92 44, 86 50, 76 50
         L76 22"
      fill="none"
      stroke="url(#spGrad)"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* inner dark micro-stroke to increase edge definition (no white) */}
    <path
      d="M20 28
         C20 18, 38 16, 44 16
         C56 16, 60 26, 48 30
         C38 33, 30 36, 30 46
         C30 56, 44 60, 54 60
         M76 22
         C86 22, 92 28, 92 36
         C92 44, 86 50, 76 50"
      fill="none"
      stroke="rgba(3,7,18,0.36)"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

/* ---------- Navbar component ---------- */
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t)) setIsSolutionsOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(t)) setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const userData = {
    name: "John Doe",
    email: "john@example.com",
    securityLevel: "High",
    limit: "₹5,000",
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Security", path: "/security" },
    { name: "Enterprise", path: "/enterprise" },
  ];

  const solutionItems = [
    { name: "AI Verification", description: "Human verification for high-value transactions", icon: UserCheck, path: "/ai-verification" },
    { name: "Smart Limits", description: "Custom transaction thresholds", icon: ShieldIcon, path: "/smart-limits" },
    { name: "Agentic AI", description: "Intelligent monitoring system", icon: Brain, path: "/agentic-ai" },
  ];

  const userMenuItems = [
    { name: "Dashboard", icon: User, path: "/dashboard" },
    { name: "Security Settings", icon: Settings, path: "/security-settings" },
    { name: "Transaction History", icon: Brain, path: "/transactions" },
  ];

  const clearNotifications = () => setUnreadNotifications(0);
  const handleLogout = () => {
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* small inline CSS for stronger aura animation and options to use the uploaded aurora image */}
      <style>{`
        @keyframes intenseAura {
          0% { transform: translateY(0) scale(1); opacity: 0.85; filter: blur(14px); }
          50% { transform: translateY(-8px) scale(1.03); opacity: 1; filter: blur(20px); }
          100% { transform: translateY(0) scale(1); opacity: 0.85; filter: blur(14px); }
        }
        .aurora-overlay {
          mix-blend-mode: screen;
          pointer-events: none;
        }
      `}</style>

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background/92 backdrop-blur-xl border-b border-border/20",
          // Google-style clean shadow
          "shadow-[0_1px_2px_rgba(0,0,0,0.20),0_2px_8px_rgba(0,0,0,0.12)]",
          isScrolled && "backdrop-saturate-110"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* trust bar (kept colors) */}
        <div className="w-full bg-gradient-to-r from-blue-700 via-emerald-600 to-blue-800 py-2 px-4">
          <div className="container mx-auto flex items-center justify-between text-sm font-medium text-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldIcon className="h-4 w-4 text-slate-200" />
                <span>AI-Powered UPI Security</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative h-8 w-8 text-slate-200 hover:bg-white/3" onClick={clearNotifications}>
                  <Bell className="h-4 w-4 text-slate-200" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[rgba(10,20,40,0.4)] text-[10px] flex items-center justify-center text-black">
                      {unreadNotifications}
                    </div>
                  )}
                </Button>
              </div>

              <div ref={userMenuRef} className="relative">
                <Button variant="ghost" className="flex items-center gap-2 text-slate-200 hover:bg-white/3 h-8" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-emerald-400 rounded-full flex items-center justify-center text-slate-200">
                    <User className="h-3 w-3 text-slate-200" />
                  </div>
                  <span className="text-sm">Account</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", isUserMenuOpen && "rotate-180")} />
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-background/95 backdrop-blur-xl rounded-xl border border-border shadow-2xl p-4">
                    <div className="flex items-center gap-3 p-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-slate-200">
                        <User className="h-5 w-5 text-slate-200" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{userData.name}</div>
                        <div className="text-sm text-muted-foreground">{userData.email}</div>
                      </div>
                    </div>

                    <div className="bg-[rgba(37,99,235,0.06)] rounded-lg p-3 mb-3 border border-[rgba(37,99,235,0.06)]">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Security Level</span>
                        <span className="font-semibold text-emerald-400">{userData.securityLevel}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-muted-foreground">Transaction Limit</span>
                        <span className="font-semibold text-blue-400">{userData.limit}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-foreground"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-border mt-3 pt-3">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive text-sm">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* main nav area */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-4 group relative"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSolutionsOpen(false);
              }}
            >
              <div className="relative">
                {/* intense animated aurora behind the logo (only blue/green/purple) */}
                <div
                  aria-hidden
                  className="absolute -inset-4 aurora-overlay"
                  style={{
                    animation: "intenseAura 4.8s ease-in-out infinite",
                    background: "linear-gradient(90deg, rgba(16,185,129,0.22), rgba(14,165,233,0.20), rgba(124,58,237,0.20))",
                    filter: "blur(18px)",
                    transformOrigin: "center",
                    borderRadius: "12px",
                    pointerEvents: "none",
                  }}
                />

                {/* the SP mark elevated by layered drop-shadows (no white) */}
                <div
                  style={{
                    filter:
                      "drop-shadow(0 0 36px rgba(14,165,233,0.28)) drop-shadow(0 0 28px rgba(16,185,129,0.22)) drop-shadow(0 10px 30px rgba(124,58,237,0.12))",
                    transition: "transform 280ms cubic-bezier(.2,.9,.3,1)",
                  }}
                  className="relative"
                >
                  <SafayPayLogo className="h-14 w-14" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-emerald-400 to-purple-700 bg-clip-text text-transparent">
                  SafayPay
                </span>
                <span className="text-xs font-semibold text-muted-foreground -mt-1 tracking-wider">TRUST • INTELLIGENCE • VERIFICATION</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <div ref={dropdownRef} className="relative" onMouseEnter={() => setIsSolutionsOpen(true)} onMouseLeave={() => setIsSolutionsOpen(false)}>
                <button className="flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition-all duration-300 py-2 group">
                  <Brain className="h-4 w-4 text-emerald-400" />
                  Solutions
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isSolutionsOpen && "rotate-180")} />
                </button>

                {isSolutionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-background/95 backdrop-blur-xl rounded-2xl border border-emerald-200/20 shadow-2xl p-6">
                    <div className="space-y-4">
                      {solutionItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-emerald-500/10 transition-all duration-300 group border border-transparent hover:border-emerald-200/30 hover:shadow-lg"
                          onClick={() => setIsSolutionsOpen(false)}
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 group-hover:from-blue-600 group-hover:to-emerald-600 transition-all duration-300 shadow-md">
                            <item.icon className="h-5 w-5 text-slate-200" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-foreground group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                              {item.name}
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-xs text-emerald-400 font-normal">Active</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 relative py-2 group",
                    location.pathname === item.path ? "text-emerald-400" : "text-foreground/70 hover:text-foreground"
                  )}
                  onClick={() => setIsSolutionsOpen(false)}
                >
                  {item.name}
                  {location.pathname === item.path ? (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full shadow-lg shadow-[rgba(30,64,175,0.25)]" />
                  ) : (
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-300 group-hover:w-full group-hover:shadow-lg group-hover:shadow-[rgba(52,211,153,0.2)]" />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" className="font-semibold hover:bg-accent hover:text-foreground transition-all duration-300 border border-transparent hover:border-blue-500/30">
                  <ShieldIcon className="h-4 w-4 mr-2 text-slate-200" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-lg border border-blue-500/20">
                  <UserCheck className="h-4 w-4 mr-2 text-slate-200" />
                  Activate AI Protection
                </Button>
              </Link>
            </div>

            <button
              className="lg:hidden p-2 rounded-xl hover:bg-accent transition-all duration-300 border border-transparent hover:border-blue-500/30"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-200" /> : <Menu className="h-6 w-6 text-slate-200" />}
            </button>
          </div>

          {/* mobile menu (unchanged logic) */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-emerald-200/20 mt-4 pt-6 pb-8 animate-in slide-in-from-top-5 bg-gradient-to-b from-background to-blue-500/5 rounded-2xl mt-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 mx-2 bg-accent rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-slate-200">
                    <User className="h-6 w-6 text-slate-200" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{userData.name}</div>
                    <div className="text-sm text-muted-foreground">Security: {userData.securityLevel}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearNotifications} className="relative">
                    <Bell className="h-5 w-5 text-slate-200" />
                    {unreadNotifications > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
                  </Button>
                </div>

                <div className="font-bold text-foreground/70 text-sm px-4 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-emerald-400" />
                  AI SOLUTIONS
                </div>

                {solutionItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-start gap-3 p-4 mx-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-emerald-500/10 transition-all duration-300 border border-transparent hover:border-emerald-200/30"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 shadow-md">
                      <item.icon className="h-5 w-5 text-slate-200" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                    </div>
                  </Link>
                ))}

                <div className="border-t border-emerald-200/20 pt-6 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "block py-4 px-4 font-semibold transition-all duration-300 border-l-4 mx-2 rounded-r-lg",
                        location.pathname === item.path ? "text-emerald-400 border-emerald-400 bg-emerald-500/10" : "text-foreground/70 border-transparent hover:text-foreground hover:border-blue-400 hover:bg-blue-500/10"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-emerald-200/20 pt-6">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="flex items-center gap-3 py-4 px-4 text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors mx-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-emerald-200/20 px-4">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-semibold border-blue-500/30 hover:bg-accent hover:text-foreground">
                      <ShieldIcon className="h-4 w-4 mr-2 text-slate-200" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/auth?tab=signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 font-semibold shadow-lg">
                      <UserCheck className="h-4 w-4 mr-2 text-slate-200" />
                      Start Protection
                    </Button>
                  </Link>
                  <button onClick={handleLogout} className="w-full py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
