import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockMeetings, mockTasks, mockConversations, mockUser } from "@/data/mockData"

// ---- Types ----

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  duration: number
  status: string
  attendees: { name: string; avatar: string }[]
  description: string
  agenda: string[]
  notes: string
  project: string
  aiSummary?: {
    summary: string
    objectives: string[]
    tasks: { title: string; priority: string; owner: string }[]
    risks: string[]
    nextSteps: string[]
  }
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  status: "backlog" | "in-progress" | "review" | "done"
  assignee: { name: string; avatar: string }
  dueDate: string
  labels: string[]
  project: string
  createdAt: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  messages: Message[]
}

// ---- Auth Store ----

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        if ((email === "alex@flowpilot.ai" || email === "demo@flowpilot.ai") && password.length >= 6) {
          set({ user: mockUser, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "flowpilot-auth" }
  )
)

// ---- Meetings Store ----

interface MeetingsStore {
  meetings: Meeting[]
  currentMeetingId: string | null
  addMeeting: (meeting: Meeting) => void
  updateMeeting: (id: string, updates: Partial<Meeting>) => void
  setCurrentMeeting: (id: string) => void
}

export const useMeetingsStore = create<MeetingsStore>()(
  persist(
    (set) => ({
      meetings: mockMeetings as Meeting[],
      currentMeetingId: null,
      addMeeting: (meeting) => set((s) => ({ meetings: [meeting, ...s.meetings] })),
      updateMeeting: (id, updates) =>
        set((s) => ({
          meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      setCurrentMeeting: (id) => set({ currentMeetingId: id }),
    }),
    { name: "flowpilot-meetings" }
  )
)

// ---- Tasks Store ----

interface TasksStore {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: Task["status"]) => void
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: mockTasks as Task[],
      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      updateTask: (id, updates) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      moveTask: (id, status) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
    }),
    { name: "flowpilot-tasks" }
  )
)

// ---- Chat Store ----

interface ChatStore {
  conversations: Conversation[]
  currentConversationId: string | null
  aiQueryCount: number
  setCurrentConversation: (id: string | null) => void
  createConversation: (title?: string) => string
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  addMessage: (conversationId: string, message: Message) => void
  incrementQueryCount: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: mockConversations as Conversation[],
      currentConversationId: null,
      aiQueryCount: 47,
      setCurrentConversation: (id) => set({ currentConversationId: id }),
      createConversation: (title) => {
        const id = `c${Date.now()}`
        set((s) => ({
          conversations: [
            { id, title: title || "New Conversation", createdAt: new Date().toISOString(), messages: [] },
            ...s.conversations,
          ],
          currentConversationId: id,
        }))
        return id
      },
      deleteConversation: (id) => {
        const { currentConversationId, conversations } = get()
        const remaining = conversations.filter((c) => c.id !== id)
        set({
          conversations: remaining,
          currentConversationId: currentConversationId === id ? (remaining[0]?.id ?? null) : currentConversationId,
        })
      },
      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === id ? { ...c, title } : c)),
        })),
      addMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
          ),
        })),
      incrementQueryCount: () => set((s) => ({ aiQueryCount: s.aiQueryCount + 1 })),
    }),
    { name: "flowpilot-chat" }
  )
)

// ---- Settings Store ----

interface SettingsStore {
  profile: { name: string; email: string; role: string; timezone: string; bio?: string }
  notifications: { email: boolean; push: boolean; inApp: boolean; taskReminders: boolean; meetingAlerts: boolean; weeklyDigest: boolean; aiInsights: boolean }
  ai: { model: string; temperature: number; maxTokens: number; apiKey?: string; autoSummarize: boolean; smartSuggestions: boolean }
  updateProfile: (updates: Partial<SettingsStore["profile"]>) => void
  updateNotifications: (updates: Partial<SettingsStore["notifications"]>) => void
  updateAI: (updates: Partial<SettingsStore["ai"]>) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      profile: { name: mockUser.name, email: mockUser.email, role: mockUser.role, timezone: "UTC-8", bio: "" },
      notifications: { email: true, push: false, inApp: true, taskReminders: true, meetingAlerts: true, weeklyDigest: false, aiInsights: true },
      ai: { model: "claude-3-5-sonnet", temperature: 0.7, maxTokens: 2048, apiKey: "", autoSummarize: true, smartSuggestions: true },
      updateProfile: (updates) => set((s) => ({ profile: { ...s.profile, ...updates } })),
      updateNotifications: (updates) => set((s) => ({ notifications: { ...s.notifications, ...updates } })),
      updateAI: (updates) => set((s) => ({ ai: { ...s.ai, ...updates } })),
    }),
    { name: "flowpilot-settings" }
  )
)
