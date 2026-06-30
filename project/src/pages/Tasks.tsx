import { useState } from "react"
import { Plus, Search, Calendar, Flag, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasksStore } from "@/store"
import type { Task } from "@/store"
import { toast } from "sonner"

const COLUMNS = [
  { id: "backlog", label: "Backlog", color: "text-muted-foreground" },
  { id: "in-progress", label: "In Progress", color: "text-primary" },
  { id: "review", label: "Review", color: "text-chart-4" },
  { id: "done", label: "Done", color: "text-chart-3" },
] as const

const priorityConfig = {
  high: { color: "bg-destructive/15 text-destructive", dot: "bg-destructive" },
  medium: { color: "bg-chart-4/15 text-chart-4", dot: "bg-chart-4" },
  low: { color: "bg-chart-3/15 text-chart-3", dot: "bg-chart-3" },
}

const labelColors = ["bg-primary/15 text-primary", "bg-chart-2/15 text-chart-2", "bg-chart-3/15 text-chart-3", "bg-chart-4/15 text-chart-4", "bg-chart-5/15 text-chart-5"]

function TaskCard({ task, onEdit, onDelete, isDragging }: {
  task: Task
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
  isDragging?: boolean
}) {
  const due = new Date(task.dueDate)
  const today = new Date()
  const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysLeft < 0

  return (
    <Card
      draggable
      className={`border-border/60 hover:border-primary/40 transition-all group cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50 rotate-2" : ""}`}
      onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
    >
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <p className="text-sm font-medium leading-snug">{task.title}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onEdit(task) }} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
              <Edit2 className="size-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(task.id) }} className="text-muted-foreground hover:text-destructive transition-colors p-0.5">
              <Trash2 className="size-3" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.labels.map((label, i) => (
            <span key={label} className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${labelColors[i % labelColors.length]}`}>
              {label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-5">
              <AvatarFallback className="text-[9px] bg-primary/15 text-primary">{task.assignee.avatar}</AvatarFallback>
            </Avatar>
            <Badge className={`text-[10px] px-1.5 py-0.5 h-auto border-0 ${priorityConfig[task.priority].color}`}>
              {task.priority}
            </Badge>
          </div>
          <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
            <Calendar className="size-3" />
            {isOverdue ? `${Math.abs(daysLeft)}d ago` : daysLeft === 0 ? "today" : `${daysLeft}d`}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

type TaskStatus = Task["status"]

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasksStore()
  const [search, setSearch] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "", description: "", priority: "medium" as Task["priority"],
    status: "backlog" as TaskStatus, assignee: "", dueDate: "", labels: "",
    project: "",
  })

  const filtered = tasks.filter((t) =>
    (!search || t.title.toLowerCase().includes(search.toLowerCase())) &&
    (filterPriority === "all" || t.priority === filterPriority)
  )

  function getColumnTasks(status: string) {
    return filtered.filter((t) => t.status === status)
  }

  function handleDrop(e: React.DragEvent, targetStatus: TaskStatus) {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    if (taskId) moveTask(taskId, targetStatus)
    setDragOverCol(null)
  }

  function resetForm() {
    setForm({ title: "", description: "", priority: "medium", status: "backlog", assignee: "", dueDate: "", labels: "", project: "" })
  }

  function openCreate() { resetForm(); setCreateOpen(true) }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (editTask) {
      updateTask(editTask.id, {
        title: form.title, description: form.description, priority: form.priority,
        status: form.status, dueDate: form.dueDate, project: form.project,
        labels: form.labels.split(",").map((s) => s.trim()).filter(Boolean),
        assignee: { name: form.assignee || "Unassigned", avatar: form.assignee.slice(0, 2).toUpperCase() || "UN" },
      })
      setEditTask(null)
      toast.success("Task updated")
    } else {
      addTask({
        id: `t${Date.now()}`,
        title: form.title, description: form.description, priority: form.priority,
        status: form.status, dueDate: form.dueDate, project: form.project,
        labels: form.labels.split(",").map((s) => s.trim()).filter(Boolean),
        assignee: { name: form.assignee || "Unassigned", avatar: form.assignee.slice(0, 2).toUpperCase() || "UN" },
        createdAt: new Date().toISOString().split("T")[0],
      })
      setCreateOpen(false)
      toast.success("Task created")
    }
    resetForm()
  }

  function handleEditOpen(task: Task) {
    setForm({
      title: task.title, description: task.description || "", priority: task.priority,
      status: task.status, assignee: task.assignee.name, dueDate: task.dueDate,
      labels: task.labels.join(", "), project: task.project,
    })
    setEditTask(task)
  }

  function handleDelete(id: string) {
    deleteTask(id)
    toast.success("Task deleted")
  }

  const isOpen = createOpen || !!editTask

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Tasks</h2>
          <p className="text-sm text-muted-foreground">{tasks.length} total tasks</p>
        </div>
        <Button onClick={openCreate}><Plus className="size-4 mr-2" />New Task</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-8 h-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="h-8 w-32 text-sm">
            <Flag className="size-3.5 mr-1.5" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
        {COLUMNS.map(({ id, label, color }) => {
          const colTasks = getColumnTasks(id)
          const isDragOver = dragOverCol === id
          return (
            <div
              key={id}
              className="flex flex-col w-72 shrink-0"
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(id) }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, id as TaskStatus)}
            >
              {/* Column header */}
              <div className={`flex items-center justify-between mb-3 px-1 ${isDragOver ? "opacity-100" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{label}</span>
                  <span className="text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon-xs" onClick={() => { setForm((f) => ({ ...f, status: id as TaskStatus })); setCreateOpen(true) }}>
                  <Plus className="size-3.5" />
                </Button>
              </div>

              {/* Drop zone */}
              <div
                className={`flex-1 space-y-2.5 min-h-24 rounded-xl transition-colors ${isDragOver ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}
              >
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete} />
                ))}
                {colTasks.length === 0 && (
                  <div className={`rounded-xl border-2 border-dashed p-6 text-center text-xs text-muted-foreground transition-colors ${isDragOver ? "border-primary/40 bg-primary/5" : "border-border/40"}`}>
                    {isDragOver ? "Drop here" : "No tasks"}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task form modal */}
      <Dialog open={isOpen} onOpenChange={(v) => { if (!v) { setCreateOpen(false); setEditTask(null); resetForm() } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="What needs to be done?" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Task["priority"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TaskStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COLUMNS.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Assignee</Label>
                <Input placeholder="Name" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Labels (comma separated)</Label>
              <Input placeholder="Frontend, Bug" value={form.labels} onChange={(e) => setForm({ ...form, labels: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Input placeholder="FlowPilot Core" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); setEditTask(null); resetForm() }}>Cancel</Button>
              <Button type="submit">{editTask ? "Save Changes" : "Create Task"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
