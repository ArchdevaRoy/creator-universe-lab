import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Dna,
  Film,
  PenTool,
  Repeat,
  Calendar,
  BarChart3,
  Settings,
  Crown,
  Menu,
  X,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Creator Blueprint", icon: Dna, path: "/blueprint" },
  { label: "Series Builder", icon: Film, path: "/series" },
  { label: "Script Studio", icon: PenTool, path: "/script" },
  { label: "Repurpose Lab", icon: Repeat, path: "/repurpose" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Hook Analyzer", icon: BarChart3, path: "/analyzer" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Creator Feed", icon: Radio, path: "/feed" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-display text-xs font-bold">D</span>
          </div>
          {!collapsed && (
            <span className="font-display text-sm font-bold tracking-tight text-foreground">
              D'ARC
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-sm hover:bg-accent text-muted-foreground transition-colors"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={() => {
              const isActive = location.pathname === item.path;
              return `flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all duration-150 ${
                isActive
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`;
            }}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-border space-y-0.5">
        {/* Upgrade CTA */}
        {!collapsed && (
          <NavLink
            to="/pricing"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
          >
            <Crown className="w-4 h-4 shrink-0" />
            <span>Upgrade to Pro</span>
          </NavLink>
        )}
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={() => {
              const isActive = location.pathname === item.path;
              return `flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all duration-150 ${
                isActive
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`;
            }}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 flex items-center justify-center rounded-sm bg-card border border-border text-foreground"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 z-50 w-[260px] h-full bg-sidebar border-r border-border"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-sm hover:bg-accent text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 h-screen bg-sidebar border-r border-border transition-all duration-200 ${
          collapsed ? "w-[56px]" : "w-[220px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
