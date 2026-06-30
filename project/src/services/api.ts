// API service — prepared for backend integration.
// Currently uses mock data and simulated responses.
// To connect to a real backend, replace these functions with actual fetch calls.

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ""

export async function getDashboard() {
  // Replace with: return fetch(`${BASE_URL}/api/dashboard`).then(r => r.json())
  return { success: true }
}

export async function getMeetings() {
  return { success: true }
}

export async function getMeeting(id: string) {
  return { success: true, id }
}

export async function uploadMeeting(_file: File) {
  // Simulate processing time
  await new Promise((r) => setTimeout(r, 2500))
  return { success: true, meetingId: `m${Date.now()}` }
}

export async function getWorkspace(meetingId: string) {
  return { success: true, meetingId }
}

export async function getTasks() {
  return { success: true }
}

export async function getAnalytics(_range: "7d" | "30d" | "90d") {
  return { success: true }
}

export async function sendAIMessage(messages: { role: string; content: string }[]): Promise<string> {
  // If API key is configured, call Anthropic API
  if (ANTHROPIC_KEY) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages,
        }),
      })
      const data = await response.json()
      return data.content?.[0]?.text || "Sorry, I could not generate a response."
    } catch {
      // Fall through to mock
    }
  }

  // Mock AI responses
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200))

  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

  if (lastMessage.includes("priorit") || lastMessage.includes("today")) {
    return `## Today's Priorities\n\nBased on your current task board:\n\n### 🔴 Critical (Due This Week)\n1. **Fix audio transcription accuracy** — Due Jul 4, Riley\n2. **Set up CI/CD pipeline** — Due Jul 3, Taylor\n\n### ⚠️ Watch Items\n- Database query optimization is 50% complete\n- Stripe billing integration hasn't started yet\n\n### 💡 Recommendation\nFocus on CI/CD first — it's blocking other deployments. Riley should then tackle the transcription bug.`
  }

  if (lastMessage.includes("overdue") || lastMessage.includes("late")) {
    return `## Overdue Tasks\n\nGood news — no tasks are currently overdue! The closest deadlines are:\n\n| Task | Due | Assignee |\n|------|-----|----------|\n| CI/CD Pipeline | Jul 3 | Taylor |\n| Transcription Fix | Jul 4 | Riley |\n| AI Processing Queue | Jul 5 | Riley |\n\n**Suggestion:** Consider checking in with Riley — they have two high-priority items due back-to-back.`
  }

  if (lastMessage.includes("summar") || lastMessage.includes("meeting")) {
    return `## Meeting Summary\n\nHere's a synthesis of your recent meetings:\n\n**Key themes across 6 meetings:**\n- AI processing pipeline is the top technical priority\n- Customer demand for Slack integration is high\n- Backend architecture review resulted in async queue decision\n\n**Upcoming:** Q4 Roadmap Review on Jul 2 — consider preparing updated metrics for the team.`
  }

  if (lastMessage.includes("risk") || lastMessage.includes("block")) {
    return `## Risk Assessment\n\n### 🔴 High Risk\n- **Transcription accuracy** — Could delay Beta Launch milestone\n\n### 🟡 Medium Risk\n- **Stripe billing** hasn't started; needed before public launch\n- **Riley** has 2 high-priority tasks with overlapping deadlines\n\n### 🟢 Low Risk\n- Design system is progressing well\n- Customer research is 85% complete\n\n**Recommendation:** Assign additional support to Riley's transcription task.`
  }

  return `I'm FlowPilot's AI assistant. I can help you with:\n\n- **Meeting summaries** — "Summarize the last meeting"\n- **Task priorities** — "What are today's priorities?"\n- **Risk analysis** — "What are the current risks?"\n- **Overdue items** — "What tasks are overdue?"\n- **Team insights** — "How is the team performing?"\n\nWhat would you like to explore?`
}

export async function processAIWorkspace(prompt: string): Promise<string> {
  return sendAIMessage([{ role: "user", content: prompt }])
}
