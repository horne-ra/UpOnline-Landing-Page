"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { racks, powerTopology, coolingZones, type RackData } from "@/lib/mock-data"
import Link from "next/link"
import {
  ArrowDown,
  Upload,
  Check,
  Network,
} from "lucide-react"

function RiskScoreBadge({ score }: { score: number }) {
  if (score >= 60)
    return (
      <Badge
        variant="outline"
        className="bg-red-500/15 text-red-400 border-red-500/30 font-mono"
      >
        {score}
      </Badge>
    )
  if (score >= 30)
    return (
      <Badge
        variant="outline"
        className="bg-amber-500/15 text-amber-400 border-amber-500/30 font-mono"
      >
        {score}
      </Badge>
    )
  return (
    <Badge
      variant="outline"
      className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-mono"
    >
      {score}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Online: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Degraded: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  }
  return (
    <Badge variant="outline" className={styles[status] || ""}>
      {status}
    </Badge>
  )
}

function getTempColor(temp: number) {
  if (temp > 37) return "text-red-400"
  if (temp >= 33) return "text-amber-400"
  return "text-emerald-400"
}

function getRackSeverityStyles(score: number) {
  if (score >= 80)
    return "bg-red-950/30 border-red-700/50"
  if (score >= 60)
    return "bg-amber-950/30 border-amber-700/50"
  if (score >= 40)
    return "bg-amber-950/20 border-amber-800/50"
  return "bg-card border-border"
}

function getMarginColor(margin: number) {
  if (margin < 10) return "text-red-500"
  if (margin <= 20) return "text-amber-500"
  return "text-emerald-500"
}

// --- Tab: Rack Layout ---
function RackLayoutTab() {
  const [selectedRack, setSelectedRack] = useState<RackData | null>(null)
  const rows = ["A", "B", "C"]
  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => (
        <div key={row}>
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Row {row}
          </span>
          <div className="grid grid-cols-4 gap-3">
            {racks
              .filter((r) => r.row === row)
              .map((rack) => {
                const isSelected = selectedRack?.id === rack.id
                return (
                  <Card
                    key={rack.id}
                    className={`cursor-pointer p-3 transition-all hover:ring-1 hover:ring-border ${getRackSeverityStyles(rack.riskScore)} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() =>
                      setSelectedRack(isSelected ? null : rack)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {rack.id}
                      </span>
                      <RiskScoreBadge score={rack.riskScore} />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">
                          GPUs
                        </span>
                        <span className="font-mono text-[12px] text-foreground">
                          {rack.gpuCount}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">
                          Power
                        </span>
                        <span className="font-mono text-[12px] text-foreground">
                          {rack.powerDraw} kW
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">
                          Inlet
                        </span>
                        <span
                          className={`font-mono text-[12px] font-medium ${getTempColor(rack.inletTemp)}`}
                        >
                          {rack.inletTemp}°C
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">
                          Margin
                        </span>
                        <span className={`font-mono text-[12px] font-medium ${getMarginColor(rack.thermalMargin)}`}>
                          {rack.thermalMargin}%
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
          </div>
        </div>
      ))}

      {/* Selected Rack Detail Panel */}
      {selectedRack && (
        <Card className="border-blue-500/30 bg-blue-500/5 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {selectedRack.id} — Detail
              </h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Selected rack breakdown
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-primary/30 text-[11px] text-primary hover:bg-primary/10"
              asChild
            >
              <Link href="/change-validator">View in Change Validator</Link>
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Risk Score
              </span>
              <span className={`font-mono text-lg font-bold ${selectedRack.riskScore >= 60 ? "text-red-400" : selectedRack.riskScore >= 30 ? "text-amber-400" : "text-emerald-400"}`}>
                {selectedRack.riskScore}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Power Draw
              </span>
              <span className="font-mono text-lg font-bold text-foreground">
                {selectedRack.powerDraw} kW
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Connected PDU
              </span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {selectedRack.pdu}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Cooling Zone
              </span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {selectedRack.coolingZone}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// --- Tab: Power Mapping ---
function PowerMappingTab() {
  const { utilityFeed, ats, ups, pdus } = powerTopology
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Utility Feed */}
      <Card className="w-64 border-border bg-card p-3 text-center">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Utility Feed
        </span>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">
            {utilityFeed.name}
          </span>
          <StatusBadge status={utilityFeed.status} />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {utilityFeed.load}
        </span>
      </Card>

      <ArrowDown className="size-4 text-muted-foreground" />

      {/* ATS */}
      <Card className="w-64 border-border bg-card p-3 text-center">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Automatic Transfer Switch
        </span>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">
            {ats.name}
          </span>
          <StatusBadge status={ats.status} />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {ats.load}
        </span>
      </Card>

      <ArrowDown className="size-4 text-muted-foreground" />

      {/* UPS Units */}
      <div className="flex gap-4">
        {ups.map((u) => (
          <Card
            key={u.name}
            className="w-56 border-border bg-card p-3 text-center"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              UPS
            </span>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground">
                {u.name}
              </span>
              <StatusBadge status={u.status} />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {u.load} / {u.capacity}
            </span>
            {/* Capacity bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{
                  width: `${(parseFloat(u.load) / parseFloat(u.capacity)) * 100}%`,
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <ArrowDown className="size-4 text-muted-foreground" />

      {/* PDUs */}
      <div className="grid grid-cols-4 gap-3">
        {pdus.map((pdu) => {
          const loadPct =
            (parseFloat(pdu.load) / parseFloat(pdu.capacity)) * 100
          return (
            <Card
              key={pdu.name}
              className="border-border bg-card p-2.5 text-center"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="font-mono text-[12px] font-semibold text-foreground">
                  {pdu.name}
                </span>
                <StatusBadge status={pdu.status} />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {pdu.load} / {pdu.capacity}
              </span>
              <div className="mt-1.5 h-1 w-full rounded-full bg-secondary">
                <div
                  className={`h-1 rounded-full ${loadPct > 90 ? "bg-red-500" : loadPct > 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${loadPct}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {pdu.racks.join(", ")}
              </span>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// --- Tab: Cooling Zones ---
function CoolingZonesTab() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {coolingZones.map((zone) => (
        <Card
          key={zone.name}
          className={`border-border bg-card p-4 ${zone.margin < 15 ? "ring-1 ring-amber-500/20" : ""}`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              {zone.name}
            </h4>
            <Badge
              variant="outline"
              className={
                zone.margin < 15
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              }
            >
              Margin: {zone.margin}%
            </Badge>
          </div>

          {/* CRAH units */}
          <div className="mt-3 flex flex-col gap-2">
            {zone.crahUnits.map((crah) => (
              <div
                key={crah.name}
                className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-medium text-foreground">
                    {crah.name}
                  </span>
                  <StatusBadge status={crah.status} />
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-muted-foreground">
                    Airflow:{" "}
                    <span className="font-mono text-foreground">
                      {crah.airflow}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Set:{" "}
                    <span className="font-mono text-foreground">
                      {crah.setpoint}°C
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Actual:{" "}
                    <span
                      className={`font-mono font-medium ${crah.actualTemp > crah.setpoint + 3 ? "text-amber-400" : "text-foreground"}`}
                    >
                      {crah.actualTemp}°C
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Racks */}
          <div className="mt-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Racks in Zone
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {zone.racks.map((rackId) => (
                <Badge
                  key={rackId}
                  variant="outline"
                  className="border-border bg-secondary/50 font-mono text-[11px] text-foreground"
                >
                  {rackId}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// --- Tab: Configure ---
function ConfigureTab() {
  const [validated, setValidated] = useState(false)

  const sampleMappings = [
    { rack: "A1", pdu: "PDU-A1", coolingZone: "Zone A", row: "A" },
    { rack: "A2", pdu: "PDU-A2", coolingZone: "Zone A", row: "A" },
    { rack: "B3", pdu: "PDU-B3", coolingZone: "Zone B", row: "B" },
    { rack: "B4", pdu: "PDU-B4", coolingZone: "Zone B", row: "B" },
    { rack: "C1", pdu: "PDU-C1", coolingZone: "Zone A", row: "C" },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Upload */}
      <Card className="border-border bg-card p-4">
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-border py-8">
          <Upload className="size-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-[13px] font-medium text-foreground">
              Upload Topology CSV
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Drag and drop or click to browse
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 border-border text-[11px] text-muted-foreground"
          >
            Browse Files
          </Button>
        </div>
        <div className="mt-3 rounded-md border border-border bg-secondary/30 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Expected CSV Format
          </p>
          <pre className="mt-1 font-mono text-[11px] text-muted-foreground">
            {`rack_id,row,position,pdu,cooling_zone,gpu_count\nA1,A,1,PDU-A1,Zone A,8\nB3,B,3,PDU-B3,Zone B,10`}
          </pre>
        </div>
      </Card>

      {/* Manual Mapping Table */}
      <Card className="border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h4 className="text-[13px] font-semibold text-foreground">
            Rack → PDU → Cooling Zone Mapping
          </h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] text-muted-foreground">
                Rack
              </TableHead>
              <TableHead className="text-[11px] text-muted-foreground">
                PDU
              </TableHead>
              <TableHead className="text-[11px] text-muted-foreground">
                Cooling Zone
              </TableHead>
              <TableHead className="text-[11px] text-muted-foreground">
                Row
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleMappings.map((m, i) => (
              <TableRow
                key={m.rack}
                className={`border-border ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}
              >
                <TableCell>
                  <Input
                    defaultValue={m.rack}
                    className="h-7 w-20 border-border bg-secondary font-mono text-[12px] text-foreground"
                  />
                </TableCell>
                <TableCell>
                  <Select defaultValue={m.pdu}>
                    <SelectTrigger className="h-7 w-28 border-border bg-secondary text-[12px] text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card text-foreground">
                      {powerTopology.pdus.map((p) => (
                        <SelectItem
                          key={p.name}
                          value={p.name}
                          className="text-[12px]"
                        >
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select defaultValue={m.coolingZone}>
                    <SelectTrigger className="h-7 w-28 border-border bg-secondary text-[12px] text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card text-foreground">
                      <SelectItem value="Zone A" className="text-[12px]">
                        Zone A
                      </SelectItem>
                      <SelectItem value="Zone B" className="text-[12px]">
                        Zone B
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="font-mono text-[12px] text-muted-foreground">
                  {m.row}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Validate */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setValidated(true)}
          className="h-8 bg-primary text-primary-foreground text-[12px] hover:bg-primary/90"
        >
          Validate Topology
        </Button>
        {validated && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
            <Check className="size-3.5 text-emerald-400" />
            <span className="text-[12px] text-emerald-400">
              Topology validated. 12 racks mapped. No orphaned assets detected.
            </span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Topology is cross-checked against live telemetry during calibration.
      </p>
    </div>
  )
}

export default function TopologyPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Network className="size-5 text-primary" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Data Center Topology
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Configured rack, power, and cooling zone mappings
            </p>
          </div>
        </div>

        <Tabs defaultValue="rack-layout">
          <TabsList className="bg-secondary">
            <TabsTrigger value="rack-layout" className="text-xs">
              Rack Layout
            </TabsTrigger>
            <TabsTrigger value="power-mapping" className="text-xs">
              Power Mapping
            </TabsTrigger>
            <TabsTrigger value="cooling-zones" className="text-xs">
              Cooling Zones
            </TabsTrigger>
            <TabsTrigger value="configure" className="text-xs">
              Configure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rack-layout">
            <RackLayoutTab />
          </TabsContent>
          <TabsContent value="power-mapping">
            <PowerMappingTab />
          </TabsContent>
          <TabsContent value="cooling-zones">
            <CoolingZonesTab />
          </TabsContent>
          <TabsContent value="configure">
            <ConfigureTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
