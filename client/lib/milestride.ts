export type HubState = "healthy" | "warning" | "critical";
export type VehicleState = "Moving" | "Stationed" | "Charging" | "Low battery" | "Maintenance" | "Offline";

export type Hub = {
  id: string;
  name: string;
  available: number;
  capacity: number;
  utilization: number;
  trips: number;
  battery: number;
  x: number;
  y: number;
  state: HubState;
};

export type Vehicle = {
  id: string;
  type: "E-bike" | "Scooter";
  hub: string;
  battery: number;
  status: VehicleState;
  trips: number;
  distance: string;
  lastActivity: string;
  x: number;
  y: number;
};

export const hubs: Hub[] = [
  { id: "H-01", name: "Global Tech Park", available: 12, capacity: 30, utilization: 62, trips: 284, battery: 76, x: 68, y: 22, state: "healthy" },
  { id: "H-02", name: "University Campus", available: 10, capacity: 25, utilization: 40, trips: 145, battery: 49, x: 34, y: 39, state: "healthy" },
  { id: "H-03", name: "Shopping Complex", available: 2, capacity: 20, utilization: 90, trips: 392, battery: 31, x: 24, y: 60, state: "critical" },
  { id: "H-04", name: "Metro Station", available: 6, capacity: 18, utilization: 68, trips: 218, battery: 64, x: 66, y: 76, state: "warning" },
];

export const vehicles: Vehicle[] = [
  { id: "E-Bike V1", type: "E-bike", hub: "Global Tech Park", battery: 82, status: "Moving", trips: 132, distance: "284.4 km", lastActivity: "Now", x: 73, y: 29 },
  { id: "E-Bike V2", type: "E-bike", hub: "University Campus", battery: 64, status: "Stationed", trips: 91, distance: "190.2 km", lastActivity: "8m ago", x: 36, y: 42 },
  { id: "E-Bike V3", type: "E-bike", hub: "Global Tech Park", battery: 18, status: "Low battery", trips: 201, distance: "451.1 km", lastActivity: "4m ago", x: 70, y: 24 },
  { id: "E-Bike V4", type: "E-bike", hub: "Shopping Complex", battery: 22, status: "Maintenance", trips: 54, distance: "118.7 km", lastActivity: "24m ago", x: 26, y: 63 },
  { id: "Scooter V1", type: "Scooter", hub: "Metro Station", battery: 71, status: "Moving", trips: 168, distance: "322.8 km", lastActivity: "Now", x: 59, y: 69 },
  { id: "Scooter V2", type: "Scooter", hub: "Metro Station", battery: 18, status: "Charging", trips: 110, distance: "206.4 km", lastActivity: "2m ago", x: 69, y: 79 },
  { id: "Scooter V3", type: "Scooter", hub: "University Campus", battery: 91, status: "Stationed", trips: 87, distance: "173.9 km", lastActivity: "12m ago", x: 31, y: 36 },
  { id: "Scooter V4", type: "Scooter", hub: "Shopping Complex", battery: 9, status: "Offline", trips: 42, distance: "88.2 km", lastActivity: "1h ago", x: 21, y: 57 },
];

export const navItems = [
  { label: "Overview", path: "/overview" },
  { label: "Fleet", path: "/fleet" },
  { label: "Vehicles", path: "/vehicles" },
  { label: "Hubs", path: "/hubs" },
  { label: "Alerts", path: "/alerts", badge: "3" },
  { label: "Geofencing", path: "/geofencing", badge: "1" },
  { label: "Charging", path: "/charging", badge: "6" },
  { label: "Maintenance", path: "/maintenance" },
  { label: "Reports", path: "/reports" },
];

export const alerts = [
  { title: "Low battery", detail: "E-Bike V3 has low battery (18%)", severity: "High", time: "4m ago" },
  { title: "Battery charging", detail: "Scooter V2 charging interrupted", severity: "Medium", time: "10m ago" },
  { title: "Offline", detail: "Scooter V4 reported a battery failure", severity: "Critical", time: "15m ago" },
];
