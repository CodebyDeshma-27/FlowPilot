import { useState } from "react"
import { Download, TrendingUp, CheckCircle, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
} from "recharts"
import { mockAnalyticsData, mockMeetings } from "@/data/mockData"
import { useTasksStore } from "@/store"
import { toast } from "sonner"

const lineConfig = {
  completed: { label: "Completed", color: "var(--chart-3)" },
  created: { label: "Created", color: "var(--chart-1)" },
}

const barConfig = {
  tasks: { label: "Tasks", color: "var(--chart-1)" },
  meetings: { label: "Meetings", color: "var(--chart-2)" },
}

const areaConfig = {
  queries: { label: "AI Queries", color: "var(--chart-2)" },
}

const meetingConfig = {
  meetings: { label: "Meetings", color: "var(--chart-4)" },
}

export default function Analytics() {
  const [range, setRange] = useState("30d")
  const { tasks } = useTasksStore()

  const doneTasks = tasks.filter((t) => t.status === "done")
  const completionRate = Math.round((doneTasks.length / tasks.length) * 100)
  const completedMeetings = mockMeetings.filter((m) => m.status === "completed")

  const kpis = [
    { label: "Task Completion Rate", value: `${completionRate}%`, icon: CheckCircle, color: "text-chart-3", bg: "bg-chart-3/10", trend: "+8% vs last month" },
    { label: "Avg Task Duration", value: "3.2d", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", trend: "-0.8d vs last month" },
    { label: "Meetings Held", value: completedMeetings.length.toString(), icon: Users, color: "text-chart-4", bg: "bg-chart-4/10", trend: "+3 vs last month" },
    { label: "AI Queries", value: "142", icon: Zap, color: "text-chart-2", bg: "bg-chart-2/10", trend: "+34% vs last month" },
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground">Team performance and productivity insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-8 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => toast.success("CSV exported!")}>
            <Download className="size-3.5 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg, trend }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="p-5">
              <div className={`flex items-center justify-center size-9 rounded-lg ${bg} ${color} mb-3`}>
                <Icon className="size-4" />
              </div>
              <div className="text-2xl font-bold mb-0.5">{value}</div>
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-muted-foreground mt-1">{trend}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks over time */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Tasks Over Time</CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-3 inline-block" />Completed</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-1 inline-block" />Created</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineConfig} className="h-[200px] w-full">
              <LineChart data={mockAnalyticsData.tasksOverTime}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="completed" stroke="var(--color-completed)" strokeWidth={2} dot={false} />
                <Line dataKey="created" stroke="var(--color-created)" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task distribution */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="h-[200px] w-[200px] shrink-0">
              <ChartContainer config={{}} className="h-full w-full">
                <PieChart>
                  <Pie data={mockAnalyticsData.tasksByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {mockAnalyticsData.tasksByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {mockAnalyticsData.tasksByStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team productivity */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Team Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="h-[200px] w-full">
              <BarChart data={mockAnalyticsData.teamProductivity} layout="vertical" barGap={2}>
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[0, 3, 3, 0]} maxBarSize={12} />
                <Bar dataKey="meetings" fill="var(--color-meetings)" radius={[0, 3, 3, 0]} maxBarSize={12} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI usage */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">AI Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaConfig} className="h-[200px] w-full">
              <AreaChart data={mockAnalyticsData.aiUsage}>
                <defs>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="queries" stroke="var(--color-queries)" fill="url(#aiGrad)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Meeting frequency */}
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Meeting Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={meetingConfig} className="h-[180px] w-full">
              <BarChart data={mockAnalyticsData.meetingFrequency}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="meetings" fill="var(--color-meetings)" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
