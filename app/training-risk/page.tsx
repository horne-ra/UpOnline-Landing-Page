"use client"

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
import { trainingJobs } from "@/lib/mock-data"
import { AlertTriangle, ArrowRight, Zap, Cpu, Flame } from "lucide-react"

function RiskLevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    High: "bg-red-500/15 text-red-400 border-red-500/30",
    Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Low: "bg-primary/15 text-primary border-primary/30",
    None: "bg-secondary text-muted-foreground border-border",
  }
  return (
    <Badge variant="outline" className={styles[level] || ""}>
      {level}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Running: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Queued: "bg-secondary text-muted-foreground border-border",
    "At Risk": "bg-red-500/15 text-red-400 border-red-500/30",
  }
  return (
    <Badge variant="outline" className={styles[status] || ""}>
      {status}
    </Badge>
  )
}

function AtRiskJobCard({
  job,
}: {
  job: (typeof trainingJobs)[0]
}) {
  const isHigh = job.infraRisk === "High"
  const borderColor = isHigh ? "border-red-500/40" : "border-amber-500/40"
  const glowColor = isHigh
    ? "hover:ring-red-500/20"
    : "hover:ring-amber-500/20"

  return (
    <Card
      className={`flex min-w-[340px] flex-col gap-3 border ${borderColor} bg-card p-4 transition-all hover:ring-1 ${glowColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-semibold text-foreground">
            {job.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {job.cluster}
          </span>
        </div>
        <RiskLevelBadge level={job.infraRisk} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Affected GPUs
          </span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {job.affectedGpus} of {job.gpuCount}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Est. Slowdown
          </span>
          <span
            className={`font-mono text-sm font-semibold ${isHigh ? "text-red-400" : "text-amber-400"}`}
          >
            {job.estimatedSlowdown}
          </span>
        </div>
      </div>

      <div className="rounded-md border border-border bg-secondary/30 p-2.5">
        <div className="flex items-start gap-2">
          <AlertTriangle
            className={`mt-0.5 size-3.5 shrink-0 ${isHigh ? "text-red-400" : "text-amber-400"}`}
          />
          <span className="text-[12px] leading-relaxed text-muted-foreground">
            {job.rootCause}
          </span>
        </div>
      </div>

      <Button
        size="sm"
        className="h-8 w-full bg-amber-600 text-[11px] font-medium text-white hover:bg-amber-700"
      >
        View Mitigation Options
      </Button>
    </Card>
  )
}

function RiskPropagationMap() {
  const stages = [
    {
      icon: Flame,
      label: "Infrastructure",
      value: "Rack B3: 38.4°C",
      bg: "bg-red-500/10",
      borderColor: "#ef4444",
      iconColor: "text-red-400",
      textColor: "text-red-400",
    },
    {
      icon: Zap,
      label: "Cooling Impact",
      value: "Zone B: Margin 6%",
      bg: "bg-amber-500/10",
      borderColor: "#f59e0b",
      iconColor: "text-amber-400",
      textColor: "text-amber-400",
    },
    {
      icon: Cpu,
      label: "Compute",
      value: "4 GPUs throttled",
      bg: "bg-amber-500/10",
      borderColor: "#f59e0b",
      iconColor: "text-amber-400",
      textColor: "text-amber-400",
    },
    {
      icon: AlertTriangle,
      label: "Training Impact",
      value: "llm-pretrain-7b: -15%",
      bg: "bg-red-500/10",
      borderColor: "#ef4444",
      iconColor: "text-red-400",
      textColor: "text-red-400",
    },
  ]

  return (
    <Card className="border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Risk Propagation Chain
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Infrastructure fault to training impact trace
        </p>
      </div>
      <div
        className="flex items-center gap-2 rounded-lg px-4 py-4"
        style={{
          background:
            "linear-gradient(to right, rgba(127, 29, 29, 0.15), rgba(120, 53, 15, 0.15))",
        }}
      >
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex flex-1 flex-col items-center gap-2 rounded-md ${stage.bg} px-4 py-3`}
              style={{ borderLeft: `4px solid ${stage.borderColor}` }}
            >
              <stage.icon className={`size-5 ${stage.iconColor}`} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {stage.label}
              </span>
              <span className={`font-mono text-[12px] font-semibold ${stage.textColor}`}>
                {stage.value}
              </span>
            </div>
            {i < stages.length - 1 && (
              <svg
                width="28"
                height="12"
                viewBox="0 0 28 12"
                className="shrink-0"
              >
                <line
                  x1="0"
                  y1="6"
                  x2="20"
                  y2="6"
                  stroke="#a1a1aa"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <polygon points="20,1 28,6 20,11" fill="#a1a1aa" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function TrainingRiskPage() {
  const atRiskJobs = trainingJobs.filter(
    (j) => j.infraRisk === "High" || j.infraRisk === "Medium"
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Training Impact Intelligence
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Real-time mapping of infrastructure risk to training job impact
          </p>
        </div>

        {/* At-Risk Training Jobs */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            At-Risk Training Jobs
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {atRiskJobs.map((job) => (
              <AtRiskJobCard key={job.name} job={job} />
            ))}
          </div>
        </div>

        {/* Risk Propagation Map */}
        <RiskPropagationMap />

        {/* Training Fleet Overview */}
        <Card className="border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              Training Fleet Overview
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] text-muted-foreground">
                  Job Name
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Cluster
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  GPUs
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Infra Risk
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Est. Completion
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Slowdown %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainingJobs.map((job, i) => {
                const isAtRisk =
                  job.infraRisk === "High" || job.infraRisk === "Medium"
                return (
                  <TableRow
                    key={job.name}
                    className={`border-border ${isAtRisk ? "bg-red-950/30" : i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}
                  >
                    <TableCell className="font-mono text-[13px] font-medium text-foreground">
                      {job.name}
                    </TableCell>
                    <TableCell className="font-mono text-[12px] text-muted-foreground">
                      {job.cluster}
                    </TableCell>
                    <TableCell className="font-mono text-[13px] text-foreground">
                      {job.gpuCount}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell>
                      <RiskLevelBadge level={job.infraRisk} />
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {job.estCompletion}
                    </TableCell>
                    <TableCell
                      className={`font-mono text-[13px] ${job.slowdownRisk > 10 ? "font-semibold text-red-400" : job.slowdownRisk > 0 ? "text-amber-400" : "text-muted-foreground"}`}
                    >
                      {job.slowdownRisk > 0 ? `${job.slowdownRisk}%` : "—"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
