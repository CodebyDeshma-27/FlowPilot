import { Link } from "react-router-dom"
import { Video, CheckSquare, GitBranch, Sparkles, ArrowRight, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { useAuthStore, useTasksStore, useMeetingsStore, useChatStore } from "@/store"
import { mockActivities, mockWeeklyData, mockProjects } from "@/data/mockData"

const chartConfig = {
  tasks: { label: "Tasks", color: "var(--chart-1)" },
  meetings: { label: "Meetings", color: "var(--chart-2)" },
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const { tasks } = useTasksStore()
  const { meetings } = useMeetingsStore()
  const { aiQueryCount } = useChatStore()

  const upcomingMeetings = meetings.filter((m) => m.status === "upcoming")
  const activeTasks = tasks.filter((t) => t.status !== "done")
  const doneTasks = tasks.filter((t) => t.status === "done")

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Here's what's happening today</p>
        </div>
        <Button asChild>
          <Link to="/meetings">
            <Video className="size-4 mr-2" /> Upload Meeting
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Active Tasks",
            value: activeTasks.length,
            sub: `${doneTasks.length} completed`,
            icon: CheckSquare,
            color: "text-chart-1",
            bg: "bg-chart-1/10",
            trend: "+12%",
            link: "/tasks",
          },
          {
            title: "Upcoming Meetings",
            value: upcomingMeetings.length,
            sub: "next 7 days",
            icon: Video,
            color: "text-chart-2",
            bg: "bg-chart-2/10",
            trend: "+2",
            link: "/meetings",
          },
          {
            title: "Active Projects",
            value: mockProjects.filter((p) => p.status === "active").length,
            sub: "across teams",
            icon: GitBranch,
            color: "text-chart-3",
            bg: "bg-chart-3/10",
            trend: "On track",
            link: "/timeline",
          },
          {
            title: "AI Queries",
            value: aiQueryCount,
            sub: "this month",
            icon: Sparkles,
            color: "text-chart-4",
            bg: "bg-chart-4/10",
            trend: "+34%",
            link: "/ai-chat",
          },
        ].map(({ title, value, sub, icon: Icon, color, bg, trend, link }) => (
          <Card key={title} className="border-border/60 hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex items-center justify-center size-9 rounded-lg ${bg} ${color}`}>
                  <Icon className="size-4" />
                </div>
                <Badge variant="secondary" className="text-xs">{trend}</Badge>
              </div>
              <div className="text-2xl font-bold mb-0.5">{value}</div>
              <div className="text-sm font-medium text-foreground">{title}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
              <Button variant="ghost" size="xs" className="mt-2 -ml-1 text-muted-foreground" asChild>
                <Link to={link}>View all <ArrowRight className="size-3 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Weekly Overview</CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-1 inline-block" />Tasks</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-2 inline-block" />Meetings</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={mockWeeklyData} barGap={4}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="meetings" fill="var(--color-meetings)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Active Projects</CardTitle>
              <Button variant="ghost" size="xs" asChild>
                <Link to="/timeline"><ArrowRight className="size-3.5" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium truncate">{project.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex -space-x-1.5">
                    {project.members.slice(0, 3).map((m) => (
                      <Avatar key={m.name} className="size-5 ring-1 ring-background">
                        <AvatarFallback className="text-[9px] bg-primary/20 text-primary">{m.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" /> {project.deadline}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="size-7 shrink-0 mt-0.5">
                  <AvatarFallback className="text-xs bg-primary/15 text-primary">{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] h-5 shrink-0"
                >
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Upcoming Deadlines</CardTitle>
              <Button variant="ghost" size="xs" asChild>
                <Link to="/tasks"><ArrowRight className="size-3.5" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks
              .filter((t) => t.status !== "done")
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map((task) => {
                const dueDate = new Date(task.dueDate)
                const today = new Date()
                const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                const isUrgent = daysLeft <= 2
                return (
                  <div key={task.id} className="flex items-center gap-3">
                    <div className={`size-2 rounded-full shrink-0 ${task.priority === "high" ? "bg-destructive" : task.priority === "medium" ? "bg-chart-4" : "bg-chart-3"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.assignee.name}</p>
                    </div>
                    <span className={`text-xs font-medium shrink-0 flex items-center gap-1 ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                      {isUrgent && <AlertCircle className="size-3" />}
                      {daysLeft}d
                    </span>
                  </div>
                )
              })}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Upload Meeting", icon: Video, to: "/meetings", color: "bg-primary/10 text-primary hover:bg-primary/20" },
            { label: "New Task", icon: CheckSquare, to: "/tasks", color: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20" },
            { label: "View Timeline", icon: GitBranch, to: "/timeline", color: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20" },
            { label: "Ask AI", icon: Sparkles, to: "/ai-chat", color: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20" },
            { label: "Analytics", icon: TrendingUp, to: "/analytics", color: "bg-chart-5/10 text-chart-5 hover:bg-chart-5/20" },
          ].map(({ label, icon: Icon, to, color }) => (
            <Button key={label} variant="outline" size="sm" className={`gap-2 border-border/60 ${color} transition-colors`} asChild>
              <Link to={to}>
                <Icon className="size-3.5" />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
