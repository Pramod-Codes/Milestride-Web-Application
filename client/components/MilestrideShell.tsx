import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BarChart3, BatteryCharging, Bell, BellRing, Bike, Building2, ChevronDown, CircleHelp, Fence, LayoutDashboard, LineChart, LogOut, Menu, Moon, Navigation, PanelLeftClose, PanelLeftOpen, Settings, Sun, Wrench, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fleetOptions, navItems, type FleetId } from "@/lib/milestride";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: "dark", toggleTheme: () => undefined });
const FleetContext = createContext<{ fleetId: FleetId; setFleetId: (fleetId: FleetId) => void }>({ fleetId: "electronics-city", setFleetId: () => undefined });
export const useMilestrideTheme = () => useContext(ThemeContext);
export const useMilestrideFleet = () => useContext(FleetContext);

const navIcons: Record<string, LucideIcon> = {
  "/overview": LayoutDashboard,
  "/analytics": LineChart,
  "/fleet": Bike,
  "/vehicles": Navigation,
  "/hubs": Building2,
  "/alerts": BellRing,
  "/geofencing": Fence,
  "/charging": BatteryCharging,
  "/maintenance": Wrench,
  "/reports": BarChart3,
};

export default function MilestrideShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("milestride-theme") as Theme) || "dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [fleetId, setFleetId] = useState<FleetId>(() => (localStorage.getItem("milestride-fleet") as FleetId) || "electronics-city");
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));
  useEffect(() => {
    localStorage.setItem("milestride-theme", theme);
    document.documentElement.dataset.milestrideTheme = theme;
  }, [theme]);
  useEffect(() => { localStorage.setItem("milestride-fleet", fleetId); }, [fleetId]);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  const fleetValue = useMemo(() => ({ fleetId, setFleetId }), [fleetId]);

  return <ThemeContext.Provider value={value}><FleetContext.Provider value={fleetValue}><div className={`ms-shell ${theme === "light" ? "ms-light" : ""}`}>
    <header className="ms-header">
      <div className="flex items-center gap-2"><button className="ms-icon-button lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu className="h-4 w-4" /></button><Link to="/overview" className="flex items-center gap-3"><span className="ms-logo"><Bike className="h-4 w-4" /></span><span className="text-sm font-semibold tracking-[-0.02em]">Milestride</span></Link><span className="hidden h-4 w-px bg-[var(--ms-border)] sm:block" /><span className="hidden text-xs text-[var(--ms-muted)] sm:block">Operations workspace</span><select aria-label="Select operating fleet" value={fleetId} onChange={(event) => setFleetId(event.target.value as FleetId)} className="hidden h-8 max-w-[170px] rounded-md border border-[var(--ms-border)] bg-[var(--ms-panel)] px-2 pr-6 text-[10px] font-semibold text-[var(--ms-body)] outline-none sm:block">{fleetOptions.map((fleet) => <option key={fleet.id} value={fleet.id}>{fleet.name}</option>)}</select></div>
      <div className="flex items-center gap-1.5 text-[var(--ms-muted)]"><button className="ms-icon-button hidden sm:block" aria-label="Help"><CircleHelp className="h-4 w-4" /></button><button className="ms-icon-button" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button><button className="ms-icon-button" aria-label="Settings"><Settings className="h-4 w-4" /></button><button className="ms-icon-button relative" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ef655a]" /></button><button onClick={() => setProfileOpen(!profileOpen)} className="ml-1 flex items-center gap-2 rounded-md p-1 transition hover:bg-[var(--ms-hover)]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b9c9c0] text-[10px] font-semibold text-[#28312b]">AM</span><ChevronDown className="hidden h-3.5 w-3.5 sm:block" /></button></div>
      {profileOpen && <div className="ms-popover right-5 top-14"><p className="px-2.5 py-2 text-xs text-[var(--ms-muted)]">Alex Morgan</p><Link to="/" className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-[var(--ms-hover)]"><LogOut className="h-3.5 w-3.5" /> Sign out</Link></div>}
    </header>
    <div className="flex min-h-[calc(100vh-4rem)]">
      {mobileNavOpen && <button className="ms-nav-backdrop lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}
      <aside className={`ms-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="mb-4 flex items-center justify-between px-2"><p className={`text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-muted)] ${sidebarCollapsed ? "sr-only" : ""}`}>Workspace</p><button className="ms-icon-button" onClick={() => mobileNavOpen ? setMobileNavOpen(false) : setSidebarCollapsed((collapsed) => !collapsed)} aria-label={mobileNavOpen ? "Close navigation" : sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}>{mobileNavOpen ? <X className="h-4 w-4" /> : sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}</button></div>
        <nav className="space-y-1">{navItems.map((item) => { const Icon = navIcons[item.path]; return <NavLink key={item.path} to={item.path} onClick={() => setMobileNavOpen(false)} title={sidebarCollapsed ? item.label : undefined} className={({ isActive }) => `ms-nav-item ${isActive || (item.path === "/overview" && location.pathname === "/") ? "active" : ""}`}><Icon className="h-4 w-4 flex-shrink-0" /><span className={sidebarCollapsed ? "sr-only" : ""}>{item.label}</span>{item.badge && <span className={`${sidebarCollapsed ? "sr-only" : ""} ml-auto rounded bg-[#ef655a]/15 px-1.5 py-0.5 text-[9px] text-[#e87b73]`}>{item.badge}</span>}</NavLink>; })}</nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div></FleetContext.Provider></ThemeContext.Provider>;
}
