import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, CircleHelp, ChevronDown, LogOut, Moon, Settings, Sun, Zap } from "lucide-react";
import { navItems } from "@/lib/milestride";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: "dark", toggleTheme: () => undefined });
export const useMilestrideTheme = () => useContext(ThemeContext);

export default function MilestrideShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("milestride-theme") as Theme) || "dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));
  useEffect(() => localStorage.setItem("milestride-theme", theme), [theme]);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}><div className={`ms-shell ${theme === "light" ? "ms-light" : ""}`}>
    <header className="ms-header">
      <div className="flex items-center gap-3"><Link to="/overview" className="flex items-center gap-3"><span className="ms-logo"><Zap className="h-4 w-4 fill-current" /></span><span className="text-sm font-semibold tracking-[-0.02em]">Milestride</span></Link><span className="hidden h-4 w-px bg-[var(--ms-border)] sm:block" /><span className="hidden text-xs text-[var(--ms-muted)] sm:block">Operations workspace</span></div>
      <div className="flex items-center gap-1.5 text-[var(--ms-muted)]"><button className="ms-icon-button hidden sm:block" aria-label="Help"><CircleHelp className="h-4 w-4" /></button><button className="ms-icon-button" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button><button className="ms-icon-button" aria-label="Settings"><Settings className="h-4 w-4" /></button><button className="ms-icon-button relative" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ef655a]" /></button><button onClick={() => setProfileOpen(!profileOpen)} className="ml-1 flex items-center gap-2 rounded-md p-1 transition hover:bg-[var(--ms-hover)]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b9c9c0] text-[10px] font-semibold text-[#28312b]">AM</span><ChevronDown className="hidden h-3.5 w-3.5 sm:block" /></button></div>
      {profileOpen && <div className="ms-popover right-5 top-14"><p className="px-2.5 py-2 text-xs text-[var(--ms-muted)]">Alex Morgan</p><Link to="/" className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-[var(--ms-hover)]"><LogOut className="h-3.5 w-3.5" /> Sign out</Link></div>}
    </header>
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="ms-sidebar"><p className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-muted)]">Workspace</p><nav className="space-y-1">{navItems.map((item) => <NavLink key={item.path} to={item.path} className={({ isActive }) => `ms-nav-item ${isActive || (item.path === "/overview" && location.pathname === "/") ? "active" : ""}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{item.label}{item.badge && <span className="ml-auto rounded bg-[#ef655a]/15 px-1.5 py-0.5 text-[9px] text-[#e87b73]">{item.badge}</span>}</NavLink>)}</nav><div className="mt-8 border-t border-[var(--ms-border)] pt-5"><p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-muted)]">Network status</p><div className="mt-4 flex items-center gap-2 px-2 text-xs text-[var(--ms-body)]"><span className="h-2 w-2 rounded-full bg-[var(--ms-accent-strong)] shadow-[0_0_10px_var(--ms-accent-strong)]" /> All systems nominal</div></div></aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div></ThemeContext.Provider>;
}
