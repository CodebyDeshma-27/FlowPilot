import { Link } from "react-router-dom"
import {
  Zap,
  Video,
  CheckSquare,
  BarChart2,
  Sparkles,
  GitBranch,
  MessageSquare,
  ArrowRight,
  Star,
  Shield,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  { icon: Video, title: "Smart Meeting Hub", description: "Upload any meeting. AI extracts decisions, owners, and action items instantly." },
  { icon: CheckSquare, title: "Auto Task Generation", description: "Tasks are created automatically from meeting discussions with priority and assignees." },
  { icon: GitBranch, title: "Timeline Visualization", description: "See your project roadmap as a beautiful Gantt chart. Track milestones effortlessly." },
  { icon: BarChart2, title: "Team Analytics", description: "Deep insights into productivity, meeting frequency, and task completion rates." },
  { icon: Sparkles, title: "AI Workspace", description: "Every meeting becomes a full execution workspace with objectives, risks, and next steps." },
  { icon: MessageSquare, title: "AI Chat Assistant", description: "Ask anything. Get instant answers about your tasks, meetings, and team performance." },
]

const steps = [
  { step: "01", title: "Upload Your Meeting", description: "Drop in an audio file, video, or paste your transcript. FlowPilot accepts any format." },
  { step: "02", title: "AI Processes Everything", description: "Our AI analyzes the content, identifies decisions, risks, owners, and priorities in seconds." },
  { step: "03", title: "Execute With Clarity", description: "A complete workspace is generated — tasks assigned, timeline updated, team notified." },
]

const stats = [
  { value: "3h+", label: "Saved per meeting" },
  { value: "94%", label: "Task coverage" },
  { value: "12x", label: "Faster follow-ups" },
  { value: "500+", label: "Teams using FlowPilot" },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
              <Zap className="size-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-lg">FlowPilot AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Results</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/login">Get Started <ArrowRight className="ml-1.5 size-3.5" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-chart-2/5 pointer-events-none" />
        <div className="absolute top-20 left-1/4 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 size-64 rounded-full bg-chart-2/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36 text-center">
          <Badge variant="secondary" className="mb-6 px-3 py-1 gap-1.5">
            <Star className="size-3 fill-primary text-primary" />
            Trusted by 500+ technical teams
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-balance mb-6">
            Every meeting{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              becomes execution
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            FlowPilot AI transforms raw meeting recordings into complete execution workspaces — with tasks, owners, timelines, and AI insights. All automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/login">
                Start for free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Watch demo</Link>
            </Button>
          </div>

          {/* Hero visual */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden">
              <div className="bg-muted/40 border-b border-border px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-destructive/60" />
                  <div className="size-3 rounded-full bg-chart-4/60" />
                  <div className="size-3 rounded-full bg-chart-3/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">flowpilot.ai/workspace</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-card to-background">
                {[
                  { label: "Meeting Summary", icon: Video, color: "text-primary", lines: ["Q4 roadmap finalized", "3 blockers identified", "Team aligned on priorities"] },
                  { label: "Generated Tasks", icon: CheckSquare, color: "text-chart-3", lines: ["12 tasks created", "8 assigned", "4 high priority"] },
                  { label: "AI Insights", icon: Sparkles, color: "text-chart-2", lines: ["2 risks flagged", "5 next steps", "100% coverage"] },
                ].map(({ label, icon: Icon, color, lines }) => (
                  <div key={label} className="rounded-lg border border-border/60 bg-background/60 p-4">
                    <div className={`flex items-center gap-2 mb-3 ${color}`}>
                      <Icon className="size-4" />
                      <span className="text-xs font-semibold">{label}</span>
                    </div>
                    <div className="space-y-1.5">
                      {lines.map((line) => (
                        <div key={line} className="h-2 bg-muted/80 rounded-full" style={{ width: `${60 + Math.random() * 40}%` }}>
                          <span className="sr-only">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border/60 bg-muted/20 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything your team needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From meeting upload to task completion — FlowPilot handles the entire execution lifecycle.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border/60 hover:border-primary/40 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-muted/20 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Three steps to full clarity
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="relative">
                <div className="text-6xl font-black text-muted/30 mb-4">{step}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-chart-2/5 p-12">
          <div className="flex justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="size-4 text-chart-3" />SOC 2 Compliant</span>
            <span className="flex items-center gap-1.5"><Clock className="size-4 text-primary" />Setup in 5 minutes</span>
            <span className="flex items-center gap-1.5"><Star className="size-4 text-chart-4" />Free to start</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Stop letting meetings disappear
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join 500+ technical teams who've transformed their meeting-to-execution workflow.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/login">
              Get started free <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded-md bg-primary">
              <Zap className="size-3.5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-sm">FlowPilot AI</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2026 FlowPilot AI. Every meeting becomes execution.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
