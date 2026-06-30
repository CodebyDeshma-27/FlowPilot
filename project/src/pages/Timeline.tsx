import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { mockTimelineItems } from "@/data/mockData"

const colorMap: Record<string, string> = {
  primary: "bg-primary/20 border-primary/60 text-primary",
  "chart-1": "bg-chart-1/20 border-chart-1/60 text-chart-1",
  "chart-2": "bg-chart-2/20 border-chart-2/60 text-chart-2",
  "chart-3": "bg-chart-3/20 border-chart-3/60 text-chart-3",
  "chart-4": "bg-chart-4/20 border-chart-4/60 text-chart-4",
  "chart-5": "bg-chart-5/20 border-chart-5/60 text-chart-5",
}

const solidColorMap: Record<string, string> = {
  primary: "bg-primary",
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
}

function getDaysFromStart(itemStart: string, rangeStart: string) {
  return Math.ceil((new Date(itemStart).getTime() - new Date(rangeStart).getTime()) / (1000 * 60 * 60 * 24))
}

export default function Timeline() {
  const [view, setView] = useState<"week" | "month">("month")

  const RANGE_START = "2026-06-15"
  const RANGE_DAYS = view === "week" ? 28 : 56
  const DAY_WIDTH = view === "week" ? 36 : 18

  const rangeStart = new Date(RANGE_START)
  const today = new Date("2026-06-30")
  const todayOffset = getDaysFromStart(today.toISOString().split("T")[0], RANGE_START)

  // Generate week/month labels
  const headerLabels: { label: string; day: number }[] = []
  for (let i = 0; i < RANGE_DAYS; i += view === "week" ? 7 : 14) {
    const d = new Date(rangeStart)
    d.setDate(d.getDate() + i)
    headerLabels.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      day: i,
    })
  }

  const totalWidth = RANGE_DAYS * DAY_WIDTH

  const typeIcons = { sprint: "🏃", project: "📁", milestone: "🎯" }
  const typeLabels = { sprint: "Sprint", project: "Project", milestone: "Milestone" }

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Timeline</h2>
          <p className="text-sm text-muted-foreground">Project roadmap and milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "week" | "month")}>
            <TabsList className="h-8">
              <TabsTrigger value="week" className="text-xs px-3">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(typeLabels).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{typeIcons[type as keyof typeof typeIcons]}</span>
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3 w-px bg-chart-5" />
          <span>Today</span>
        </div>
      </div>

      {/* Gantt chart */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border/60 bg-card">
        <ScrollArea className="h-full">
          <div className="flex">
            {/* Left: labels */}
            <div className="w-56 shrink-0 border-r border-border/60">
              <div className="h-10 border-b border-border/60 flex items-center px-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item</span>
              </div>
              {mockTimelineItems.map((item) => (
                <div key={item.id} className="h-14 border-b border-border/30 flex items-center px-4 gap-2">
                  <span className="text-sm">{typeIcons[item.type as keyof typeof typeIcons]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {item.assignees.slice(0, 2).map((a) => (
                        <Avatar key={a.name} className="size-4">
                          <AvatarFallback className="text-[8px] bg-primary/15 text-primary">{a.avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                  {item.type !== "milestone" && (
                    <span className="text-xs text-muted-foreground shrink-0">{item.progress}%</span>
                  )}
                </div>
              ))}
            </div>

            {/* Right: chart */}
            <div className="flex-1 overflow-x-auto">
              <div style={{ width: totalWidth, minWidth: totalWidth }}>
                {/* Date header */}
                <div className="h-10 border-b border-border/60 relative flex">
                  {headerLabels.map(({ label, day }) => (
                    <div
                      key={day}
                      className="absolute top-0 flex items-center px-2 h-full border-r border-border/30"
                      style={{ left: day * DAY_WIDTH, width: (view === "week" ? 7 : 14) * DAY_WIDTH }}
                    >
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                  ))}
                  {/* Today line header */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-chart-5/60"
                    style={{ left: todayOffset * DAY_WIDTH }}
                  />
                </div>

                {/* Rows */}
                {mockTimelineItems.map((item) => {
                  const startDay = Math.max(0, getDaysFromStart(item.start, RANGE_START))
                  const endDay = Math.min(RANGE_DAYS, getDaysFromStart(item.end, RANGE_START) + 1)
                  const width = (endDay - startDay) * DAY_WIDTH
                  const left = startDay * DAY_WIDTH
                  const isMilestone = item.type === "milestone"

                  return (
                    <div key={item.id} className="h-14 border-b border-border/30 relative">
                      {/* Grid lines */}
                      {headerLabels.map(({ day }) => (
                        <div key={day} className="absolute top-0 bottom-0 w-px bg-border/20" style={{ left: day * DAY_WIDTH }} />
                      ))}
                      {/* Today line */}
                      <div className="absolute top-0 bottom-0 w-px bg-chart-5/40" style={{ left: todayOffset * DAY_WIDTH }} />

                      {/* Task bar */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {isMilestone ? (
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-5 rotate-45 border-2 cursor-pointer hover:scale-110 transition-transform ${colorMap[item.color] || colorMap.primary}`}
                              style={{ left: left + 8 }}
                            />
                          ) : (
                            <div
                              className={`absolute top-3 rounded-md border cursor-pointer transition-opacity hover:opacity-90 ${colorMap[item.color] || colorMap.primary}`}
                              style={{ left, width: Math.max(width, 4), height: 32 }}
                            >
                              <div
                                className={`h-full rounded-l-md ${solidColorMap[item.color] || solidColorMap.primary} opacity-60`}
                                style={{ width: `${item.progress}%` }}
                              />
                              {width > 60 && (
                                <span className="absolute inset-0 flex items-center px-2 text-xs font-medium truncate">
                                  {item.title}
                                </span>
                              )}
                            </div>
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-xs space-y-0.5">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-muted-foreground">{item.start} → {item.end}</p>
                            {!isMilestone && <p>{item.progress}% complete</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
