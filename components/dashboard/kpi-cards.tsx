"use client"

import { Card } from "@/components/ui/card"
import {
  thermalSparkline,
  powerSparkline,
  gpuHealthSparkline,
} from "@/lib/mock-data"

function MiniSparkline({
  data,
  color,
  height = 28,
}: {
  data: number[]
  color: string
  height?: number
}) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 80
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface KpiCardProps {
  label: string
  value: string
  sparkline?: number[]
  color: { text: string; spark: string }
  unit?: string
}

function KpiCard({ label, value, sparkline, color }: KpiCardProps) {
  return (
    <Card
      className="group flex items-center justify-between border-border bg-card p-4 transition-all hover:ring-1 hover:ring-border"
      style={{ borderLeft: `4px solid ${color.spark}` }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={`font-mono text-2xl font-bold ${color.text}`}>
          {value}
        </span>
      </div>
      {sparkline && <MiniSparkline data={sparkline} color={color.spark} />}
    </Card>
  )
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <KpiCard
        label="Thermal Risk Score"
        value="34%"
        sparkline={thermalSparkline}
        color={{ text: "text-amber-500", spark: "#f59e0b" }}
      />
      <KpiCard
        label="Power Headroom"
        value="88%"
        sparkline={powerSparkline}
        color={{ text: "text-emerald-500", spark: "#10b981" }}
      />
      <KpiCard
        label="GPU Fleet Health"
        value="94.2%"
        sparkline={gpuHealthSparkline}
        color={{ text: "text-emerald-500", spark: "#10b981" }}
      />
      <KpiCard
        label="At-Risk Training Jobs"
        value="2"
        color={{ text: "text-amber-500", spark: "#f59e0b" }}
      />
    </div>
  )
}
