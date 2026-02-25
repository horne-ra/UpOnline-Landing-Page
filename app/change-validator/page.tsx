"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import { Check, AlertTriangle, Clock, ShieldCheck } from "lucide-react"

const rackOptions = [
  "A1",
  "A2",
  "A3",
  "A4",
  "B1",
  "B2",
  "B3",
  "B4",
  "C1",
  "C2",
  "C3",
  "C4",
]

const changeTypes = [
  "Add GPU Nodes",
  "Migrate Workload",
  "Firmware Update",
  "Decommission",
]

const constraintChecks = [
  {
    passed: true,
    label: "Rack power headroom: 4.2 kW available (need 3.0 kW)",
    status: "PASS",
  },
  {
    passed: true,
    label: "Cooling zone capacity: sufficient",
    status: "PASS",
  },
  {
    passed: false,
    isWarning: true,
    label: "Redundancy margin: N+1 maintained but reduced to 8%",
    status: "WARNING",
  },
  {
    passed: true,
    label: "No conflicting changes in scheduled window",
    status: "PASS",
  },
  {
    passed: true,
    label: "No at-risk training jobs on target rack",
    status: "PASS",
  },
]

const riskSimData = [
  {
    name: "Power Load",
    current: 14.2,
    projected: 17.2,
    max: 22,
    currentLabel: "14.2 kW",
    projectedLabel: "17.2 kW",
    maxLabel: "22 kW",
  },
  {
    name: "Thermal",
    current: 29.8,
    projected: 32.4,
    max: 38,
    currentLabel: "29.8°C",
    projectedLabel: "32.4°C",
    maxLabel: "38°C",
  },
]

function ValidationResults() {
  return (
    <div className="flex flex-col gap-4">
      {/* Verdict */}
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-6 text-amber-400" />
        <div>
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 px-3 py-1 text-sm font-semibold">
            PASS WITH WARNINGS
          </Badge>
          <p className="mt-1 text-[11px] text-muted-foreground">
            CHG-0091 · Add 4x H100 nodes to Rack A3
          </p>
        </div>
      </div>

      {/* Constraint Checks */}
      <Card className="border-border bg-card p-4">
        <h4 className="mb-3 text-[13px] font-semibold text-foreground">
          Constraint Checks
        </h4>
        <div className="flex flex-col gap-2">
          {constraintChecks.map((check, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {check.isWarning ? (
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
              ) : (
                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
              )}
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[12px] text-muted-foreground">
                  {check.label}
                </span>
                <Badge
                  variant="outline"
                  className={
                    check.isWarning
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  }
                >
                  {check.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Simulation Chart */}
      <Card className="border-border bg-card p-4">
        <h4 className="mb-3 text-[13px] font-semibold text-foreground">
          Risk Simulation
        </h4>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={riskSimData}
              layout="vertical"
              margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 13, fill: "#a1a1aa", fontWeight: 500 }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={false}
                width={90}
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
              <Bar dataKey="current" name="Current" radius={[0, 2, 2, 0]}>
                {riskSimData.map((_, index) => (
                  <Cell key={index} fill="#3b82f6" />
                ))}
                <LabelList
                  dataKey="currentLabel"
                  position="right"
                  style={{ fontSize: 11, fill: "#fafafa", fontFamily: "monospace" }}
                />
              </Bar>
              <Bar dataKey="projected" name="Projected" radius={[0, 2, 2, 0]}>
                {riskSimData.map((_, index) => (
                  <Cell key={index} fill="#f59e0b" />
                ))}
                <LabelList
                  dataKey="projectedLabel"
                  position="right"
                  style={{ fontSize: 11, fill: "#fafafa", fontFamily: "monospace" }}
                />
              </Bar>
              <Bar dataKey="max" name="Max Rated" radius={[0, 2, 2, 0]}>
                {riskSimData.map((_, index) => (
                  <Cell key={index} fill="#ef444440" />
                ))}
                <LabelList
                  dataKey="maxLabel"
                  position="right"
                  style={{ fontSize: 11, fill: "#a1a1aa", fontFamily: "monospace" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Current
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-amber-500" />
            Projected
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-red-500/40" />
            Max Rated
          </span>
        </div>
      </Card>

      {/* Safer Window */}
      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-2.5">
          <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-[13px] font-medium text-foreground">
              Safer Window Suggestion
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              Consider scheduling during 02:00-06:00 UTC when baseline load is
              18% lower and cooling capacity has more margin.
            </p>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="h-8 bg-emerald-600 text-emerald-50 text-[12px] hover:bg-emerald-700"
        >
          Approve Change
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-8 text-[12px]"
        >
          Block Change
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 border-amber-500/30 text-[12px] text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
        >
          Reschedule
        </Button>
      </div>
    </div>
  )
}

export default function ChangeValidatorPage() {
  const [showResults, setShowResults] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleValidate = () => {
    setShowResults(false)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Change Pre-Flight Validator
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Validate infrastructure changes against rack-level constraints
            before execution
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Form */}
          <Card className="col-span-2 border-border bg-card p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  Change Type
                </Label>
                <Select defaultValue="Add GPU Nodes">
                  <SelectTrigger className="h-9 border-border bg-secondary text-[13px] text-foreground [&>svg]:text-muted-foreground [&>svg]:size-4">
                    <SelectValue placeholder="Select change type" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card text-foreground">
                    {changeTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-[13px]">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  Target Rack
                </Label>
                <Select defaultValue="A3">
                  <SelectTrigger className="h-9 border-border bg-secondary text-[13px] text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card text-foreground">
                    {rackOptions.map((rack) => (
                      <SelectItem key={rack} value={rack} className="text-[13px]">
                        {rack}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  Target Cluster
                </Label>
                <Select defaultValue="train-cluster-alpha">
                  <SelectTrigger className="h-9 border-border bg-secondary text-[13px] text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card text-foreground">
                    <SelectItem
                      value="train-cluster-alpha"
                      className="text-[13px]"
                    >
                      train-cluster-alpha
                    </SelectItem>
                    <SelectItem
                      value="train-cluster-beta"
                      className="text-[13px]"
                    >
                      train-cluster-beta
                    </SelectItem>
                    <SelectItem
                      value="inference-cluster-gamma"
                      className="text-[13px]"
                    >
                      inference-cluster-gamma
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  Expected Power Delta (kW)
                </Label>
                <Input
                  type="number"
                  defaultValue="3.0"
                  className="h-9 border-border bg-secondary font-mono text-[13px] text-foreground"
                />
                <span className="text-[10px] text-muted-foreground">
                  Estimated additional power draw
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  Expected Thermal Delta (°C)
                </Label>
                <Input
                  type="number"
                  defaultValue="2.6"
                  className="h-9 border-border bg-secondary font-mono text-[13px] text-foreground"
                />
                <span className="text-[10px] text-muted-foreground">
                  Estimated inlet temp increase
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  Scheduled Window
                </Label>
                <Input
                  type="datetime-local"
                  defaultValue="2026-02-25T10:00"
                  className="h-9 border-border bg-secondary text-[13px] text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  Notes
                </Label>
                <Textarea
                  defaultValue="Adding 4x H100 SXM nodes to expand train-cluster-alpha capacity on Rack A3."
                  className="min-h-[80px] resize-none border-border bg-secondary text-[13px] text-foreground"
                />
              </div>

              <Button
                onClick={handleValidate}
                className="h-9 bg-primary text-primary-foreground text-[13px] hover:bg-primary/90"
              >
                Run Validation
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div className="col-span-3">
            {isLoading ? (
              <Card className="border-border bg-card p-6">
                <div className="flex flex-col gap-4">
                  <div className="h-6 w-48 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
                  <div className="h-32 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
                  <div className="h-48 w-full animate-pulse rounded bg-secondary" />
                </div>
              </Card>
            ) : showResults ? (
              <ValidationResults />
            ) : (
              <Card className="flex h-full items-center justify-center border-border bg-card p-12">
                <div className="text-center">
                  <ShieldCheck className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-3 text-[13px] text-muted-foreground">
                    Configure a change and run validation to see results.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
