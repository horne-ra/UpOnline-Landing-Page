"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"
import { AskUpOnlineDrawer } from "@/components/ask-uponline-drawer"

const routeLabels: Record<string, string> = {
  "/": "Control Tower",
  "/gpu-fleet": "GPU Fleet Intelligence",
  "/training-risk": "Training Impact Intelligence",
  "/change-validator": "Change Pre-Flight Validator",
  "/topology": "Data Center Topology",
}

export function TopBar() {
  const pathname = usePathname()
  const currentLabel = routeLabels[pathname] || "UpOnline"
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">UpOnline</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">{currentLabel}</span>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary text-[11px]"
          >
            Mode: SHADOW
          </Badge>
          <Badge className="gap-1.5 border-transparent bg-emerald-500/15 text-emerald-400 text-[11px]">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            DC Health: NORMAL
          </Badge>
          <Badge className="border-transparent bg-amber-500/15 text-amber-400 text-[11px]">
            Active Risks: 3
          </Badge>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-muted-foreground">
              Thermal Risk:{" "}
              <span className="font-mono font-medium text-amber-400">34%</span>
            </span>
            <span className="text-muted-foreground">
              Power Risk:{" "}
              <span className="font-mono font-medium text-emerald-400">12%</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="gap-1.5 border-primary/40 bg-primary/5 text-primary text-[11px] hover:bg-primary/10 hover:text-primary"
          >
            <Sparkles className="size-3" />
            Ask UpOnline
          </Button>
        </div>
      </header>

      <AskUpOnlineDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}
