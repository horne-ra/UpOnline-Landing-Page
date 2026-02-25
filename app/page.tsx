"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { ThermalChart } from "@/components/dashboard/thermal-chart"
import { RackHeatmap } from "@/components/dashboard/rack-heatmap"
import { RiskTable } from "@/components/dashboard/risk-table"
import { ChangesTable } from "@/components/dashboard/changes-table"

export default function ControlTowerPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        {/* KPI Row */}
        <KpiCards />

        {/* Middle Row — Chart + Heatmap */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <ThermalChart />
          </div>
          <div className="col-span-2">
            <RackHeatmap />
          </div>
        </div>

        {/* Bottom Row — Tables */}
        <div className="grid grid-cols-2 gap-4">
          <RiskTable />
          <ChangesTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
