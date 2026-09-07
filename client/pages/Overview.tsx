import { useMemo, useState } from "react";
import { BatteryCharging, Bell, Bike, CircleDot, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import MilestrideShell from "@/components/MilestrideShell";
import FleetMap from "@/components/FleetMap";
import { type Hub, vehicles } from "@/lib/milestride";

export default function Overview() {
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  return <MilestrideShell><div className="relative h-full w-full overflow-hidden p-0"><FleetMap onHubClick={setSelectedHub} />{selectedHub && <HubDrawer hub={selectedHub} onClose={() => setSelectedHub(null)} />}</div></MilestrideShell>;
}

function HubDrawer({ hub, onClose }: { hub: Hub; onClose: () => void }) {
  const hubVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.hub === hub.name), [hub.name]);
  const scooters = hubVehicles.filter((vehicle) => vehicle.type === "Scooter").length;
  const eBikes = hubVehicles.filter((vehicle) => vehicle.type === "E-bike").length;

  return <aside className="absolute right-4 top-4 bottom-4 z-30 flex w-[min(430px,calc(100%-2rem))] flex-col overflow-hidden rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] shadow-2xl backdrop-blur-md sm:right-6 sm:top-6 sm:bottom-6">
    <div className="flex items-center justify-between border-b border-[var(--ms-border)] px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ms-accent-soft)] text-[var(--ms-accent)]"><MapPin className="h-4 w-4" /></span><div><p className="text-base font-semibold">{hub.name}</p><p className="mt-1 text-xs text-[var(--ms-muted)]">{hub.id} · Live hub details</p></div></div><button onClick={onClose} aria-label="Close hub details" className="rounded-md p-2 text-[var(--ms-muted)] hover:bg-[var(--ms-hover)] hover:text-[var(--ms-body)]"><X className="h-4 w-4" /></button></div>
    <div className="flex-1 overflow-y-auto px-5 py-5"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">Current fleet snapshot</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><MetricCard value={String(hub.available)} label="Available" color="text-[var(--ms-accent-strong)]" /><MetricCard value={String(hub.capacity - hub.available)} label="Occupied" /><MetricCard value={String(scooters)} label="Scooters" color="text-[#60a4e7]" /><MetricCard value={String(eBikes)} label="E-bikes" color="text-[#b486e8]" /></div>
      <div className="mt-6 rounded-lg border border-[var(--ms-border)] p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Capacity utilization</p><span className="text-sm font-semibold">{hub.utilization}%</span></div><div className="h-2 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-[var(--ms-accent-strong)]" style={{ width: `${hub.utilization}%` }} /></div><div className="mt-2 flex justify-between text-[10px] text-[var(--ms-muted)]"><span>{hub.available} available</span><span>{hub.capacity} total capacity</span></div></div>
      <div className="mt-6 flex items-center justify-between"><p className="text-sm font-semibold">Vehicles in this hub</p><span className="text-xs text-[var(--ms-muted)]">{hubVehicles.length} tracked</span></div><div className="mt-3 space-y-2">{hubVehicles.length > 0 ? hubVehicles.map((vehicle) => <VehicleRow key={vehicle.id} vehicle={vehicle} />) : <p className="rounded-lg border border-[var(--ms-border)] p-4 text-xs text-[var(--ms-muted)]">No vehicle records are currently assigned to this hub.</p>}</div>
      <div className="mt-6 grid gap-2"><Link to="/vehicles" className="flex h-10 items-center justify-center rounded-md bg-[var(--ms-accent-strong)] text-xs font-semibold text-[#122018] transition hover:bg-[var(--ms-accent)]">View all vehicles</Link><div className="grid grid-cols-2 gap-2"><Link to="/alerts" className="flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--ms-border)] text-xs font-medium text-[var(--ms-body)] hover:bg-[var(--ms-hover)]"><Bell className="h-3.5 w-3.5" /> View alerts</Link><Link to="/charging" className="flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--ms-border)] text-xs font-medium text-[var(--ms-body)] hover:bg-[var(--ms-hover)]"><BatteryCharging className="h-3.5 w-3.5" /> Charging</Link></div></div>
    </div>
  </aside>;
}

function VehicleRow({ vehicle }: { vehicle: (typeof vehicles)[number] }) {
  const Icon = vehicle.type === "E-bike" ? Bike : CircleDot;
  const batteryTone = vehicle.battery < 25 ? "text-[#ef655a]" : vehicle.battery < 50 ? "text-[#e6b542]" : "text-[var(--ms-accent-strong)]";
  return <div className="flex items-center gap-3 rounded-lg border border-[var(--ms-border)] p-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${vehicle.type === "E-bike" ? "bg-[#b486e8]/15 text-[#b486e8]" : "bg-[#60a4e7]/15 text-[#60a4e7]"}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{vehicle.id}</p><p className="mt-1 text-xs text-[var(--ms-muted)]">{vehicle.type} · {vehicle.status} · {vehicle.lastActivity}</p></div><span className={`text-sm font-semibold ${batteryTone}`}>{vehicle.battery}%</span></div>;
}

function MetricCard({ value, label, color = "text-[var(--ms-body)]" }: { value: string; label: string; color?: string }) { return <div className="flex min-h-[82px] flex-col items-center justify-center rounded-lg border border-[var(--ms-border)] bg-[var(--ms-bg)]/50 px-2 py-3 text-center"><p className={`text-2xl font-semibold tracking-[-0.04em] ${color}`}>{value}</p><p className="mt-2 text-xs font-medium text-[var(--ms-muted)]">{label}</p></div>; }
