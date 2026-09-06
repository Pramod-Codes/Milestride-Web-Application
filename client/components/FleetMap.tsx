import { useState } from "react";
import { MapPin } from "lucide-react";
import { hubs, vehicles, type Hub } from "@/lib/milestride";
import { useMilestrideTheme } from "@/components/MilestrideShell";

const hubColors = { healthy: "#45dd89", warning: "#e8b846", critical: "#ef655a" };

export default function FleetMap({ onHubClick }: { onHubClick?: (hub: Hub) => void }) {
  const { theme } = useMilestrideTheme();
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const selectedHub = hubs.find((hub) => hub.id === selectedHubId) ?? null;
  const selectedVehicles = selectedHub ? vehicles.filter((vehicle) => vehicle.hub === selectedHub.name) : [];

  const selectHub = (hub: Hub) => {
    setSelectedHubId(hub.id);
    onHubClick?.(hub);
  };

  const mapBackground = theme === "light"
    ? "https://cdn.builder.io/api/v1/image/assets%2F36d1078c17f94b889fd933421ec3f094%2Fd303d7ff6788498d879bc7bdc1124262?format=webp&width=800&height=1200"
    : "https://cdn.builder.io/api/v1/image/assets%2F36d1078c17f94b889fd933421ec3f094%2F990fa8dd05ce4bbabcc1ccc9faf75496?format=webp&width=800&height=1200";

  return <section className="ms-map" style={{ backgroundImage: `url(${mapBackground})`, backgroundPosition: "center", backgroundSize: "cover" }}>
    <div className="absolute inset-0 bg-black/[0.03] dark:bg-black/[0.08]" />
    <div className="relative z-10 flex items-center justify-between border-b border-[var(--ms-border)] bg-[var(--ms-surface)]/80 px-4 py-3 backdrop-blur-sm sm:px-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ms-muted)]">Live network map</p><p className="mt-1 text-sm font-semibold">Electronics City · Bengaluru</p></div><div className="hidden items-center gap-2 text-[11px] text-[var(--ms-muted)] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[var(--ms-accent-strong)] shadow-[0_0_10px_var(--ms-accent-strong)]" /> Live hub data · just now</div></div>
    <div className="relative z-10 flex items-center gap-2 px-4 pt-4 sm:px-6"><span className="rounded-md border border-[var(--ms-accent-strong)]/35 bg-[var(--ms-accent-soft)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--ms-accent)]">Hubs</span><span className="text-[11px] text-[var(--ms-muted)]">Select a hub to inspect its fleet activity</span></div>
    {hubs.map((hub) => <button key={hub.id} onClick={() => selectHub(hub)} className={`group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${selectedHubId === hub.id ? "scale-110" : ""}`} style={{ left: `${hub.x}%`, top: `calc(${hub.y}% + 64px)` }}><span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1a1d1c]" style={{ backgroundColor: hubColors[hub.state], boxShadow: `0 0 18px ${hubColors[hub.state]}80` }}><MapPin className="h-4 w-4 fill-current text-[#18201b]" /><span className="absolute inset-[-5px] rounded-full border border-current opacity-20 group-hover:animate-ping" style={{ color: hubColors[hub.state] }} />{selectedHubId === hub.id && <span className="absolute inset-[-8px] rounded-full border-2 border-current" style={{ color: hubColors[hub.state] }} />}</span><span className={`mt-1.5 whitespace-nowrap rounded px-2 py-1 text-[10px] shadow-lg ${theme === "dark" ? "bg-[#131615]/90 text-[#dae2dc]" : "bg-white/90 text-[#24332a]"}`}>{hub.name}<span className="ml-1.5 opacity-60">{hub.available} available</span></span></button>)}
    <FleetActivity hub={selectedHub} vehicles={selectedVehicles} theme={theme} />
  </section>;
}

function FleetActivity({ hub, vehicles: hubVehicles, theme }: { hub: Hub | null; vehicles: typeof vehicles; theme: "dark" | "light" }) {
  if (!hub) return <div className={`absolute bottom-5 left-5 z-20 w-[275px] rounded-xl border border-[var(--ms-border)] p-4 shadow-2xl backdrop-blur-md ${theme === "dark" ? "bg-[#171b19]/95" : "bg-white/95"}`}><div className="mb-4"><p className="text-xs font-semibold">Network overview</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">Across 4 active hubs</p></div><div className="mb-4 grid grid-cols-3 divide-x divide-[var(--ms-border)]"><MapMetric value="4" label="Total hubs" /><MapMetric value="30" label="Available" color="text-[var(--ms-accent-strong)]" /><MapMetric value="3" label="Out of service" color="text-[#ef655a]" /></div><div className="space-y-1.5"><Notice color="amber" text="2 vehicles need charging" /><Notice color="red" text="1 geofence violation" /><Notice color="blue" text="6 scheduled for charging" /></div></div>;

  const moving = hubVehicles.filter((vehicle) => vehicle.status === "Moving").length;
  const stationed = hubVehicles.filter((vehicle) => vehicle.status === "Stationed").length;
  const attention = hubVehicles.filter((vehicle) => ["Low battery", "Maintenance", "Offline"].includes(vehicle.status)).length;
  return <div className={`absolute bottom-5 left-5 z-20 w-[min(330px,calc(100%-2.5rem))] rounded-xl border border-[var(--ms-border)] p-4 shadow-2xl backdrop-blur-md ${theme === "dark" ? "bg-[#171b19]/95" : "bg-white/95"}`}><div className="mb-4 flex items-start justify-between"><div><p className="text-xs font-semibold">Fleet activity</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">{hub.name} · {hubVehicles.length} vehicles</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${hub.state === "critical" ? "status-red" : hub.state === "warning" ? "status-amber" : "status-green"}`}>{hub.state}</span></div><div className="mb-4 grid grid-cols-3 divide-x divide-[var(--ms-border)]"><MapMetric value={String(moving)} label="Moving" color="text-[#69a7de]" /><MapMetric value={String(stationed)} label="Stationed" color="text-[var(--ms-accent-strong)]" /><MapMetric value={String(attention)} label="Attention" color="text-[#e6b542]" /></div><div className="space-y-1.5">{hubVehicles.slice(0, 3).map((vehicle) => <div key={vehicle.id} className="flex items-center justify-between rounded-md border border-[var(--ms-border)] px-2.5 py-2 text-[10px]"><span className="font-medium">{vehicle.id}</span><span className="text-[var(--ms-muted)]">{vehicle.status} · {vehicle.battery}%</span></div>)}</div></div>;
}
function MapMetric({ value, label, color = "text-[var(--ms-body)]" }: { value: string; label: string; color?: string }) { return <div className="text-center"><p className={`text-lg font-semibold ${color}`}>{value}</p><p className="mt-1 text-[9px] text-[var(--ms-muted)]">{label}</p></div> }
function Notice({ color, text }: { color: "amber" | "red" | "blue"; text: string }) { const colors = { amber: "bg-[#d99e22]/15 text-[#dfaf4f]", red: "bg-[#d9574f]/15 text-[#e57d74]", blue: "bg-[#458bd1]/15 text-[#75a9e2]" }; return <div className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] ${colors[color]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{text}</div> }
