import { useState } from "react"
import {
  Sparkles, Copy, Trash2, Send, ChevronRight,
  AlertTriangle, CheckCircle2, Target, ArrowRight, Users, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMeetingsStore } from "@/store"
import { processAIWorkspace } from "@/services/api"
import { toast } from "sonner"

const PROMPT_TEMPLATES = [
  { label: "Summarize Meeting", prompt: "Summarize the key decisions and outcomes from this meeting." },
  { label: "Generate Task List", prompt: "Generate a detailed task list with owners and priorities from this meeting." },
  { label: "Write Project Brief", prompt: "Write a comprehensive project brief based on this meeting's discussions." },
  { label: "Code Review Notes", prompt: "Extract all technical decisions, code changes discussed, and technical debt items." },
  { label: "Risk Analysis", prompt: "Identify and analyze all risks, blockers, and concerns mentioned in this meeting." },
  { label: "Next Steps", prompt: "List all next steps, follow-ups, and action items with owners and deadlines." },
]

const priorityColors = {
  high: "bg-destructive/15 text-destructive border-0",
  medium: "bg-chart-4/15 text-chart-4 border-0",
  low: "bg-chart-3/15 text-chart-3 border-0",
}

export default function AIWorkspace() {
  const { meetings } = useMeetingsStore()
  const meeting = meetings.find((m) => m.aiSummary) || meetings[0]
  const workspace = meeting?.aiSummary

  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{ prompt: string; output: string }[]>([])
  const [charCount, setCharCount] = useState(0)

  async function handleSubmit() {
    if (!prompt.trim()) return
    setLoading(true)
    const userPrompt = prompt
    setPrompt("")
    setCharCount(0)
    try {
      const result = await processAIWorkspace(
        workspace
          ? `Context from meeting "${meeting.title}":\n${workspace.summary}\n\nUser question: ${userPrompt}`
          : userPrompt
      )
      setOutput(result)
      setHistory((h) => [{ prompt: userPrompt, output: result }, ...h.slice(0, 9)])
    } catch {
      toast.error("Failed to get AI response")
    } finally {
      setLoading(false)
    }
  }

  function handleTemplateClick(p: string) {
    setPrompt(p)
    setCharCount(p.length)
  }

  function copyOutput() {
    navigator.clipboard.writeText(output)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left: input panel */}
      <div className="w-72 border-r border-border flex flex-col bg-muted/20 shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-primary" />
            <h3 className="font-semibold text-sm">AI Workspace</h3>
          </div>
          {meeting && <p className="text-xs text-muted-foreground truncate">{meeting.title}</p>}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Templates</p>
            {PROMPT_TEMPLATES.map(({ label, prompt: p }) => (
              <button
                key={label}
                onClick={() => handleTemplateClick(p)}
                className="w-full text-left text-xs px-2.5 py-2 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                {label}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="p-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">History</p>
              {history.slice(0, 5).map((h, i) => (
                <button
                  key={i}
                  onClick={() => { setPrompt(h.prompt); setOutput(h.output) }}
                  className="w-full text-left text-xs px-2.5 py-2 rounded-md hover:bg-accent text-foreground/70 hover:text-foreground transition-colors truncate block"
                >
                  {h.prompt.slice(0, 40)}...
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right: output panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Meeting workspace cards */}
        {workspace && !output && (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4 max-w-4xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-4 text-primary" />
                <h3 className="font-semibold">{meeting.title}</h3>
                <Badge variant="secondary">AI Generated</Badge>
              </div>

              {/* Summary */}
              <Card className="border-border/60">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Target className="size-4 text-primary" /> Meeting Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{workspace.summary}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Objectives */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-chart-3" /> Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-2">
                    {workspace.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className="size-5 rounded-full bg-chart-3/15 text-chart-3 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                        {obj}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Risks */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <AlertTriangle className="size-4 text-chart-5" /> Risks Identified
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-2">
                    {workspace.risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="size-3.5 text-chart-5 mt-0.5 shrink-0" />
                        {risk}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Tasks */}
              <Card className="border-border/60">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" /> Generated Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-2">
                  {workspace.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/40 last:border-0">
                      <Badge className={`text-xs shrink-0 ${priorityColors[task.priority as keyof typeof priorityColors]}`}>{task.priority}</Badge>
                      <span className="flex-1">{task.title}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Users className="size-3" />{task.owner}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="border-border/60">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ArrowRight className="size-4 text-chart-4" /> Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-2">
                  {workspace.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-chart-4 shrink-0" />
                      {step}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}

        {/* AI output */}
        {output && (
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-3xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-sm font-semibold">AI Response</span>
                </div>
                <div className="flex gap-2">
                  <Button size="xs" variant="outline" onClick={copyOutput}>
                    <Copy className="size-3.5 mr-1" /> Copy
                  </Button>
                  <Button size="xs" variant="ghost" onClick={() => setOutput("")}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted/30 rounded-xl border border-border/60 p-5">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground">{output}</pre>
              </div>
              {charCount > 0 && (
                <p className="text-xs text-muted-foreground mt-2">~{Math.ceil(output.length / 4)} tokens used</p>
              )}
            </div>
          </ScrollArea>
        )}

        {!output && !workspace && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">AI Workspace Ready</p>
              <p className="text-sm text-muted-foreground mt-1">Select a template or write a custom prompt</p>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="relative">
            <Textarea
              placeholder="Ask AI anything about your meetings, tasks, or projects..."
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); setCharCount(e.target.value.length) }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
              rows={3}
              className="pr-14 resize-none"
            />
            <div className="absolute right-3 bottom-3 flex items-end gap-2">
              {charCount > 0 && <span className="text-xs text-muted-foreground">{charCount}</span>}
              <Button size="icon-sm" onClick={handleSubmit} disabled={loading || !prompt.trim()}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Enter to send · Shift+Enter for newline</p>
        </div>
      </div>
    </div>
  )
}
