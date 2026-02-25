"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Cpu,
  Activity,
  ShieldCheck,
  Network,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { label: "Control Tower", href: "/", icon: LayoutDashboard },
  { label: "GPU Fleet", href: "/gpu-fleet", icon: Cpu },
  { label: "Training Risk", href: "/training-risk", icon: Activity },
  { label: "Change Validator", href: "/change-validator", icon: ShieldCheck },
  { label: "Topology", href: "/topology", icon: Network },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex h-12 items-center gap-2 border-b border-border px-4">
        <Image
          src="/images/uponline-logo.png"
          alt="UpOnline logo"
          width={24}
          height={24}
          className="shrink-0"
        />
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-foreground">
            UpOnline
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border px-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* Org info */}
      {!collapsed && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-[11px] text-muted-foreground">Organization</p>
          <p className="text-xs font-medium text-foreground">
            Meridian AI Compute
          </p>
        </div>
      )}
    </aside>
  )
}
