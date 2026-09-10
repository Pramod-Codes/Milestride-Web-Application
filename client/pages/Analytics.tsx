import { useMemo } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BatteryCharging, Bike, BellRing, Building2, CarFront, CheckCircle2, Clock3, Gauge, MapPinned, ShieldAlert, Wrench } from "lucide-react";
import MilestrideShell, { useMilestrideFleet } from "@/components/MilestrideShell";
import { formatIstTime } from "@/lib/milestride";

type FleetArea = {
  id: string;
  name: string;
  subtitle: string;
  hubs: { name: string; type: string; vehicles: number; utilization: number; availability: number; status: "Healthy" | "Watch" | "At risk" }[];
  metrics: { fleetSize: string; available: string; utilization: string; trips: string; uptime: string; compliance: string };
  trend: number[];
  exceptions: { title: string; detail: string; tone: "red" | "amber" | "blue"; icon: "alert" | "charging" | "maintenance" }[];
};

const fleets: FleetArea[] = [
  {
    id: "electronics-city",
    name: "Electronics City",
    subtitle: "Bengaluru · 4 hubs · Corporate and campus mobility",
    hubs: [
      { name: "Global Tech Park", type: "MNC campus", vehicles: 12, utilization: 62, availability: 94, status: "Healthy" },
      { name: "University Campus", type: "Education district", vehicles: 10, utilization: 40, availability: 97, status: "Healthy" },
      { name: "Shopping Complex", type: "Retail destination", vehicles: 2, utilization: 90, availability: 71, status: "At risk" },
      { name: "Metro Station", type: "Transit connector", vehicles: 6, utilization: 68, availability: 88, status: "Watch" },
    ],
    metrics: { fleetSize: "42", available: "30", utilization: "68%", trips: "1,284", uptime: "98.2%", compliance: "97%" },
    trend: [48, 56, 52, 64, 61, 73, 68, 79, 76, 84, 81, 88],
    exceptions: [
      { title: "Shopping Complex availability", detail: "Only 2 vehicles available against a 20-slot hub capacity.", tone: "red", icon: "alert" },
      { title: "Charging queue building", detail: "6 vehicles need charging before the evening peak.", tone: "amber", icon: "charging" },
      { title: "E-Bike V4 maintenance", detail: "Brake inspection has been open for 24 minutes.", tone: "blue", icon: "maintenance" },
    ],
  },
  {
    id: "bellandur",
    name: "Bellandur",
    subtitle: "Bengaluru · 5 hubs · MNC campuses and office corridors",
    hubs: [
      { name: "RMZ Ecospace", type: "MNC campus", vehicles: 18, utilization: 78, availability: 96, status: "Healthy" },
      { name: "Embassy TechVillage", type: "MNC campus", vehicles: 16, utilization: 73, availability: 93, status: "Healthy" },
      { name: "Prestige Tech Park", type: "Corporate campus", vehicles: 14, utilization: 81, availability: 91, status: "Watch" },
      { name: "Bellandur Lake Gate", type: "Commuter connector", vehicles: 8, utilization: 56, availability: 98, status: "Healthy" },
      { name: "Outer Ring Road", type: "Transit connector", vehicles: 10, utilization: 69, availability: 87, status: "Watch" },
    ],
    metrics: { fleetSize: "66", available: "51", utilization: "74%", trips: "2,146", uptime: "99.1%", compliance: "98%" },
    trend: [52, 58, 61, 57, 69, 72, 76, 73, 82, 86, 84, 91],
    exceptions: [
      { title: "Outer Ring Road availability", detail: "Availability dropped below the 90% operating target.", tone: "amber", icon: "alert" },
      { title: "Peak demand approaching", detail: "RMZ Ecospace is forecast to exceed 85% utilization at 6 PM.", tone: "blue", icon: "charging" },
      { title: "Preventive maintenance due", detail: "4 vehicles have crossed their service distance threshold.", tone: "amber", icon: "maintenance" },
    ],
  },
];

const exceptionIcons = { alert: AlertTriangle, charging: BatteryCharging, maintenance: Wrench };
const toneClasses = { red: "bg-[#ef655a]/12 text-[#ef655a]", amber: "bg-[#e6b542]/14 text-[#d19e2e]", blue: "bg-[#69a7de]/14 text-[#69a7de]" };

export default function Analytics() {
  return <MilestrideShell><AnalyticsContent /></MilestrideShell>;
}

function AnalyticsContent() {
  const { fleetId } = useMilestrideFleet();
  const fleet = useMemo(() => fleets.find((area) => area.id === fleetId) ?? fleets[0], [fleetId]);
  const kpis = [
    { label: "Fleet size", value: fleet.metrics.fleetSize, Icon: Bike, color: "text-[var(--ms-body)]" },
    { label: "Available now", value: fleet.metrics.available, Icon: CheckCircle2, color: "text-[var(--ms-accent-strong)]" },
    { label: "Utilization", value: fleet.metrics.utilization, Icon: Gauge, color: "text-[#69a7de]" },
    { label: "Trips today", value: fleet.metrics.trips, Icon: CarFront, color: "text-[#b486e8]" },
    { label: "Fleet uptime", value: fleet.metrics.uptime, Icon: Clock3, color: "text-[#69a7de]" },
    { label: "Zone compliance", value: fleet.metrics.compliance, Icon: ShieldAlert, color: "text-[#e6b542]" },
  ];
  return <main className="min-h-[calc(100vh-4rem)] overflow-y-auto bg-[var(--ms-bg)] p-4 sm:p-6 lg:p-7"><div className="mx-auto max-w-[1480px] space-y-5">
    <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-accent)]">Fleet intelligence</p><h1 className="text-3xl font-semibold tracking-[-0.045em]">Analytics</h1><p className="mt-2 max-w-3xl text-sm text-[var(--ms-muted)]">A decision dashboard for fleet managers: capacity, demand, reliability, and the exceptions that need action.</p></div><div className="text-right"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-muted)]">Active fleet</p><p className="mt-1 text-sm font-semibold text-[var(--ms-accent)]">{fleet.name} · Bengaluru</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">Change this from the global header selector</p></div></header>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--ms-border)] bg-[var(--ms-panel)] px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--ms-accent-soft)] text-[var(--ms-accent)]"><MapPinned className="h-4 w-4" /></span><div><p className="text-xs font-semibold">{fleet.name} fleet</p><p className="mt-0.5 text-[10px] text-[var(--ms-muted)]">{fleet.subtitle}</p></div></div><div className="flex items-center gap-2 text-[10px] text-[var(--ms-muted)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--ms-accent-strong)] shadow-[0_0_8px_var(--ms-accent-strong)]" /> Data refreshed {formatIstTime(new Date(Date.now() - 2 * 60_000))}</div></div>
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{kpis.map(({ label, value, Icon, color }) => <div key={String(label)} className="min-h-[112px] rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-4"><div className="flex items-center justify-between"><span className={`text-xs ${color}`}><Icon className="h-4 w-4" /></span><span className="text-[9px] text-[var(--ms-muted)]">LIVE</span></div><p className={`mt-4 text-2xl font-semibold tracking-[-0.05em] ${color}`}>{value}</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">{label}</p></div>)}</section>
    <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><div className="rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold">Fleet demand trend</h2><p className="mt-1 text-[11px] text-[var(--ms-muted)]">Utilization index · last 12 operating hours</p></div><span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--ms-accent-strong)]"><ArrowUpRight className="h-3.5 w-3.5" /> 12.4%</span></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-[var(--ms-border)] px-1">{fleet.trend.map((value, index) => <div key={`${fleet.id}-${index}`} className="group flex h-full flex-1 flex-col justify-end gap-2"><div className="relative w-full rounded-t bg-[var(--ms-accent-strong)]/75 transition group-hover:bg-[var(--ms-accent-strong)]" style={{ height: `${value}%` }}><span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[9px] text-[var(--ms-muted)] group-hover:block">{value}%</span></div><span className="text-center text-[9px] text-[var(--ms-muted)]">{index + 8}:00</span></div>)}</div><div className="mt-4 flex flex-wrap gap-4 text-[10px] text-[var(--ms-muted)]"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-[var(--ms-accent-strong)]" /> Utilization</span><span>Target 70%</span><span>Peak window 5–7 PM</span></div></div><div className="rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold">Operational balance</h2><p className="mt-1 text-[11px] text-[var(--ms-muted)]">Current fleet workload</p></div><Gauge className="h-4 w-4 text-[var(--ms-accent)]" /></div><div className="mt-6 flex items-center justify-center"><div className="relative flex h-40 w-40 items-center justify-center rounded-full" style={{ background: `conic-gradient(var(--ms-accent-strong) 0 68%, rgba(120,140,125,.12) 68% 100%)` }}><div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[var(--ms-panel)]"><span className="text-3xl font-semibold">{fleet.metrics.utilization}</span><span className="text-[10px] text-[var(--ms-muted)]">utilized</span></div></div></div><div className="mt-5 grid grid-cols-2 gap-2 text-center"><div className="rounded-md bg-[var(--ms-bg)]/60 p-2"><p className="text-sm font-semibold text-[#69a7de]">{fleet.metrics.available}</p><p className="text-[9px] text-[var(--ms-muted)]">Available</p></div><div className="rounded-md bg-[var(--ms-bg)]/60 p-2"><p className="text-sm font-semibold text-[#e6b542]">{fleet.hubs.filter((hub) => hub.status !== "Healthy").length}</p><p className="text-[9px] text-[var(--ms-muted)]">Hubs to watch</p></div></div></div></section>
    <section className="rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-5"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-sm font-semibold">Hub capacity and reliability</h2><p className="mt-1 text-[11px] text-[var(--ms-muted)]">Compare the physical hubs that make up the {fleet.name} fleet.</p></div><Building2 className="h-4 w-4 text-[var(--ms-accent)]" /></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-xs"><thead><tr className="border-b border-[var(--ms-border)] text-[10px] uppercase tracking-[0.1em] text-[var(--ms-muted)]"><th className="px-3 pb-3">Hub</th><th className="px-3 pb-3">Vehicles</th><th className="px-3 pb-3">Utilization</th><th className="px-3 pb-3">Availability</th><th className="px-3 pb-3">Status</th></tr></thead><tbody>{fleet.hubs.map((hub) => <tr key={hub.name} className="border-b border-[var(--ms-border)] last:border-0"><td className="px-3 py-3"><p className="font-medium">{hub.name}</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">{hub.type}</p></td><td className="px-3 py-3 font-semibold">{hub.vehicles}</td><td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-black/10"><div className="h-full rounded-full bg-[var(--ms-accent-strong)]" style={{ width: `${hub.utilization}%` }} /></div>{hub.utilization}%</div></td><td className="px-3 py-3 font-semibold">{hub.availability}%</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${hub.status === "At risk" ? "status-red" : hub.status === "Watch" ? "status-amber" : "status-green"}`}>{hub.status}</span></td></tr>)}</tbody></table></div></section>
    <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-5"><div className="mb-4 flex items-start justify-between"><div><h2 className="text-sm font-semibold">Operational exceptions</h2><p className="mt-1 text-[11px] text-[var(--ms-muted)]">Prioritized actions for the fleet manager.</p></div><BellRing className="h-4 w-4 text-[#e6b542]" /></div><div className="space-y-2">{fleet.exceptions.map((exception) => { const Icon = exceptionIcons[exception.icon]; return <div key={exception.title} className="flex items-start gap-3 rounded-lg border border-[var(--ms-border)] bg-[var(--ms-bg)]/45 p-3"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${toneClasses[exception.tone]}`}><Icon className="h-4 w-4" /></span><div className="min-w-0"><p className="text-xs font-semibold">{exception.title}</p><p className="mt-1 text-[10px] leading-4 text-[var(--ms-muted)]">{exception.detail}</p></div><ArrowDownRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--ms-muted)]" /></div>})}</div></div><div className="rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-5"><h2 className="text-sm font-semibold">Readiness snapshot</h2><p className="mt-1 text-[11px] text-[var(--ms-muted)]">Cross-domain indicators</p><div className="mt-5 space-y-4"><Readiness icon={<BatteryCharging className="h-4 w-4" />} label="Charging readiness" value={fleetId === "bellandur" ? "84%" : "72%"} tone="bg-[#69a7de]" /><Readiness icon={<Wrench className="h-4 w-4" />} label="Maintenance cleared" value={fleetId === "bellandur" ? "91%" : "86%"} tone="bg-[#b486e8]" /><Readiness icon={<ShieldAlert className="h-4 w-4" />} label="Geofence compliance" value={fleet.metrics.compliance} tone="bg-[#e6b542]" /></div></div></section>
  </div></main>;
}

function Readiness({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) { return <div><div className="mb-2 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-[var(--ms-muted)]">{icon}{label}</span><span className="font-semibold">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-black/10"><div className={`h-full rounded-full ${tone}`} style={{ width: value }} /></div></div>; }
