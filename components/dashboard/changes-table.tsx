"use client"

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
import { pendingChanges } from "@/lib/mock-data"
import Link from "next/link"

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Passed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Failed: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  return (
    <Badge variant="outline" className={styles[status] || ""}>
      {status}
    </Badge>
  )
}

export function ChangesTable() {
  return (
    <Card className="flex flex-col border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Pending Change Validations
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[11px] text-muted-foreground">
              Change ID
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Target
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Requested By
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-[11px] text-muted-foreground" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingChanges.map((change, i) => (
            <TableRow
              key={change.changeId}
              className={`border-border ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}
            >
              <TableCell className="font-mono text-[13px] font-medium text-primary">
                {change.changeId}
              </TableCell>
              <TableCell className="text-[13px] text-foreground">
                {change.type}
              </TableCell>
              <TableCell className="font-mono text-[13px] text-muted-foreground">
                {change.target}
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground">
                {change.requestedBy}
              </TableCell>
              <TableCell>
                <StatusBadge status={change.status} />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-7 border-border text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <Link href="/change-validator">Review</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
