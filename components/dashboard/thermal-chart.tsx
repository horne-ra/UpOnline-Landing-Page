"use client"

import { Card } from "@/components/ui/card"
import { thermalChartData } from "@/lib/mock-data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts"

export function ThermalChart() {
  return (
    <Card className="flex flex-col border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Thermal Load vs Cooling Capacity (4h)
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Avg Rack Inlet Temp vs Cooling Threshold
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Inlet Temp
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-red-500" />
            Threshold (38°C)
          </span>
        </div>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={thermalChartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={false}
            />
            <YAxis
              domain={[28, 42]}
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={false}
              tickFormatter={(v) => `${v}°C`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#fafafa",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: number) => [`${value}°C`, "Avg Inlet Temp"]}
            />
            <ReferenceArea
              y1={38}
              y2={42}
              fill="#ef4444"
              fillOpacity={0.08}
              label={{
                value: "Danger Zone",
                position: "insideTopRight",
                fill: "#ef4444",
                fontSize: 10,
              }}
            />
            <ReferenceLine
              y={38}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="avgTemp"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
