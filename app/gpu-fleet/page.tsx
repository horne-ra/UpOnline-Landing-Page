"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  gpuClusters,
  gpuNodes,
  clusterThermalData,
  type GpuCluster,
} from "@/lib/mock-data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function ReadinessBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Ready: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Degraded: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "Not Ready": "bg-red-500/15 text-red-400 border-red-500/30",
  }
  return (
    <Badge variant="outline" className={styles[status] || ""}>
      {status}
    </Badge>
  )
}

function UtilizationBar({ value }: { value: number }) {
  const barColor =
    value > 90
      ? "bg-red-500"
      : value >= 80
        ? "bg-amber-500"
        : "bg-emerald-500"
  const textColor =
    value > 90
      ? "text-red-400"
      : value >= 80
        ? "text-amber-400"
        : "text-emerald-400"

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-secondary">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`font-mono text-[12px] font-medium ${textColor}`}>
        {value}%
      </span>
    </div>
  )
}

function NodeStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Healthy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Critical: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  return (
    <Badge variant="outline" className={styles[status] || ""}>
      {status}
    </Badge>
  )
}

function ClusterDrawer({
  cluster,
  open,
  onClose,
}: {
  cluster: GpuCluster | null
  open: boolean
  onClose: () => void
}) {
  if (!cluster) return null
  const nodes = gpuNodes[cluster.name] || []
  const thermalKey = cluster.name.includes("alpha")
    ? "alpha"
    : cluster.name.includes("beta")
      ? "beta"
      : "gamma"

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[520px] overflow-y-auto border-border bg-card sm:max-w-[520px]"
      >
        <SheetHeader className="pb-2">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-foreground">
              {cluster.name}
            </SheetTitle>
            <ReadinessBadge status={cluster.readiness} />
          </div>
          <SheetDescription className="text-muted-foreground">
            {cluster.nodeCount} nodes · {cluster.gpuModel} ·{" "}
            {cluster.avgUtilization}% avg utilization
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="nodes" className="mt-4">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="nodes" className="flex-1 text-xs">
              Nodes
            </TabsTrigger>
            <TabsTrigger value="thermals" className="flex-1 text-xs">
              Thermals
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1 text-xs">
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nodes" className="mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] text-muted-foreground">
                    Hostname
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    GPU Temp
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Util %
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Memory
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes.map((node, i) => (
                  <TableRow
                    key={node.hostname}
                    className={`border-border ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}
                  >
                    <TableCell className="font-mono text-[12px] text-foreground">
                      {node.hostname}
                    </TableCell>
                    <TableCell
                      className={`font-mono text-[12px] ${node.gpuTemp > 78 ? "text-amber-400" : "text-muted-foreground"}`}
                    >
                      {node.gpuTemp}°C
                    </TableCell>
                    <TableCell className="font-mono text-[12px] text-muted-foreground">
                      {node.utilization}%
                    </TableCell>
                    <TableCell className="font-mono text-[12px] text-muted-foreground">
                      {node.memoryUsage}%
                    </TableCell>
                    <TableCell>
                      <NodeStatusBadge status={node.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="thermals" className="mt-3">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={clusterThermalData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    axisLine={{ stroke: "#3f3f46" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[55, 85]}
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    axisLine={{ stroke: "#3f3f46" }}
                    tickLine={false}
                    tickFormatter={(v) => `${v}°C`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#fafafa",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={thermalKey}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Cluster average GPU temperature over 4 hours
            </p>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-3 space-y-3">
            {cluster.thermalAnomalies > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/5 p-4">
                <p className="text-[13px] font-medium text-foreground">
                  Migrate workload from node gpu-07
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Thermal threshold approaching on this node. Recommend
                  migration to lower-load rack.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-7 border-amber-500/30 text-[11px] text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                >
                  Simulate Impact
                </Button>
              </Card>
            )}
            {cluster.driverDrift && (
              <Card className="border-primary/30 bg-primary/5 p-4">
                <p className="text-[13px] font-medium text-foreground">
                  Schedule driver update for {cluster.driftNodeCount} nodes
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Driver drift detected. Recommend scheduling update during
                  maintenance window.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-7 border-primary/30 text-[11px] text-primary hover:bg-primary/10"
                >
                  Create Change Request
                </Button>
              </Card>
            )}
            {!cluster.thermalAnomalies && !cluster.driverDrift && (
              <div className="py-8 text-center text-[13px] text-muted-foreground">
                No active recommendations for this cluster.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

export default function GpuFleetPage() {
  const [selectedCluster, setSelectedCluster] = useState<GpuCluster | null>(
    null
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            GPU Fleet Intelligence
          </h1>
          <p className="text-[13px] text-muted-foreground">
            3 clusters · 312 GPUs · 94.2% healthy
          </p>
        </div>

        <Card className="border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] text-muted-foreground">
                  Cluster Name
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Nodes
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  GPU Model
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Avg Util %
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Thermal Anomalies
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Driver Drift
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  NVLink Health
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Readiness
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gpuClusters.map((cluster, i) => (
                <TableRow
                  key={cluster.name}
                  className={`cursor-pointer border-border transition-colors hover:bg-secondary/50 ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}
                  onClick={() => setSelectedCluster(cluster)}
                >
                  <TableCell className="font-mono text-[13px] font-medium text-primary">
                    {cluster.name}
                  </TableCell>
                  <TableCell className="font-mono text-[13px] text-foreground">
                    {cluster.nodeCount}
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">
                    {cluster.gpuModel}
                  </TableCell>
                  <TableCell>
                    <UtilizationBar value={cluster.avgUtilization} />
                  </TableCell>
                  <TableCell>
                    {cluster.thermalAnomalies > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-red-500/15 text-red-400 border-red-500/30"
                      >
                        {cluster.thermalAnomalies}
                      </Badge>
                    ) : (
                      <span className="text-[13px] text-muted-foreground">
                        0
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {cluster.driverDrift ? (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/15 text-amber-400 border-amber-500/30"
                      >
                        Yes ({cluster.driftNodeCount})
                      </Badge>
                    ) : (
                      <span className="text-[13px] text-muted-foreground">
                        No
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-[13px] text-foreground">
                    {cluster.nvlinkHealth}%
                  </TableCell>
                  <TableCell>
                    <ReadinessBadge status={cluster.readiness} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        {/* Fleet Health Summary */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Fleet Health Summary
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border bg-card p-4" style={{ borderLeft: "4px solid #ef4444" }}>
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Thermal Anomalies
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-red-400">2</p>
            </Card>
            <Card className="border-border bg-card p-4" style={{ borderLeft: "4px solid #f59e0b" }}>
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Nodes with Driver Drift
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-400">3</p>
            </Card>
            <Card className="border-border bg-card p-4" style={{ borderLeft: "4px solid #10b981" }}>
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Average NVLink Health
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">98.5%</p>
            </Card>
          </div>
        </div>
      </div>

      <ClusterDrawer
        cluster={selectedCluster}
        open={!!selectedCluster}
        onClose={() => setSelectedCluster(null)}
      />
    </DashboardLayout>
  )
}
