import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Video,
  Sparkles,
  CheckSquare,
  GitBranch,
  BarChart2,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuthStore } from "@/store"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Video, label: "Meetings", path: "/meetings" },
  { icon: Sparkles, label: "AI Workspace", path: "/ai-workspace" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: GitBranch, label: "Timeline", path: "/timeline" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: MessageSquare, label: "AI Chat", path: "/ai-chat" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border", collapsed && "px-3 justify-center")}>
        <div className="flex items-center justify-center size-8 rounded-lg bg-primary shrink-0">
          <Zap className="size-4 text-primary-foreground fill-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-base tracking-tight text-sidebar-foreground">FlowPilot</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          const item = (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={path}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          }
          return item
        })}
      </nav>

      {/* User */}
      <div className={cn("px-2 py-3 border-t border-sidebar-border", collapsed && "px-2")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full" onClick={handleLogout}>
                <LogOut className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2.5 px-1 py-1.5">
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {user?.avatar || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user?.role}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs" onClick={handleLogout} className="shrink-0 text-sidebar-foreground/50 hover:text-sidebar-foreground">
                  <LogOut className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-[4.5rem] z-10 flex items-center justify-center size-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>
    </aside>
  )
}
