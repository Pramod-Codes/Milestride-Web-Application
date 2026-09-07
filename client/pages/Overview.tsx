import { useMemo, useState } from "react";
import { Bike, MapPin, Scooter, X } from "lucide-react";
import MilestrideShell from "@/components/MilestrideShell";
import FleetMap from "@/components/FleetMap";
import { type Hub, type Vehicle, vehicles } from "@/lib/milestride";

export default function Overview() {
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  return <MilestrideShell><div className="relative h-full w-full overflow-hidden p-0"><FleetMap onHubClick={setSelectedHub} />{selectedHub && <HubDrawer hub={selectedHub} onClose={() => setSelectedHub(null)} />}</div></MilestrideShell>;
}

function HubDrawer({ hub, onClose }: { hub: Hub; onClose: () => void }) {
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const hubVehicles = useMemo(() => getHubVehicles(hub), [hub]);
  const scooters = hubVehicles.filter((vehicle) => vehicle.type === "Scooter").length;
  const eBikes = hubVehicles.filter((vehicle) => vehicle.type === "E-bike").length;
  const visibleVehicles = showAllVehicles ? hubVehicles : hubVehicles.slice(0, 5);
  const booked = hub.capacity - hub.available;

  return <aside className="absolute right-4 top-4 bottom-4 z-30 flex w-[min(430px,calc(100%-2rem))] flex-col overflow-hidden rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] shadow-2xl backdrop-blur-md sm:right-6 sm:top-6 sm:bottom-6">
    <div className="flex items-center justify-between border-b border-[var(--ms-border)] px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ms-accent-soft)] text-[var(--ms-accent)]"><MapPin className="h-4 w-4" /></span><div><p className="text-base font-semibold">{hub.name}</p><p className="mt-1 text-xs text-[var(--ms-muted)]">{hub.id} · Live hub details</p></div></div><button onClick={onClose} aria-label="Close hub details" className="rounded-md p-2 text-[var(--ms-muted)] hover:bg-[var(--ms-hover)] hover:text-[var(--ms-body)]"><X className="h-4 w-4" /></button></div>
    <div className="flex-1 overflow-y-auto px-5 py-5"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">Current fleet snapshot</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><MetricCard value={String(hub.available)} label="Available vehicles" color="text-[var(--ms-accent-strong)]" /><MetricCard value={String(scooters)} label="Scooters" color="text-[#60a4e7]" /><MetricCard value={String(eBikes)} label="E-bikes" color="text-[#b486e8]" /><MetricCard value={String(booked)} label="Booked" /></div>
      <div className="mt-6 rounded-lg border border-[var(--ms-border)] p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Capacity utilization</p><span className="text-sm font-semibold">{hub.utilization}%</span></div><div className="h-2 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-[var(--ms-accent-strong)]" style={{ width: `${hub.utilization}%` }} /></div><div className="mt-2 flex justify-between text-[10px] text-[var(--ms-muted)]"><span>{hub.available} available</span><span>{booked} booked · {hub.capacity} total</span></div></div>
      <div className="mt-6 flex items-center justify-between"><p className="text-sm font-semibold">Vehicles in this hub</p><span className="text-xs text-[var(--ms-muted)]">{hubVehicles.length} available</span></div><div className="mt-3 space-y-2">{visibleVehicles.map((vehicle) => <VehicleRow key={vehicle.id} vehicle={vehicle} />)}</div>{hubVehicles.length > 5 && <button onClick={() => setShowAllVehicles((visible) => !visible)} className="mt-3 flex h-10 w-full items-center justify-center rounded-md border border-[var(--ms-border)] text-xs font-semibold text-[var(--ms-body)] transition hover:bg-[var(--ms-hover)]">{showAllVehicles ? "Show fewer vehicles" : `View all vehicles (${hubVehicles.length})`}</button>}
    </div>
  </aside>;
}

function getHubVehicles(hub: Hub): Vehicle[] {
  const assigned = vehicles.filter((vehicle) => vehicle.hub === hub.name);
  const generated = Array.from({ length: Math.max(0, hub.available - assigned.length) }, (_, index) => ({ id: `${hub.name.split(" ")[0]} ${String(index + 1).padStart(2, "0")}`, type: index % 2 === 0 ? "E-bike" : "Scooter", hub: hub.name, battery: 58 + (index % 5) * 7, status: "Stationed", trips: 0, distance: "0 km", lastActivity: "8m ago", x: hub.x, y: hub.y })) as Vehicle[];
  const priority = { Moving: 0, Charging: 1, "Low battery": 2, Stationed: 3, Maintenance: 4, Offline: 5 };
  return [...assigned, ...generated].slice(0, hub.available).sort((a, b) => priority[a.status] - priority[b.status]);
}

function VehicleRow({ vehicle }: { vehicle: Vehicle }) {
  const Icon = vehicle.type === "E-bike" ? Bike : Scooter;
  const batteryTone = vehicle.battery < 25 ? "text-[#ef655a]" : vehicle.battery < 50 ? "text-[#e6b542]" : "text-[var(--ms-accent-strong)]";
  return <div className="flex items-center gap-3 rounded-lg border border-[var(--ms-border)] p-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${vehicle.type === "E-bike" ? "bg-[#b486e8]/15 text-[#b486e8]" : "bg-[#60a4e7]/15 text-[#60a4e7]"}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{vehicle.id}</p><p className="mt-1 text-xs text-[var(--ms-muted)]">{vehicle.type} · {vehicle.status} · {vehicle.lastActivity}</p></div><span className={`text-sm font-semibold ${batteryTone}`}>{vehicle.battery}%</span></div>;
}

function MetricCard({ value, label, color = "text-[var(--ms-body)]" }: { value: string; label: string; color?: string }) { return <div className="flex min-h-[82px] flex-col items-center justify-center rounded-lg border border-[var(--ms-border)] bg-[var(--ms-bg)]/50 px-2 py-3 text-center"><p className={`text-2xl font-semibold tracking-[-0.04em] ${color}`}>{value}</p><p className="mt-2 text-xs font-medium text-[var(--ms-muted)]">{label}</p></div>; }
