import { useState } from "react";
import { MapPin, Navigation, X } from "lucide-react";
import { hubs, vehicles, type Hub, type Vehicle } from "@/lib/milestride";
import { useMilestrideTheme } from "@/components/MilestrideShell";

const hubColors = { healthy: "#45dd89", warning: "#e8b846", critical: "#ef655a" };

export default function FleetMap({ onHubClick }: { onHubClick?: (hub: Hub) => void }) {
  const { theme } = useMilestrideTheme();
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [activityOpen, setActivityOpen] = useState(true);
  const [trackedVehicleId, setTrackedVehicleId] = useState<string | null>(null);
  const selectedHub = hubs.find((hub) => hub.id === selectedHubId) ?? null;
  const selectedVehicles = selectedHub ? vehicles.filter((vehicle) => vehicle.hub === selectedHub.name) : [];
  const mapBackground = theme === "light"
    ? "https://cdn.builder.io/api/v1/image/assets%2F36d1078c17f94b889fd933421ec3f094%2Fd303d7ff6788498d879bc7bdc1124262"
    : "https://cdn.builder.io/api/v1/image/assets%2F36d1078c17f94b889fd933421ec3f094%2F990fa8dd05ce4bbabcc1ccc9faf75496";

  const selectHub = (hub: Hub) => {
    setSelectedHubId(hub.id);
    setTrackedVehicleId(null);
    setActivityOpen(true);
    onHubClick?.(hub);
  };

  return <section className="ms-map" style={{ backgroundImage: `url(${mapBackground})`, backgroundPosition: "center", backgroundSize: "cover" }}>
    <div className="absolute inset-0 bg-black/[0.03] dark:bg-black/[0.08]" />
    <div className="relative z-10 flex items-center justify-between border-b border-[var(--ms-border)] bg-[var(--ms-surface)]/80 px-4 py-3 backdrop-blur-sm sm:px-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ms-muted)]">Live network map</p><p className="mt-1 text-sm font-semibold">Electronics City · Bengaluru</p></div><div className="hidden items-center gap-2 text-[11px] text-[var(--ms-muted)] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[var(--ms-accent-strong)] shadow-[0_0_10px_var(--ms-accent-strong)]" /> Live hub data · just now</div></div>
    <div className="relative z-10 flex items-center gap-2 px-4 pt-4 sm:px-6"><span className="rounded-md border border-[var(--ms-accent-strong)]/35 bg-[var(--ms-accent-soft)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--ms-accent)]">Hubs</span><span className="text-[11px] text-[var(--ms-muted)]">Select a hub to inspect its fleet activity</span></div>
    {hubs.map((hub) => <button key={hub.id} onClick={() => selectHub(hub)} className={`group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${selectedHubId === hub.id ? "scale-110" : ""}`} style={{ left: `${hub.x}%`, top: `calc(${hub.y}% + 64px)` }}><span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1a1d1c]" style={{ backgroundColor: hubColors[hub.state], boxShadow: `0 0 18px ${hubColors[hub.state]}80` }}><MapPin className="h-4 w-4 fill-current text-[#18201b]" /><span className="absolute inset-[-5px] rounded-full border border-current opacity-20 group-hover:animate-ping" style={{ color: hubColors[hub.state] }} />{selectedHubId === hub.id && <span className="absolute inset-[-8px] rounded-full border-2 border-current" style={{ color: hubColors[hub.state] }} />}</span><span className={`mt-1.5 whitespace-nowrap rounded px-2 py-1 text-[10px] shadow-lg ${theme === "dark" ? "bg-[#131615]/90 text-[#dae2dc]" : "bg-white/90 text-[#24332a]"}`}>{hub.name}<span className="ml-1.5 opacity-60">{hub.available} available</span></span></button>)}
    {trackedVehicleId && <TrackedVehicle vehicle={vehicles.find((vehicle) => vehicle.id === trackedVehicleId)!} />}
    {activityOpen && <FleetActivity hub={selectedHub} vehicles={selectedVehicles} theme={theme} onClose={() => setActivityOpen(false)} onTrack={setTrackedVehicleId} trackedVehicleId={trackedVehicleId} />}
  </section>;
}

function FleetActivity({ hub, vehicles: hubVehicles, theme, onClose, onTrack, trackedVehicleId }: { hub: Hub | null; vehicles: typeof vehicles; theme: "dark" | "light"; onClose: () => void; onTrack: (vehicleId: string) => void; trackedVehicleId: string | null }) {
  if (!hub) return <div className={`absolute bottom-5 left-5 z-20 w-[275px] rounded-xl border border-[var(--ms-border)] p-4 shadow-2xl backdrop-blur-md ${theme === "dark" ? "bg-[#171b19]/95" : "bg-white/95"}`}><OverlayHeader title="Network overview" onClose={onClose} subtitle="Across 4 active hubs" /><div className="mb-4 grid grid-cols-3 divide-x divide-[var(--ms-border)]"><MapMetric value="4" label="Total hubs" /><MapMetric value="30" label="Available" color="text-[var(--ms-accent-strong)]" /><MapMetric value="3" label="Out of service" color="text-[#ef655a]" /></div><div className="space-y-1.5"><Notice color="amber" text="2 vehicles need charging" /><Notice color="red" text="1 geofence violation" /><Notice color="blue" text="6 scheduled for charging" /></div></div>;

  const moving = hubVehicles.filter((vehicle) => vehicle.status === "Moving").length;
  const attention = hubVehicles.filter((vehicle) => ["Low battery", "Maintenance", "Offline"].includes(vehicle.status)).length;
  const fleetRows = Array.from({ length: hub.available }, (_, index) => hubVehicles[index] ?? { id: `${hub.name.split(" ")[0]} ${String(index + 1).padStart(2, "0")}`, status: "Stationed", battery: 64 + (index % 4) * 6 });
  return <div className={`absolute bottom-5 left-5 z-20 w-[min(370px,calc(100%-2.5rem))] rounded-xl border border-[var(--ms-border)] p-4 shadow-2xl backdrop-blur-md ${theme === "dark" ? "bg-[#171b19]/95" : "bg-white/95"}`}><OverlayHeader title="Fleet activity" onClose={onClose} subtitle={`${hub.name} · ${hub.available} available vehicles`} status={hub.state} /><div className="mb-4 grid grid-cols-3 divide-x divide-[var(--ms-border)]"><MapMetric value={String(hub.available)} label="Available" color="text-[var(--ms-accent-strong)]" /><MapMetric value={String(moving)} label="Moving now" color="text-[#69a7de]" /><MapMetric value={String(attention)} label="Attention" color="text-[#e6b542]" /></div><div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-semibold text-[var(--ms-muted)]">Available fleet ({hub.available})</p><span className="text-[9px] text-[var(--ms-muted)]">Battery status</span></div><div className="max-h-36 space-y-1.5 overflow-y-auto">{fleetRows.map((vehicle) => <FleetRow key={vehicle.id} vehicle={vehicle} onTrack={onTrack} tracked={trackedVehicleId === vehicle.id} />)}</div></div>;
}
function FleetRow({ vehicle, onTrack, tracked }: { vehicle: Vehicle | { id: string; status: string; battery: number }; onTrack: (vehicleId: string) => void; tracked: boolean }) { const canTrack = vehicle.status === "Moving" && "x" in vehicle; return <div className="flex items-center justify-between rounded-md border border-[var(--ms-border)] px-2.5 py-2 text-[10px]"><span className="font-medium">{vehicle.id}</span><div className="flex items-center gap-2"><span className="text-[var(--ms-muted)]">{vehicle.status} · {vehicle.battery}%</span>{canTrack && <button onClick={() => onTrack(vehicle.id)} className={`rounded px-2 py-1 text-[9px] font-semibold ${tracked ? "bg-[#69a7de]/20 text-[#69a7de]" : "bg-[var(--ms-accent-soft)] text-[var(--ms-accent)]"}`}>{tracked ? "Tracking" : "Track"}</button>}</div></div> }
function TrackedVehicle({ vehicle }: { vehicle: Vehicle }) { return <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${vehicle.x}%`, top: `calc(${vehicle.y}% + 64px)` }}><div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#17201a] bg-[#69a7de] text-[#17201a] shadow-[0_0_16px_#69a7de]"><Navigation className="h-4 w-4 fill-current" /><span className="absolute inset-[-5px] animate-ping rounded-full border border-[#69a7de]/50" /></div><div className="mt-1 whitespace-nowrap rounded bg-[#121614]/85 px-2 py-1 text-[9px] text-white">Tracking {vehicle.id}</div></div> }
function OverlayHeader({ title, subtitle, onClose, status }: { title: string; subtitle: string; onClose: () => void; status?: Hub["state"] }) { return <div className="mb-4 flex items-start justify-between"><div><p className="text-xs font-semibold">{title}</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">{subtitle}</p></div><div className="flex items-center gap-2">{status && <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${status === "critical" ? "status-red" : status === "warning" ? "status-amber" : "status-green"}`}>{status}</span>}<button onClick={onClose} aria-label={`Close ${title}`} className="rounded p-1 text-[var(--ms-muted)] hover:bg-[var(--ms-hover)] hover:text-[var(--ms-body)]"><X className="h-3.5 w-3.5" /></button></div></div> }
function MapMetric({ value, label, color = "text-[var(--ms-body)]" }: { value: string; label: string; color?: string }) { return <div className="text-center"><p className={`text-lg font-semibold ${color}`}>{value}</p><p className="mt-1 text-[9px] text-[var(--ms-muted)]">{label}</p></div> }
function Notice({ color, text }: { color: "amber" | "red" | "blue"; text: string }) { const colors = { amber: "bg-[#d99e22]/15 text-[#dfaf4f]", red: "bg-[#d9574f]/15 text-[#e57d74]", blue: "bg-[#458bd1]/15 text-[#75a9e2]" }; return <div className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] ${colors[color]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{text}</div> }
