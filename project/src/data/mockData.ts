export const mockUser = {
  id: "u1",
  name: "Alex Chen",
  email: "alex@flowpilot.ai",
  avatar: "AC",
  role: "Product Lead",
}

export const mockMeetings = [
  {
    id: "m1",
    title: "Q4 Product Roadmap Review",
    date: "2026-07-02",
    time: "10:00 AM",
    duration: 60,
    status: "upcoming",
    attendees: [
      { name: "Alex Chen", avatar: "AC" },
      { name: "Jordan Lee", avatar: "JL" },
      { name: "Sam Park", avatar: "SP" },
      { name: "Morgan Wu", avatar: "MW" },
    ],
    description: "Review Q4 product roadmap and prioritize features for next quarter.",
    agenda: [
      "Review Q3 outcomes",
      "Present Q4 feature candidates",
      "Prioritization exercise",
      "Define success metrics",
    ],
    notes: "",
    project: "Product Strategy",
  },
  {
    id: "m2",
    title: "Engineering Sprint Planning",
    date: "2026-07-01",
    time: "2:00 PM",
    duration: 90,
    status: "upcoming",
    attendees: [
      { name: "Sam Park", avatar: "SP" },
      { name: "Taylor Kim", avatar: "TK" },
      { name: "Riley Zhang", avatar: "RZ" },
    ],
    description: "Plan sprint tasks and assign story points for the upcoming two-week sprint.",
    agenda: [
      "Sprint retrospective",
      "Backlog grooming",
      "Sprint goal definition",
      "Task assignment",
    ],
    notes: "",
    project: "FlowPilot Core",
  },
  {
    id: "m3",
    title: "Customer Discovery Interview - TechCorp",
    date: "2026-06-28",
    time: "11:00 AM",
    duration: 45,
    status: "completed",
    attendees: [
      { name: "Alex Chen", avatar: "AC" },
      { name: "Jordan Lee", avatar: "JL" },
    ],
    description: "Discovery interview with TechCorp to understand pain points with meeting management.",
    agenda: [
      "Introductions",
      "Current workflow walkthrough",
      "Pain point identification",
      "Solution feedback",
    ],
    notes: "Key insight: Users want automatic action items from meetings. Integration with Slack is highly requested. Follow-up: Send prototype for review.",
    project: "Customer Research",
    aiSummary: {
      summary: "TechCorp interview revealed that their team spends ~3 hours/week manually transcribing meeting notes. Primary pain: no automatic task creation from discussions. They use Slack + Jira and want seamless integration.",
      objectives: ["Reduce manual note-taking time", "Auto-generate tasks from meeting context", "Integrate with existing toolchain"],
      tasks: [
        { title: "Build Slack integration prototype", priority: "high", owner: "Riley Zhang" },
        { title: "Design automatic task extraction feature", priority: "high", owner: "Sam Park" },
        { title: "Create integration roadmap", priority: "medium", owner: "Alex Chen" },
      ],
      risks: ["Technical complexity of real-time transcription", "Slack API rate limits"],
      nextSteps: ["Send prototype to TechCorp by July 5", "Schedule follow-up demo", "Draft integration spec"],
    },
  },
  {
    id: "m4",
    title: "Design System Sync",
    date: "2026-06-27",
    time: "3:00 PM",
    duration: 30,
    status: "completed",
    attendees: [
      { name: "Morgan Wu", avatar: "MW" },
      { name: "Taylor Kim", avatar: "TK" },
    ],
    description: "Align on design system components for the new dashboard.",
    agenda: ["Component audit", "New component proposals", "Design token review"],
    notes: "Agreed on new card variants. Token naming convention finalized.",
    project: "Design System",
  },
  {
    id: "m5",
    title: "Investor Update Prep",
    date: "2026-07-08",
    time: "9:00 AM",
    duration: 60,
    status: "upcoming",
    attendees: [
      { name: "Alex Chen", avatar: "AC" },
      { name: "Jordan Lee", avatar: "JL" },
      { name: "Morgan Wu", avatar: "MW" },
    ],
    description: "Prepare materials for the Series A investor update meeting.",
    agenda: ["Metrics review", "Product demo script", "Q&A prep", "Slide review"],
    notes: "",
    project: "Fundraising",
  },
  {
    id: "m6",
    title: "Backend Architecture Review",
    date: "2026-06-25",
    time: "4:00 PM",
    duration: 120,
    status: "completed",
    attendees: [
      { name: "Riley Zhang", avatar: "RZ" },
      { name: "Sam Park", avatar: "SP" },
      { name: "Taylor Kim", avatar: "TK" },
    ],
    description: "Review proposed backend architecture for FlowPilot AI processing pipeline.",
    agenda: ["Current bottlenecks", "Proposed architecture", "Migration plan", "Resource requirements"],
    notes: "Decided to move to async processing queue. Redis for job management. Est. 3 weeks implementation.",
    project: "FlowPilot Core",
  },
]

export const mockTasks = [
  {
    id: "t1",
    title: "Design onboarding flow wireframes",
    description: "Create high-fidelity wireframes for the new user onboarding experience.",
    priority: "high",
    status: "backlog",
    assignee: { name: "Morgan Wu", avatar: "MW" },
    dueDate: "2026-07-10",
    labels: ["Design", "UX"],
    project: "FlowPilot Core",
    createdAt: "2026-06-20",
  },
  {
    id: "t2",
    title: "Implement AI processing queue",
    description: "Build async job queue for meeting audio processing using Redis.",
    priority: "high",
    status: "in-progress",
    assignee: { name: "Riley Zhang", avatar: "RZ" },
    dueDate: "2026-07-05",
    labels: ["Backend", "AI"],
    project: "FlowPilot Core",
    createdAt: "2026-06-22",
  },
  {
    id: "t3",
    title: "Write API documentation",
    description: "Document all REST API endpoints for external developer integration.",
    priority: "medium",
    status: "backlog",
    assignee: { name: "Sam Park", avatar: "SP" },
    dueDate: "2026-07-15",
    labels: ["Documentation"],
    project: "FlowPilot Core",
    createdAt: "2026-06-21",
  },
  {
    id: "t4",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment.",
    priority: "high",
    status: "in-progress",
    assignee: { name: "Taylor Kim", avatar: "TK" },
    dueDate: "2026-07-03",
    labels: ["DevOps"],
    project: "Infrastructure",
    createdAt: "2026-06-19",
  },
  {
    id: "t5",
    title: "User research synthesis",
    description: "Synthesize findings from 12 customer discovery interviews into actionable insights.",
    priority: "medium",
    status: "review",
    assignee: { name: "Jordan Lee", avatar: "JL" },
    dueDate: "2026-07-01",
    labels: ["Research", "Product"],
    project: "Customer Research",
    createdAt: "2026-06-15",
  },
  {
    id: "t6",
    title: "Landing page redesign",
    description: "Redesign the marketing landing page to improve conversion rates.",
    priority: "medium",
    status: "review",
    assignee: { name: "Morgan Wu", avatar: "MW" },
    dueDate: "2026-07-06",
    labels: ["Design", "Marketing"],
    project: "Marketing",
    createdAt: "2026-06-18",
  },
  {
    id: "t7",
    title: "Fix audio transcription accuracy",
    description: "Investigate and fix low accuracy rates for accented speech in transcriptions.",
    priority: "high",
    status: "in-progress",
    assignee: { name: "Riley Zhang", avatar: "RZ" },
    dueDate: "2026-07-04",
    labels: ["Bug", "AI"],
    project: "FlowPilot Core",
    createdAt: "2026-06-23",
  },
  {
    id: "t8",
    title: "Stripe billing integration",
    description: "Integrate Stripe for subscription management and usage-based billing.",
    priority: "high",
    status: "backlog",
    assignee: { name: "Sam Park", avatar: "SP" },
    dueDate: "2026-07-20",
    labels: ["Backend", "Billing"],
    project: "Monetization",
    createdAt: "2026-06-24",
  },
  {
    id: "t9",
    title: "Email notification system",
    description: "Build email digest system for daily task summaries and meeting reminders.",
    priority: "low",
    status: "backlog",
    assignee: { name: "Taylor Kim", avatar: "TK" },
    dueDate: "2026-07-25",
    labels: ["Backend", "Notifications"],
    project: "FlowPilot Core",
    createdAt: "2026-06-25",
  },
  {
    id: "t10",
    title: "Prepare Series A pitch deck",
    description: "Update pitch deck with latest metrics, product screenshots, and traction data.",
    priority: "high",
    status: "done",
    assignee: { name: "Alex Chen", avatar: "AC" },
    dueDate: "2026-06-28",
    labels: ["Fundraising"],
    project: "Fundraising",
    createdAt: "2026-06-10",
  },
  {
    id: "t11",
    title: "Mobile responsive audit",
    description: "Audit all pages for mobile responsiveness and fix critical issues.",
    priority: "medium",
    status: "done",
    assignee: { name: "Morgan Wu", avatar: "MW" },
    dueDate: "2026-06-29",
    labels: ["Frontend", "Mobile"],
    project: "FlowPilot Core",
    createdAt: "2026-06-20",
  },
  {
    id: "t12",
    title: "Set up error monitoring",
    description: "Integrate Sentry for error tracking and alerting in production.",
    priority: "medium",
    status: "done",
    assignee: { name: "Riley Zhang", avatar: "RZ" },
    dueDate: "2026-06-26",
    labels: ["DevOps", "Monitoring"],
    project: "Infrastructure",
    createdAt: "2026-06-17",
  },
  {
    id: "t13",
    title: "Competitor analysis report",
    description: "Research and document competitive landscape for the AI meeting space.",
    priority: "low",
    status: "review",
    assignee: { name: "Jordan Lee", avatar: "JL" },
    dueDate: "2026-07-08",
    labels: ["Research", "Product"],
    project: "Product Strategy",
    createdAt: "2026-06-22",
  },
  {
    id: "t14",
    title: "Database query optimization",
    description: "Identify and optimize slow database queries affecting dashboard load times.",
    priority: "medium",
    status: "in-progress",
    assignee: { name: "Sam Park", avatar: "SP" },
    dueDate: "2026-07-07",
    labels: ["Backend", "Performance"],
    project: "Infrastructure",
    createdAt: "2026-06-23",
  },
]

export const mockProjects = [
  {
    id: "p1",
    name: "FlowPilot Core",
    description: "Main product development - AI meeting processing and workspace generation",
    progress: 68,
    status: "active",
    startDate: "2026-05-01",
    deadline: "2026-08-31",
    members: [
      { name: "Riley Zhang", avatar: "RZ" },
      { name: "Sam Park", avatar: "SP" },
      { name: "Taylor Kim", avatar: "TK" },
      { name: "Morgan Wu", avatar: "MW" },
    ],
    color: "primary",
  },
  {
    id: "p2",
    name: "Customer Research",
    description: "User interviews, surveys, and competitive analysis",
    progress: 85,
    status: "active",
    startDate: "2026-06-01",
    deadline: "2026-07-15",
    members: [
      { name: "Jordan Lee", avatar: "JL" },
      { name: "Alex Chen", avatar: "AC" },
    ],
    color: "chart-3",
  },
  {
    id: "p3",
    name: "Infrastructure",
    description: "DevOps, monitoring, CI/CD and database optimization",
    progress: 45,
    status: "active",
    startDate: "2026-06-15",
    deadline: "2026-09-15",
    members: [
      { name: "Riley Zhang", avatar: "RZ" },
      { name: "Sam Park", avatar: "SP" },
      { name: "Taylor Kim", avatar: "TK" },
    ],
    color: "chart-4",
  },
]

export const mockAnalyticsData = {
  tasksOverTime: [
    { date: "Jun 23", completed: 4, created: 6 },
    { date: "Jun 24", completed: 5, created: 3 },
    { date: "Jun 25", completed: 3, created: 7 },
    { date: "Jun 26", completed: 7, created: 5 },
    { date: "Jun 27", completed: 6, created: 4 },
    { date: "Jun 28", completed: 8, created: 6 },
    { date: "Jun 29", completed: 5, created: 3 },
    { date: "Jun 30", completed: 9, created: 7 },
    { date: "Jul 1", completed: 6, created: 5 },
  ],
  tasksByStatus: [
    { name: "Done", value: 3, color: "var(--chart-3)" },
    { name: "In Progress", value: 4, color: "var(--chart-1)" },
    { name: "Review", value: 3, color: "var(--chart-4)" },
    { name: "Backlog", value: 4, color: "var(--chart-5)" },
  ],
  teamProductivity: [
    { name: "Riley Zhang", tasks: 12, meetings: 8 },
    { name: "Sam Park", tasks: 10, meetings: 7 },
    { name: "Morgan Wu", tasks: 9, meetings: 5 },
    { name: "Taylor Kim", tasks: 8, meetings: 6 },
    { name: "Jordan Lee", tasks: 7, meetings: 9 },
    { name: "Alex Chen", tasks: 6, meetings: 11 },
  ],
  meetingFrequency: [
    { week: "Week 24", meetings: 7 },
    { week: "Week 25", meetings: 9 },
    { week: "Week 26", meetings: 6 },
    { week: "Week 27", meetings: 11 },
  ],
  aiUsage: [
    { date: "Jun 23", queries: 23 },
    { date: "Jun 24", queries: 31 },
    { date: "Jun 25", queries: 18 },
    { date: "Jun 26", queries: 42 },
    { date: "Jun 27", queries: 38 },
    { date: "Jun 28", queries: 55 },
    { date: "Jun 29", queries: 29 },
    { date: "Jun 30", queries: 61 },
    { date: "Jul 1", queries: 47 },
  ],
}

export const mockActivities = [
  { id: "a1", user: "Riley Zhang", avatar: "RZ", action: "completed task", target: "Set up error monitoring", time: "5m ago", type: "task" },
  { id: "a2", user: "Jordan Lee", avatar: "JL", action: "uploaded meeting", target: "Customer Discovery Interview", time: "22m ago", type: "meeting" },
  { id: "a3", user: "Sam Park", avatar: "SP", action: "commented on", target: "API documentation", time: "1h ago", type: "comment" },
  { id: "a4", user: "Morgan Wu", avatar: "MW", action: "moved task to Review", target: "Landing page redesign", time: "2h ago", type: "task" },
  { id: "a5", user: "Taylor Kim", avatar: "TK", action: "started task", target: "Set up CI/CD pipeline", time: "3h ago", type: "task" },
  { id: "a6", user: "Alex Chen", avatar: "AC", action: "created meeting", target: "Q4 Product Roadmap Review", time: "4h ago", type: "meeting" },
  { id: "a7", user: "Riley Zhang", avatar: "RZ", action: "used AI to analyze", target: "Backend Architecture Review", time: "5h ago", type: "ai" },
]

export const mockWeeklyData = [
  { day: "Mon", tasks: 8, meetings: 2 },
  { day: "Tue", tasks: 12, meetings: 3 },
  { day: "Wed", tasks: 7, meetings: 4 },
  { day: "Thu", tasks: 15, meetings: 2 },
  { day: "Fri", tasks: 10, meetings: 3 },
  { day: "Sat", tasks: 4, meetings: 1 },
  { day: "Sun", tasks: 2, meetings: 0 },
]

export const mockTimelineItems = [
  {
    id: "tl1",
    title: "Sprint 12 - Core AI Features",
    start: "2026-06-16",
    end: "2026-06-30",
    progress: 90,
    type: "sprint",
    color: "primary",
    assignees: [{ name: "Riley Zhang", avatar: "RZ" }, { name: "Sam Park", avatar: "SP" }],
  },
  {
    id: "tl2",
    title: "Sprint 13 - Dashboard & Analytics",
    start: "2026-07-01",
    end: "2026-07-14",
    progress: 20,
    type: "sprint",
    color: "primary",
    assignees: [{ name: "Taylor Kim", avatar: "TK" }, { name: "Morgan Wu", avatar: "MW" }],
  },
  {
    id: "tl3",
    title: "Customer Research Phase 2",
    start: "2026-06-20",
    end: "2026-07-10",
    progress: 70,
    type: "project",
    color: "chart-3",
    assignees: [{ name: "Jordan Lee", avatar: "JL" }],
  },
  {
    id: "tl4",
    title: "Infrastructure Upgrade",
    start: "2026-07-01",
    end: "2026-07-31",
    progress: 15,
    type: "project",
    color: "chart-4",
    assignees: [{ name: "Riley Zhang", avatar: "RZ" }, { name: "Taylor Kim", avatar: "TK" }],
  },
  {
    id: "tl5",
    title: "Beta Launch",
    start: "2026-07-15",
    end: "2026-07-15",
    progress: 0,
    type: "milestone",
    color: "chart-5",
    assignees: [],
  },
  {
    id: "tl6",
    title: "Series A Pitch",
    start: "2026-07-08",
    end: "2026-07-08",
    progress: 0,
    type: "milestone",
    color: "chart-2",
    assignees: [{ name: "Alex Chen", avatar: "AC" }],
  },
  {
    id: "tl7",
    title: "API v2.0 Release",
    start: "2026-07-05",
    end: "2026-07-20",
    progress: 5,
    type: "project",
    color: "chart-1",
    assignees: [{ name: "Sam Park", avatar: "SP" }, { name: "Riley Zhang", avatar: "RZ" }],
  },
]

export const mockConversations = [
  {
    id: "c1",
    title: "Meeting Analysis - Q4 Roadmap",
    createdAt: "2026-06-30T10:30:00",
    messages: [
      {
        id: "msg1",
        role: "user",
        content: "Summarize the key decisions from the Q4 Roadmap Review meeting.",
        timestamp: "2026-06-30T10:30:00",
      },
      {
        id: "msg2",
        role: "assistant",
        content: `## Q4 Roadmap Review - Key Decisions

Based on the meeting notes, here are the key decisions made:

### Priorities for Q4
1. **AI transcription accuracy** - Targeting 95%+ accuracy across all accents
2. **Slack integration** - High customer demand, scheduled for Sprint 14
3. **Mobile app MVP** - Pushed to Q1 2027 due to resource constraints

### Success Metrics
- 100 active paying customers by end of Q4
- < 2s meeting processing time
- 4.5+ App Store rating

### Action Items
- Sam to finalize technical spec for Slack integration by July 5
- Morgan to create mobile app wireframes for Q1 planning
- Alex to update investor deck with Q4 roadmap`,
        timestamp: "2026-06-30T10:30:15",
      },
    ],
  },
  {
    id: "c2",
    title: "Task Prioritization Help",
    createdAt: "2026-06-29T15:00:00",
    messages: [
      {
        id: "msg3",
        role: "user",
        content: "What are today's top priorities based on current tasks?",
        timestamp: "2026-06-29T15:00:00",
      },
      {
        id: "msg4",
        role: "assistant",
        content: `## Today's Top Priorities

Based on your current task board, here are the most critical items:

### 🔴 High Priority (Due This Week)
1. **Fix audio transcription accuracy** - Due Jul 4, assigned to Riley
2. **Set up CI/CD pipeline** - Due Jul 3, assigned to Taylor
3. **Implement AI processing queue** - Due Jul 5, assigned to Riley

### ⚠️ Blocking Items
- CI/CD pipeline blocks the deployment of the transcription fix
- Recommend Taylor prioritizes this first

### 💡 Recommendation
Focus on CI/CD today, then unblock Riley on transcription. Both are on the critical path for the Beta Launch milestone.`,
        timestamp: "2026-06-29T15:00:08",
      },
    ],
  },
]
