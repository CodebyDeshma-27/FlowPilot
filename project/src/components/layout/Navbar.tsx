import { useLocation } from "react-router-dom"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/meetings": "Meetings",
  "/ai-workspace": "AI Workspace",
  "/tasks": "Tasks",
  "/timeline": "Timeline",
  "/analytics": "Analytics",
  "/ai-chat": "AI Chat",
  "/settings": "Settings",
}

export function Navbar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const title = pageTitles[location.pathname] || "FlowPilot AI"

  return (
    <header className="flex items-center gap-4 h-14 px-6 border-b border-border bg-background shrink-0">
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 h-8 px-3 rounded-md border border-input bg-muted/40 text-muted-foreground text-sm w-56 cursor-pointer hover:border-ring transition-colors">
        <Search className="size-3.5 shrink-0" />
        <span className="text-xs">Search anything...</span>
        <span className="ml-auto text-xs opacity-60">⌘K</span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <Bell className="size-4" />
        </Button>
        <Badge className="absolute -top-1 -right-1 size-4 p-0 flex items-center justify-center text-[10px] min-w-0 rounded-full">
          3
        </Badge>
      </div>

      {/* Theme toggle */}
      <ModeToggle />

      {/* Avatar */}
      <Avatar className="size-7 cursor-pointer">
        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
          {user?.avatar || "U"}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}
