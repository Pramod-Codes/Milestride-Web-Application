export type HubState = "healthy" | "warning" | "critical";
export type VehicleState = "Moving" | "Stationed" | "Charging" | "Low battery" | "Maintenance" | "Offline";
export type FleetId = "electronics-city" | "bellandur";

export const fleetOptions: { id: FleetId; name: string; city: string; hubNames: string[] }[] = [
  { id: "electronics-city", name: "Electronics City", city: "Bengaluru", hubNames: ["Global Tech Park", "University Campus", "Shopping Complex", "Metro Station"] },
  { id: "bellandur", name: "Bellandur", city: "Bengaluru", hubNames: ["RMZ Ecospace", "Embassy TechVillage", "Prestige Tech Park", "Bellandur Lake Gate", "Outer Ring Road"] },
];

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

export const bellandurHubs: Hub[] = [
  { id: "B-01", name: "RMZ Ecospace", available: 18, capacity: 32, utilization: 78, trips: 412, battery: 83, x: 30, y: 28, state: "healthy" },
  { id: "B-02", name: "Embassy TechVillage", available: 16, capacity: 30, utilization: 73, trips: 368, battery: 79, x: 62, y: 25, state: "healthy" },
  { id: "B-03", name: "Prestige Tech Park", available: 14, capacity: 28, utilization: 81, trips: 451, battery: 72, x: 74, y: 54, state: "warning" },
  { id: "B-04", name: "Bellandur Lake Gate", available: 8, capacity: 16, utilization: 56, trips: 184, battery: 88, x: 34, y: 66, state: "healthy" },
  { id: "B-05", name: "Outer Ring Road", available: 10, capacity: 20, utilization: 69, trips: 297, battery: 67, x: 76, y: 78, state: "warning" },
];

export const bellandurVehicles: Vehicle[] = [
  { id: "E-Bike B11", type: "E-bike", hub: "RMZ Ecospace", battery: 86, status: "Moving", trips: 142, distance: "302.4 km", lastActivity: "Now", x: 32, y: 31 },
  { id: "E-Bike B12", type: "E-bike", hub: "Embassy TechVillage", battery: 74, status: "Stationed", trips: 116, distance: "244.2 km", lastActivity: "6m ago", x: 64, y: 28 },
  { id: "E-Bike B13", type: "E-bike", hub: "Prestige Tech Park", battery: 28, status: "Low battery", trips: 188, distance: "390.5 km", lastActivity: "5m ago", x: 72, y: 58 },
  { id: "E-Bike B14", type: "E-bike", hub: "Bellandur Lake Gate", battery: 66, status: "Charging", trips: 74, distance: "160.3 km", lastActivity: "3m ago", x: 38, y: 69 },
  { id: "Scooter B11", type: "Scooter", hub: "Outer Ring Road", battery: 59, status: "Moving", trips: 209, distance: "421.8 km", lastActivity: "Now", x: 73, y: 75 },
  { id: "Scooter B12", type: "Scooter", hub: "RMZ Ecospace", battery: 91, status: "Stationed", trips: 102, distance: "214.7 km", lastActivity: "11m ago", x: 27, y: 24 },
];

export const allHubs = [...hubs, ...bellandurHubs];
export const allVehicles = [...vehicles, ...bellandurVehicles];

export const navItems = [
  { label: "Overview", path: "/overview" },
  { label: "Analytics", path: "/analytics" },
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
