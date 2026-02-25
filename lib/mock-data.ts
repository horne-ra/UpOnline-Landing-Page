// ============================================
// UpOnline — Centralized Mock Data
// All data is internally consistent across routes
// ============================================

// --- RACK DATA ---
export interface RackData {
  id: string
  row: string
  position: number
  inletTemp: number
  powerDraw: number
  gpuCount: number
  thermalMargin: number
  riskScore: number
  coolingZone: string
  pdu: string
}

export const racks: RackData[] = [
  { id: "A1", row: "A", position: 1, inletTemp: 30.1, powerDraw: 14.2, gpuCount: 8, thermalMargin: 22, riskScore: 12, coolingZone: "Zone A", pdu: "PDU-A1" },
  { id: "A2", row: "A", position: 2, inletTemp: 31.4, powerDraw: 15.8, gpuCount: 8, thermalMargin: 18, riskScore: 34, coolingZone: "Zone A", pdu: "PDU-A2" },
  { id: "A3", row: "A", position: 3, inletTemp: 29.8, powerDraw: 12.1, gpuCount: 8, thermalMargin: 24, riskScore: 8, coolingZone: "Zone A", pdu: "PDU-A3" },
  { id: "A4", row: "A", position: 4, inletTemp: 30.5, powerDraw: 13.6, gpuCount: 8, thermalMargin: 21, riskScore: 15, coolingZone: "Zone A", pdu: "PDU-A4" },
  { id: "B1", row: "B", position: 1, inletTemp: 32.8, powerDraw: 16.4, gpuCount: 10, thermalMargin: 14, riskScore: 28, coolingZone: "Zone B", pdu: "PDU-B1" },
  { id: "B2", row: "B", position: 2, inletTemp: 33.2, powerDraw: 17.1, gpuCount: 10, thermalMargin: 12, riskScore: 32, coolingZone: "Zone B", pdu: "PDU-B2" },
  { id: "B3", row: "B", position: 3, inletTemp: 38.4, powerDraw: 19.8, gpuCount: 10, thermalMargin: 6, riskScore: 82, coolingZone: "Zone B", pdu: "PDU-B3" },
  { id: "B4", row: "B", position: 4, inletTemp: 36.8, powerDraw: 18.9, gpuCount: 10, thermalMargin: 9, riskScore: 61, coolingZone: "Zone B", pdu: "PDU-B4" },
  { id: "C1", row: "C", position: 1, inletTemp: 29.2, powerDraw: 10.4, gpuCount: 8, thermalMargin: 26, riskScore: 6, coolingZone: "Zone A", pdu: "PDU-C1" },
  { id: "C2", row: "C", position: 2, inletTemp: 30.8, powerDraw: 11.2, gpuCount: 8, thermalMargin: 20, riskScore: 18, coolingZone: "Zone A", pdu: "PDU-C2" },
  { id: "C3", row: "C", position: 3, inletTemp: 29.6, powerDraw: 10.8, gpuCount: 8, thermalMargin: 25, riskScore: 9, coolingZone: "Zone A", pdu: "PDU-C3" },
  { id: "C4", row: "C", position: 4, inletTemp: 30.2, powerDraw: 11.5, gpuCount: 8, thermalMargin: 22, riskScore: 14, coolingZone: "Zone A", pdu: "PDU-C4" },
]

// --- THERMAL CHART DATA (4h, 15-min intervals) ---
export const thermalChartData = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const min = (i % 4) * 15
  const time = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`
  const base = 33.5
  // Spike near 2h mark (index 8)
  const spike = i === 7 ? 4.2 : i === 8 ? 4.8 : i === 9 ? 3.1 : 0
  const noise = Math.sin(i * 0.8) * 1.2 + Math.cos(i * 0.3) * 0.8
  return {
    time,
    avgTemp: Math.round((base + noise + spike) * 10) / 10,
    coolingThreshold: 38,
  }
})

// --- GPU CLUSTERS ---
export interface GpuCluster {
  name: string
  nodeCount: number
  gpuModel: string
  avgUtilization: number
  thermalAnomalies: number
  driverDrift: boolean
  driftNodeCount: number
  nvlinkHealth: number
  readiness: "Ready" | "Degraded" | "Not Ready"
  rackAssignment: string[]
}

export const gpuClusters: GpuCluster[] = [
  {
    name: "train-cluster-alpha",
    nodeCount: 12,
    gpuModel: "H100 SXM",
    avgUtilization: 87,
    thermalAnomalies: 0,
    driverDrift: false,
    driftNodeCount: 0,
    nvlinkHealth: 99.1,
    readiness: "Ready",
    rackAssignment: ["A1", "A2", "A3", "A4"],
  },
  {
    name: "train-cluster-beta",
    nodeCount: 10,
    gpuModel: "H100 SXM",
    avgUtilization: 91,
    thermalAnomalies: 2,
    driverDrift: true,
    driftNodeCount: 3,
    nvlinkHealth: 96.8,
    readiness: "Degraded",
    rackAssignment: ["B1", "B2", "B3", "B4"],
  },
  {
    name: "inference-cluster-gamma",
    nodeCount: 8,
    gpuModel: "A100 80GB",
    avgUtilization: 62,
    thermalAnomalies: 0,
    driverDrift: false,
    driftNodeCount: 0,
    nvlinkHealth: 99.5,
    readiness: "Ready",
    rackAssignment: ["C1", "C2", "C3", "C4"],
  },
]

// --- GPU NODES ---
export interface GpuNode {
  hostname: string
  cluster: string
  gpuTemp: number
  utilization: number
  memoryUsage: number
  status: "Healthy" | "Warning" | "Critical"
  rack: string
}

const alphaNodes: GpuNode[] = Array.from({ length: 12 }, (_, i) => ({
  hostname: `alpha-node-${String(i + 1).padStart(2, "0")}`,
  cluster: "train-cluster-alpha",
  gpuTemp: 62 + Math.floor(Math.random() * 8),
  utilization: 82 + Math.floor(Math.random() * 12),
  memoryUsage: 70 + Math.floor(Math.random() * 18),
  status: "Healthy" as const,
  rack: `A${(i % 4) + 1}`,
}))

const betaNodes: GpuNode[] = Array.from({ length: 10 }, (_, i) => {
  const isAnomaly = i === 6 || i === 7 // gpu-07, gpu-08
  return {
    hostname: `beta-node-${String(i + 1).padStart(2, "0")}`,
    cluster: "train-cluster-beta",
    gpuTemp: isAnomaly ? 82 + Math.floor(Math.random() * 4) : 64 + Math.floor(Math.random() * 10),
    utilization: isAnomaly ? 58 + Math.floor(Math.random() * 8) : 88 + Math.floor(Math.random() * 10),
    memoryUsage: 72 + Math.floor(Math.random() * 20),
    status: isAnomaly ? "Warning" as const : "Healthy" as const,
    rack: `B${(i % 4) + 1}`,
  }
})

const gammaNodes: GpuNode[] = Array.from({ length: 8 }, (_, i) => ({
  hostname: `gamma-node-${String(i + 1).padStart(2, "0")}`,
  cluster: "inference-cluster-gamma",
  gpuTemp: 58 + Math.floor(Math.random() * 8),
  utilization: 55 + Math.floor(Math.random() * 15),
  memoryUsage: 45 + Math.floor(Math.random() * 20),
  status: "Healthy" as const,
  rack: `C${(i % 4) + 1}`,
}))

export const gpuNodes: Record<string, GpuNode[]> = {
  "train-cluster-alpha": alphaNodes,
  "train-cluster-beta": betaNodes,
  "inference-cluster-gamma": gammaNodes,
}

// --- CLUSTER THERMAL CHART DATA ---
export const clusterThermalData = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const min = (i % 4) * 15
  return {
    time: `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
    alpha: 64 + Math.sin(i * 0.5) * 2,
    beta: 68 + Math.sin(i * 0.7) * 3 + (i >= 7 && i <= 9 ? 8 : 0),
    gamma: 60 + Math.sin(i * 0.3) * 1.5,
  }
})

// --- ACTIVE RISKS ---
export interface ActiveRisk {
  id: string
  severity: "Critical" | "Warning" | "Info"
  type: string
  location: string
  riskScore: number
  trend: "up" | "down" | "stable"
  lastUpdated: string
}

export const activeRisks: ActiveRisk[] = [
  { id: "RSK-001", severity: "Critical", type: "Thermal exceedance", location: "Rack B3", riskScore: 82, trend: "up", lastUpdated: "2 min ago" },
  { id: "RSK-002", severity: "Warning", type: "Power headroom low", location: "Rack B4", riskScore: 61, trend: "up", lastUpdated: "5 min ago" },
  { id: "RSK-003", severity: "Warning", type: "GPU thermal throttling", location: "beta-node-07 gpu-07", riskScore: 58, trend: "stable", lastUpdated: "8 min ago" },
  { id: "RSK-004", severity: "Info", type: "Load volatility elevated", location: "Rack A2", riskScore: 34, trend: "down", lastUpdated: "12 min ago" },
  { id: "RSK-005", severity: "Info", type: "Cooling margin narrowing", location: "Row B zone", riskScore: 31, trend: "stable", lastUpdated: "15 min ago" },
]

// --- PENDING CHANGES ---
export interface PendingChange {
  changeId: string
  type: string
  target: string
  requestedBy: string
  status: "Pending" | "Passed" | "Failed"
}

export const pendingChanges: PendingChange[] = [
  { changeId: "CHG-0091", type: "Add 4x H100 nodes", target: "Rack A3", requestedBy: "J. Martinez", status: "Pending" },
  { changeId: "CHG-0088", type: "Firmware update", target: "train-cluster-alpha", requestedBy: "S. Chen", status: "Passed" },
  { changeId: "CHG-0085", type: "Migrate workload", target: "Rack C2 → C4", requestedBy: "K. Okafor", status: "Failed" },
]

// --- TRAINING JOBS ---
export interface TrainingJob {
  name: string
  cluster: string
  gpuCount: number
  totalGpus: number
  status: "Running" | "Queued" | "At Risk"
  infraRisk: "None" | "Low" | "Medium" | "High"
  estCompletion: string
  slowdownRisk: number
  rootCause?: string
  affectedGpus?: number
  estimatedSlowdown?: string
}

export const trainingJobs: TrainingJob[] = [
  {
    name: "llm-pretrain-7b-run-042",
    cluster: "train-cluster-beta",
    gpuCount: 80,
    totalGpus: 80,
    status: "At Risk",
    infraRisk: "High",
    estCompletion: "~18h remaining",
    slowdownRisk: 15,
    rootCause: "Rack B3 thermal exceedance — GPU throttling on 4 nodes",
    affectedGpus: 8,
    estimatedSlowdown: "12–18%",
  },
  {
    name: "embeddings-finetune-019",
    cluster: "train-cluster-beta",
    gpuCount: 16,
    totalGpus: 16,
    status: "At Risk",
    infraRisk: "Medium",
    estCompletion: "~6h remaining",
    slowdownRisk: 6,
    rootCause: "Rack B4 power headroom narrowing",
    affectedGpus: 2,
    estimatedSlowdown: "5–8%",
  },
  {
    name: "vision-transformer-v3",
    cluster: "train-cluster-alpha",
    gpuCount: 32,
    totalGpus: 32,
    status: "Running",
    infraRisk: "None",
    estCompletion: "~12h remaining",
    slowdownRisk: 0,
  },
  {
    name: "rl-agent-reward-model",
    cluster: "train-cluster-alpha",
    gpuCount: 16,
    totalGpus: 16,
    status: "Running",
    infraRisk: "Low",
    estCompletion: "~4h remaining",
    slowdownRisk: 2,
  },
  {
    name: "speech-recognition-ft",
    cluster: "inference-cluster-gamma",
    gpuCount: 8,
    totalGpus: 8,
    status: "Running",
    infraRisk: "None",
    estCompletion: "~2h remaining",
    slowdownRisk: 0,
  },
  {
    name: "code-gen-13b-run-007",
    cluster: "train-cluster-alpha",
    gpuCount: 48,
    totalGpus: 48,
    status: "Queued",
    infraRisk: "None",
    estCompletion: "Queued",
    slowdownRisk: 0,
  },
]

// --- TOPOLOGY: Power ---
export const powerTopology = {
  utilityFeed: { name: "Utility Feed A", load: "186 kW", status: "Online" as const },
  ats: { name: "ATS-1", load: "186 kW", status: "Online" as const },
  ups: [
    { name: "UPS-1", load: "94 kW", capacity: "120 kW", status: "Online" as const },
    { name: "UPS-2", load: "92 kW", capacity: "120 kW", status: "Online" as const },
  ],
  pdus: [
    { name: "PDU-A1", load: "14.2 kW", capacity: "20 kW", status: "Online" as const, racks: ["A1"] },
    { name: "PDU-A2", load: "15.8 kW", capacity: "20 kW", status: "Online" as const, racks: ["A2"] },
    { name: "PDU-A3", load: "12.1 kW", capacity: "20 kW", status: "Online" as const, racks: ["A3"] },
    { name: "PDU-A4", load: "13.6 kW", capacity: "20 kW", status: "Online" as const, racks: ["A4"] },
    { name: "PDU-B1", load: "16.4 kW", capacity: "20 kW", status: "Online" as const, racks: ["B1"] },
    { name: "PDU-B2", load: "17.1 kW", capacity: "20 kW", status: "Online" as const, racks: ["B2"] },
    { name: "PDU-B3", load: "19.8 kW", capacity: "20 kW", status: "Degraded" as const, racks: ["B3"] },
    { name: "PDU-B4", load: "18.9 kW", capacity: "20 kW", status: "Online" as const, racks: ["B4"] },
  ],
}

// --- TOPOLOGY: Cooling Zones ---
export interface CoolingZone {
  name: string
  crahUnits: { name: string; airflow: string; setpoint: number; actualTemp: number; status: "Online" | "Degraded" }[]
  racks: string[]
  margin: number
}

export const coolingZones: CoolingZone[] = [
  {
    name: "Zone A",
    crahUnits: [
      { name: "CRAH-1", airflow: "12,400 CFM", setpoint: 22, actualTemp: 22.8, status: "Online" },
      { name: "CRAH-2", airflow: "12,200 CFM", setpoint: 22, actualTemp: 23.1, status: "Online" },
    ],
    racks: ["A1", "A2", "A3", "A4", "C1", "C2", "C3", "C4"],
    margin: 28,
  },
  {
    name: "Zone B",
    crahUnits: [
      { name: "CRAH-3", airflow: "11,800 CFM", setpoint: 22, actualTemp: 24.6, status: "Online" },
      { name: "CRAH-4", airflow: "10,200 CFM", setpoint: 22, actualTemp: 26.2, status: "Degraded" },
    ],
    racks: ["B1", "B2", "B3", "B4"],
    margin: 8,
  },
]

// --- KPI SPARKLINE DATA ---
export const thermalSparkline = [28, 30, 31, 29, 32, 33, 34, 33, 35, 37, 36, 34]
export const powerSparkline = [88, 87, 88, 89, 88, 88, 87, 88, 88, 89, 88, 88]
export const gpuHealthSparkline = [95.1, 95.0, 94.8, 94.9, 94.6, 94.2, 94.4, 94.2, 94.3, 94.2, 94.1, 94.2]
