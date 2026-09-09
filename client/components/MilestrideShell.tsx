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
  const [fleetMenuOpen, setFleetMenuOpen] = useState(false);
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
      <div className="flex items-center gap-2"><button className="ms-icon-button lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu className="h-4 w-4" /></button><Link to="/overview" className="flex items-center gap-3"><span className="ms-logo"><Bike className="h-4 w-4" /></span><span className="text-sm font-semibold tracking-[-0.02em]">Milestride</span></Link><span className="hidden h-4 w-px bg-[var(--ms-border)] sm:block" /><span className="hidden text-xs text-[var(--ms-muted)] sm:block">Operations workspace</span><div className="relative hidden sm:block"><button type="button" aria-label="Select operating fleet" aria-haspopup="listbox" aria-expanded={fleetMenuOpen} onClick={() => setFleetMenuOpen((open) => !open)} className="flex h-8 min-w-[150px] items-center justify-between gap-3 rounded-md border border-[var(--ms-border)] bg-[var(--ms-panel)] px-2.5 text-[10px] font-semibold text-[var(--ms-body)] transition hover:border-[var(--ms-accent-strong)] hover:bg-[var(--ms-hover)]"><span>{fleetOptions.find((fleet) => fleet.id === fleetId)?.name}</span><ChevronDown aria-hidden="true" className={`h-3 w-3 text-[var(--ms-muted)] transition-transform ${fleetMenuOpen ? "rotate-180" : ""}`} /></button>{fleetMenuOpen && <div role="listbox" aria-label="Operating fleets" className="ms-popover right-0 top-10 w-44"><p className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-muted)]">Operating fleet</p>{fleetOptions.map((fleet) => <button key={fleet.id} type="button" role="option" aria-selected={fleet.id === fleetId} onClick={() => { setFleetId(fleet.id); setFleetMenuOpen(false); }} className={`flex w-full items-start rounded-md px-2.5 py-2 text-left text-[11px] transition ${fleet.id === fleetId ? "bg-[var(--ms-accent-soft)] text-[var(--ms-accent)]" : "text-[var(--ms-body)] hover:bg-[var(--ms-hover)]"}`}><span>{fleet.name}</span></button>)}</div>}</div></div>
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
