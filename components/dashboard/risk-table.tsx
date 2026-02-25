"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { activeRisks } from "@/lib/mock-data"
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react"

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    Critical: "bg-red-500/15 text-red-400 border-red-500/30",
    Warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Info: "bg-primary/15 text-primary border-primary/30",
  }
  return (
    <Badge variant="outline" className={styles[severity] || ""}>
      {severity}
    </Badge>
  )
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <ArrowUp className="size-3.5 text-red-400" />
  if (trend === "down")
    return <ArrowDown className="size-3.5 text-emerald-400" />
  return <ArrowRight className="size-3.5 text-muted-foreground" />
}

export function RiskTable() {
  return (
    <Card className="flex flex-col border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Top Active Risks
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[11px] text-muted-foreground">
              Severity
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Risk Type
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Location
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Score
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Trend
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Updated
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeRisks.map((risk, i) => (
            <TableRow
              key={risk.id}
              className={`border-border ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}
            >
              <TableCell>
                <SeverityBadge severity={risk.severity} />
              </TableCell>
              <TableCell className="text-[13px] text-foreground">
                {risk.type}
              </TableCell>
              <TableCell className="font-mono text-[13px] text-muted-foreground">
                {risk.location}
              </TableCell>
              <TableCell className="font-mono text-[13px] font-semibold text-foreground">
                {risk.riskScore}
              </TableCell>
              <TableCell>
                <TrendIcon trend={risk.trend} />
              </TableCell>
              <TableCell className="text-[11px] text-muted-foreground">
                {risk.lastUpdated}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
