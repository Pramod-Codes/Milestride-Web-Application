import { useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Download, FileText, Gauge, ShieldCheck, Wrench } from "lucide-react";
import { fleetOptions, allHubs, allVehicles, type Vehicle } from "@/lib/milestride";
import { useMilestrideFleet } from "@/components/MilestrideShell";

const reportTypes = ["Fleet performance", "Hub performance", "Charging and battery", "Maintenance costs"];
const ranges = ["Today", "Last 7 days", "Last 30 days"];

type ReportTableProps = {
  title: string;
  description: string;
  headers: string[];
  rows: ReactNode[][];
};

export default function ReportsDashboard({ query = "" }: { query?: string }) {
  const { fleetId } = useMilestrideFleet();
  const [reportType, setReportType] = useState(reportTypes[0]);
  const [range, setRange] = useState(ranges[1]);
  const fleet = fleetOptions.find((item) => item.id === fleetId) ?? fleetOptions[0];
  const hubs = allHubs.filter((hub) => fleet.hubNames.includes(hub.name));
  const vehicles = allVehicles.filter((vehicle) => fleet.hubNames.includes(vehicle.hub));
  const fleetSize = fleetId === "bellandur" ? 66 : 42;
  const reportVehicles = useMemo(() => {
    const additionalVehicles: Vehicle[] = Array.from({ length: Math.max(0, fleetSize - vehicles.length) }, (_, index) => {
      const type: Vehicle["type"] = index % 3 === 0 ? "Scooter" : "E-bike";
      const number = index + 5;
      const status: Vehicle["status"] = index % 11 === 0 ? "Offline" : index % 7 === 0 ? "Low battery" : index % 5 === 0 ? "Charging" : index % 2 === 0 ? "Moving" : "Stationed";
      return { id: `${type} ${fleetId === "bellandur" ? "B" : "V"}${number}`, type, hub: fleet.hubNames[index % fleet.hubNames.length], battery: Math.max(18, 94 - (index * 7) % 68), status, trips: 34 + (index * 23) % 188, distance: `${96 + (index * 31) % 360}.4 km`, lastActivity: index % 4 === 0 ? "Now" : `${index + 2}m ago`, x: 20 + (index * 13) % 65, y: 22 + (index * 17) % 62 };
    });
    return [...vehicles, ...additionalVehicles];
  }, [fleet, fleetId, fleetSize, vehicles]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredVehicles = reportVehicles.filter((vehicle) => !normalizedQuery || `${vehicle.id} ${vehicle.hub} ${vehicle.type}`.toLowerCase().includes(normalizedQuery));
  const filteredHubs = hubs.filter((hub) => !normalizedQuery || `${hub.id} ${hub.name}`.toLowerCase().includes(normalizedQuery));
  const metrics = useMemo(() => ({
    utilization: fleetId === "bellandur" ? "74%" : "68%",
    rides: fleetId === "bellandur" ? "2,146" : "1,284",
    compliance: fleetId === "bellandur" ? "98%" : "97%",
    maintenance: fleetId === "bellandur" ? "$4,820" : "$3,640",
  }), [fleetId]);

  return <div className="space-y-5">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><ReportMetric icon={<Gauge className="h-4 w-4" />} label="Fleet utilization" value={metrics.utilization} tone="text-[var(--ms-accent-strong)]" /><ReportMetric icon={<FileText className="h-4 w-4" />} label="Completed rides" value={metrics.rides} tone="text-[#69a7de]" /><ReportMetric icon={<ShieldCheck className="h-4 w-4" />} label="Zone compliance" value={metrics.compliance} tone="text-[#e6b542]" /><ReportMetric icon={<Wrench className="h-4 w-4" />} label="Maintenance cost" value={metrics.maintenance} tone="text-[#b486e8]" /></div>
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-4">
      <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ms-accent-soft)] text-[var(--ms-accent)]"><FileText className="h-4 w-4" /></span><div><p className="text-sm font-semibold">{reportType}</p><p className="mt-1 text-[11px] text-[var(--ms-muted)]">{fleet.name} fleet · {range} · Generated just now</p></div></div>
      <div className="flex flex-wrap items-center gap-2"><ReportTypeDropdown label="Report" value={reportType} onChange={setReportType} options={reportTypes} /><ReportTypeDropdown label="Range" value={range} onChange={setRange} options={ranges} /><button className="ms-primary-button"><Download className="h-3.5 w-3.5" /> Export report</button></div>
    </div>
    <ReportContent reportType={reportType} hubs={filteredHubs} vehicles={filteredVehicles} />
  </div>;
}

function ReportContent({ reportType, hubs, vehicles }: { reportType: string; hubs: typeof allHubs; vehicles: typeof allVehicles }) {
  if (reportType === "Hub performance") {
    return <ReportTable title="Hub performance detail" description="Availability, utilization, and trip activity by operating hub." headers={["Hub", "Vehicles", "Capacity", "Utilization", "Trips", "Avg battery", "Status"]} rows={hubs.map((hub) => [<div><p className="font-medium text-[var(--ms-body)]">{hub.name}</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">{hub.id}</p></div>, hub.available, hub.capacity, `${hub.utilization}%`, hub.trips, `${hub.battery}%`, <Status label={hub.state === "critical" ? "At risk" : hub.state} />])} />;
  }

  if (reportType === "Charging and battery") {
    const rows = [...vehicles].sort((a, b) => a.battery - b.battery).map((vehicle) => [<span className="font-medium text-[var(--ms-body)]">{vehicle.id}</span>, vehicle.hub, <span className={vehicle.battery < 30 ? "text-[#ef655a]" : vehicle.battery < 60 ? "text-[#e6b542]" : "text-[#4bdc8b]"}>{vehicle.battery}%</span>, <Status label={vehicle.status} />, vehicle.battery < 30 ? "Priority charge" : vehicle.status === "Charging" ? "Charging now" : "Ready"]);
    return <ReportTable title="Charging and battery report" description="Battery readiness and charging priority across fleet vehicles." headers={["Vehicle", "Hub", "Battery", "Status", "Readiness"]} rows={rows} />;
  }

  if (reportType === "Maintenance costs") {
    const rows = vehicles.filter((vehicle) => vehicle.status === "Maintenance" || vehicle.status === "Offline" || vehicle.battery < 30).map((vehicle, index) => [<span className="font-medium text-[var(--ms-body)]">{vehicle.id}</span>, vehicle.hub, vehicle.status === "Offline" ? "Battery failure" : vehicle.battery < 30 ? "Low battery inspection" : "Brake inspection", <Status label={vehicle.status === "Offline" ? "Critical" : "Open"} />, `$${(680 + index * 245).toLocaleString()}`, index % 2 === 0 ? "Unassigned" : "Field team A"]);
    return <ReportTable title="Maintenance cost report" description="Open work orders, estimated cost, and ownership for this fleet." headers={["Vehicle", "Hub", "Issue", "Priority", "Estimated cost", "Assigned to"]} rows={rows.length ? rows : [["No open work orders", "—", "—", <Status label="Clear" />, "$0", "—"]]} />;
  }

  return <ReportTable title="Fleet performance detail" description="Vehicle-level activity, availability, and utilization for the selected period." headers={["Vehicle", "Type", "Hub", "Battery", "Status", "Trips", "Last activity"]} rows={vehicles.map((vehicle) => [<span className="font-medium text-[var(--ms-body)]">{vehicle.id}</span>, vehicle.type, vehicle.hub, `${vehicle.battery}%`, <Status label={vehicle.status} />, vehicle.trips, vehicle.lastActivity])} />;
}

function ReportTable({ title, description, headers, rows }: ReportTableProps) {
  return <section className="rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-5"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-[11px] text-[var(--ms-muted)]">{description}</p></div><button className="ms-control"><Download className="h-3.5 w-3.5" /> Download CSV</button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-xs"><thead><tr className="border-b border-[var(--ms-border)] text-[10px] uppercase tracking-[0.1em] text-[var(--ms-muted)]">{headers.map((header) => <th key={header} className="px-3 pb-3 font-medium">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-b border-[var(--ms-border)] last:border-0"><>{row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-3 text-[var(--ms-muted)]">{cell}</td>)}</></tr>)}</tbody></table></div><p className="mt-4 text-[10px] text-[var(--ms-muted)]">{rows.length} records · {title} · Updated just now</p></section>;
}

function ReportMetric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: string }) { return <div className="min-h-[108px] rounded-xl border border-[var(--ms-border)] bg-[var(--ms-panel)] p-4"><span className={tone}>{icon}</span><p className={`mt-4 text-2xl font-semibold ${tone}`}>{value}</p><p className="mt-1 text-[10px] text-[var(--ms-muted)]">{label}</p></div>; }

function ReportTypeDropdown({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  return <div className="relative"><span className="sr-only">{label}</span><button type="button" aria-label={`Select ${label.toLowerCase()}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="flex h-9 min-w-[126px] items-center justify-between gap-2 rounded-md border border-[var(--ms-border)] bg-[var(--ms-bg)] px-2.5 text-[10px] font-semibold text-[var(--ms-body)] transition hover:border-[var(--ms-accent-strong)] hover:bg-[var(--ms-hover)]"><span>{value}</span><ChevronDown aria-hidden="true" className={`h-3 w-3 text-[var(--ms-muted)] transition-transform ${open ? "rotate-180" : ""}`} /></button>{open && <div role="listbox" aria-label={label} className="ms-popover right-0 top-11 min-w-full"><p className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-muted)]">{label}</p>{options.map((option) => <button key={option} type="button" role="option" aria-selected={option === value} onClick={() => { onChange(option); setOpen(false); }} className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[10px] transition ${option === value ? "bg-[var(--ms-accent-soft)] text-[var(--ms-accent)]" : "text-[var(--ms-body)] hover:bg-[var(--ms-hover)]"}`}><span>{option}</span>{option === value && <Check aria-hidden="true" className="h-3 w-3" />}</button>)}</div>}</div>;
}

function Status({ label }: { label: string }) { const lower = label.toLowerCase(); const tone = lower.includes("critical") || lower.includes("offline") || lower.includes("maintenance") || lower.includes("open") || lower.includes("at risk") ? "status-red" : lower.includes("low") || lower.includes("warning") ? "status-amber" : lower.includes("charging") ? "status-blue" : "status-green"; return <span className={`ms-status ${tone}`}>{label}</span>; }
