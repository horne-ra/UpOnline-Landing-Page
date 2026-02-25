"use client"

import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { racks, type RackData } from "@/lib/mock-data"

function getRackColor(temp: number) {
  if (temp > 37)
    return "bg-red-500/20 border-red-500/50 text-red-400"
  if (temp >= 33)
    return "bg-amber-500/15 border-amber-500/40 text-amber-400"
  return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
}

function RackCell({ rack }: { rack: RackData }) {
  const colorClass = getRackColor(rack.inletTemp)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex cursor-pointer flex-col items-center justify-center rounded-md border p-2 transition-all hover:ring-1 hover:ring-border ${colorClass}`}
        >
          <span className="text-[11px] font-medium text-foreground">
            {rack.id}
          </span>
          <span className="font-mono text-sm font-bold">
            {rack.inletTemp}°C
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-card text-card-foreground border-border">
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-foreground">
            Rack {rack.id}
          </span>
          <span className="text-muted-foreground">
            Power: <span className="font-mono text-foreground">{rack.powerDraw} kW</span>
          </span>
          <span className="text-muted-foreground">
            GPUs: <span className="font-mono text-foreground">{rack.gpuCount}</span>
          </span>
          <span className="text-muted-foreground">
            Thermal Margin:{" "}
            <span className="font-mono text-foreground">{rack.thermalMargin}%</span>
          </span>
          <span className="text-muted-foreground">
            Risk Score:{" "}
            <span className="font-mono text-foreground">{rack.riskScore}</span>
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export function RackHeatmap() {
  const rows = ["A", "B", "C"]

  return (
    <Card className="flex flex-col border-border bg-card p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          Rack Heatmap Grid
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Inlet temperature by rack position
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-10 text-[11px] font-medium text-muted-foreground">
              Row {row}
            </span>
            <div className="grid flex-1 grid-cols-4 gap-2">
              {racks
                .filter((r) => r.row === row)
                .map((rack) => (
                  <RackCell key={rack.id} rack={rack} />
                ))}
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-emerald-500" />
          {"< 33°C"}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-amber-500" />
          33–37°C
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-red-500" />
          {"> 37°C"}
        </span>
      </div>
    </Card>
  )
}
