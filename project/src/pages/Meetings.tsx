import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Video, Plus, Upload, Clock, Users, Calendar, CheckCircle2,
  PlayCircle, Search, Loader2, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMeetingsStore } from "@/store"
import { uploadMeeting } from "@/services/api"
import { toast } from "sonner"
import type { Meeting } from "@/store"

const statusColors = {
  upcoming: "bg-primary/15 text-primary",
  "in-progress": "bg-chart-4/15 text-chart-4",
  completed: "bg-chart-3/15 text-chart-3",
}

function MeetingCard({ meeting, onView }: { meeting: Meeting; onView: (m: Meeting) => void }) {
  return (
    <Card className="border-border/60 hover:border-primary/30 transition-all group cursor-pointer" onClick={() => onView(meeting)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{meeting.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{meeting.project}</p>
          </div>
          <Badge className={`text-xs shrink-0 border-0 ${statusColors[meeting.status as keyof typeof statusColors] || "bg-muted text-muted-foreground"}`}>
            {meeting.status}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Calendar className="size-3" />{meeting.date}</span>
          <span className="flex items-center gap-1"><Clock className="size-3" />{meeting.time}</span>
          <span className="flex items-center gap-1"><Clock className="size-3" />{meeting.duration}m</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="size-3 text-muted-foreground" />
            <div className="flex -space-x-1.5">
              {meeting.attendees.slice(0, 4).map((a) => (
                <Avatar key={a.name} className="size-5 ring-1 ring-background">
                  <AvatarFallback className="text-[9px] bg-primary/15 text-primary">{a.avatar}</AvatarFallback>
                </Avatar>
              ))}
              {meeting.attendees.length > 4 && (
                <span className="text-xs text-muted-foreground ml-2">+{meeting.attendees.length - 4}</span>
              )}
            </div>
          </div>
          {meeting.aiSummary && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Sparkles className="size-3 text-primary" /> AI
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Meetings() {
  const { meetings, addMeeting } = useMeetingsStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [detailMeeting, setDetailMeeting] = useState<Meeting | null>(null)

  const [form, setForm] = useState({
    title: "", date: "", time: "", duration: "60", description: "", project: "",
    attendees: "",
  })

  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = meetings
    .filter((m) => filter === "all" || m.status === filter)
    .filter((m) => !search || m.title.toLowerCase().includes(search.toLowerCase()))

  async function handleUpload(file?: File) {
    if (!file) return
    setProcessing(true)
    setUploadOpen(false)
    toast.loading("Processing meeting with AI...", { id: "upload" })
    try {
      await uploadMeeting(file)
      toast.success("Meeting processed! Workspace ready.", { id: "upload" })
      // Navigate to AI Workspace with a completed meeting
      const completedMeeting = meetings.find((m) => m.aiSummary)
      if (completedMeeting) {
        navigate("/ai-workspace")
      }
    } finally {
      setProcessing(false)
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const newMeeting: Meeting = {
      id: `m${Date.now()}`,
      title: form.title,
      date: form.date,
      time: form.time,
      duration: parseInt(form.duration),
      status: "upcoming",
      attendees: form.attendees.split(",").map((s) => ({ name: s.trim(), avatar: s.trim().slice(0, 2).toUpperCase() })),
      description: form.description,
      agenda: [],
      notes: "",
      project: form.project,
    }
    addMeeting(newMeeting)
    setCreateOpen(false)
    setForm({ title: "", date: "", time: "", duration: "60", description: "", project: "", attendees: "" })
    toast.success("Meeting created!")
  }

  return (
    <div className="p-6 space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Meetings</h2>
          <p className="text-sm text-muted-foreground">{meetings.length} meetings total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setUploadOpen(true)} disabled={processing}>
            {processing ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Upload className="size-4 mr-2" />}
            Upload Meeting
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4 mr-2" /> New Meeting
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Search meetings..." className="pl-8 h-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs px-3">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-3">Past</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Meeting grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
          <Video className="size-10 text-muted-foreground mb-3" />
          <p className="font-medium">No meetings found</p>
          <p className="text-sm text-muted-foreground mt-1">Upload a meeting or create a new one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} onView={setDetailMeeting} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!detailMeeting} onOpenChange={() => setDetailMeeting(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {detailMeeting && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{detailMeeting.title}</DialogTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><Calendar className="size-3.5" />{detailMeeting.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3.5" />{detailMeeting.time} · {detailMeeting.duration}m</span>
                  <Badge className={`text-xs border-0 ${statusColors[detailMeeting.status as keyof typeof statusColors]}`}>{detailMeeting.status}</Badge>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                {detailMeeting.description && <p className="text-sm text-muted-foreground">{detailMeeting.description}</p>}
                {detailMeeting.agenda.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Agenda</h4>
                    <ul className="space-y-1">
                      {detailMeeting.agenda.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2"><CheckCircle2 className="size-3.5 text-chart-3 mt-0.5 shrink-0" />{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Attendees</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailMeeting.attendees.map((a) => (
                      <div key={a.name} className="flex items-center gap-1.5 text-xs bg-muted/50 rounded-md px-2 py-1">
                        <Avatar className="size-5"><AvatarFallback className="text-[9px] bg-primary/15 text-primary">{a.avatar}</AvatarFallback></Avatar>
                        {a.name}
                      </div>
                    ))}
                  </div>
                </div>
                {detailMeeting.notes && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">{detailMeeting.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                {detailMeeting.aiSummary && (
                  <Button onClick={() => { setDetailMeeting(null); navigate("/ai-workspace") }}>
                    <Sparkles className="size-4 mr-2" /> View AI Workspace
                  </Button>
                )}
                <Button variant="outline" onClick={() => setDetailMeeting(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create meeting modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Meeting</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Sprint Planning" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["15", "30", "45", "60", "90", "120"].map((v) => (
                      <SelectItem key={v} value={v}>{v} min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Project</Label>
                <Input placeholder="FlowPilot Core" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Attendees (comma separated)</Label>
              <Input placeholder="Alice Smith, Bob Jones" value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Meeting description..." rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create Meeting</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload modal */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Upload Meeting</DialogTitle>
          </DialogHeader>
          <div
            className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/60 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">Drop meeting file here</p>
            <p className="text-xs text-muted-foreground mt-1">MP3, MP4, M4A, WAV, TXT</p>
            <Button size="sm" variant="outline" className="mt-4">Browse Files</Button>
          </div>
          <input ref={fileRef} type="file" accept="audio/*,video/*,.txt" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
          <DialogFooter>
            <Button variant="outline" onClick={() => handleUpload(new File(["mock"], "meeting.txt", { type: "text/plain" }))}>
              <PlayCircle className="size-4 mr-2" /> Demo Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
