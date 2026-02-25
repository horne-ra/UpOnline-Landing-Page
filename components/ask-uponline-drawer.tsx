"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, AlertTriangle, Thermometer, Cpu, Zap } from "lucide-react"

const routeContextLabels: Record<string, string> = {
  "/": "Control Tower",
  "/gpu-fleet": "GPU Fleet",
  "/training-risk": "Training Risk",
  "/change-validator": "Change Validator",
  "/topology": "Topology",
}

const suggestedPrompts = [
  "Why is Rack B3 critical?",
  "What training jobs are at risk?",
  "Explain the thermal risk score",
  "Is it safe to add GPUs to Rack A3?",
  "Summarize current DC health",
  "What caused the B3 thermal spike?",
]

// Pre-filled mock exchange
const mockUserMessage = "Why is Rack B3 critical?"

const mockAiResponse = {
  summary:
    "Rack B3 is in CRITICAL state. Inlet temperature has exceeded 38\u00B0C, causing GPU thermal throttling on 4 nodes in train-cluster-beta.",
  signals: [
    { key: "Inlet Temp", value: "38.4\u00B0C", threshold: "37\u00B0C", severity: "critical" as const },
    { key: "Cooling Zone B Margin", value: "6%", threshold: "10%", severity: "warning" as const },
    { key: "GPU Throttle Count", value: "4 nodes", threshold: null, severity: "critical" as const },
    { key: "Power Draw", value: "19.2 kW", threshold: "22 kW", severity: "warning" as const },
  ],
  trainingImpact:
    "2 active jobs affected. llm-pretrain-7b-run-042: est. 12\u201318% slowdown. embeddings-finetune-019: est. 5\u20138% slowdown.",
  relatedObjects: [
    "Rack B3",
    "train-cluster-beta",
    "Cooling Zone B",
    "llm-pretrain-7b-run-042",
  ],
}

function SeverityIcon({ severity }: { severity: "critical" | "warning" }) {
  if (severity === "critical") {
    return <AlertTriangle className="size-3 text-red-400" />
  }
  return <AlertTriangle className="size-3 text-amber-400" />
}

export function AskUpOnlineDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pathname = usePathname()
  const contextLabel = routeContextLabels[pathname] || "UpOnline"
  const [inputValue, setInputValue] = useState("")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[440px] sm:max-w-[440px] flex flex-col gap-0 p-0 border-border bg-background"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/15">
              <Sparkles className="size-3.5 text-primary" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-sm font-semibold text-foreground">
                Ask UpOnline
              </SheetTitle>
              <SheetDescription className="text-[11px] text-muted-foreground">
                Contextual Intelligence
              </SheetDescription>
            </div>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-[10px] uppercase tracking-wide"
            >
              Read Only
            </Badge>
          </div>
          <Badge
            variant="outline"
            className="mt-2 w-fit border-border bg-secondary text-muted-foreground text-[10px]"
          >
            {"Context: " + contextLabel}
          </Badge>
        </SheetHeader>

        {/* Suggested prompts */}
        <div className="border-b border-border px-5 py-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Suggested
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInputValue(prompt)}
                className="rounded-md bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation area */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">
            {/* User message — right aligned */}
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-lg bg-secondary px-3 py-2">
                <p className="text-xs text-foreground">{mockUserMessage}</p>
              </div>
            </div>

            {/* AI response — structured card */}
            <div className="rounded-lg border border-border bg-card">
              {/* Blue left accent */}
              <div className="border-l-2 border-primary rounded-lg">
                {/* Summary */}
                <div className="px-4 pt-3 pb-2.5">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Summary
                  </p>
                  <p className="text-xs leading-relaxed text-foreground">
                    {mockAiResponse.summary}
                  </p>
                </div>

                {/* Contributing Signals */}
                <div className="border-t border-border px-4 py-2.5">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Contributing Signals
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {mockAiResponse.signals.map((signal) => (
                      <div
                        key={signal.key}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <SeverityIcon severity={signal.severity} />
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {signal.key}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-medium text-foreground">
                            {signal.value}
                          </span>
                          {signal.threshold && (
                            <span className="text-[10px] text-muted-foreground">
                              {"(thr: " + signal.threshold + ")"}
                            </span>
                          )}
                          <Badge
                            className={
                              signal.severity === "critical"
                                ? "border-transparent bg-red-500/15 text-red-400 text-[9px]"
                                : "border-transparent bg-amber-500/15 text-amber-400 text-[9px]"
                            }
                          >
                            {signal.severity === "critical" ? "RED" : "AMBER"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Impact */}
                <div className="border-t border-border px-4 py-2.5">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Training Impact
                  </p>
                  <p className="text-xs leading-relaxed text-foreground">
                    {mockAiResponse.trainingImpact}
                  </p>
                </div>

                {/* Related Objects */}
                <div className="border-t border-border px-4 pt-2.5 pb-3">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Related Objects
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mockAiResponse.relatedObjects.map((obj) => (
                      <span
                        key={obj}
                        className="cursor-pointer rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-primary"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 py-2">
                  <p className="text-[10px] text-muted-foreground">
                    Explanation of current system state. No actions taken.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about any risk, rack, or training job..."
              className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              size="sm"
              className="size-8 bg-primary p-0 text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-3.5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Read-only — explains system state, does not execute actions
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
