import { useState } from "react"
import { User, Bell, Palette, Zap, Link, Shield, Save, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSettingsStore } from "@/store"
import { useTheme } from "@/components/theme-provider"
import { toast } from "sonner"

const INTEGRATIONS = [
  { name: "GitHub", description: "Sync issues as tasks", icon: "GH", connected: true, color: "bg-foreground/10" },
  { name: "Slack", description: "Send meeting summaries", icon: "SL", connected: false, color: "bg-chart-1/15" },
  { name: "Google Calendar", description: "Sync meetings", icon: "GC", connected: true, color: "bg-chart-3/15" },
  { name: "Jira", description: "Import/export tickets", icon: "JI", connected: false, color: "bg-primary/15" },
  { name: "Notion", description: "Export meeting notes", icon: "NT", connected: false, color: "bg-muted" },
  { name: "Linear", description: "Sync issues and sprints", icon: "LN", connected: false, color: "bg-chart-2/15" },
]

export default function Settings() {
  const { profile, notifications, ai, updateProfile, updateNotifications, updateAI } = useSettingsStore()
  const { theme, setTheme } = useTheme()
  const [profileForm, setProfileForm] = useState({ ...profile })
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  function handleProfileSave() {
    updateProfile(profileForm)
    toast.success("Profile saved")
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="h-9 mb-6">
          <TabsTrigger value="profile" className="text-xs gap-1.5"><User className="size-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs gap-1.5"><Palette className="size-3.5" />Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1.5"><Bell className="size-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs gap-1.5"><Zap className="size-3.5" />AI Config</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs gap-1.5"><Link className="size-3.5" />Integrations</TabsTrigger>
          <TabsTrigger value="account" className="text-xs gap-1.5"><Shield className="size-3.5" />Account</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Public Profile</CardTitle>
              <CardDescription className="text-xs">How others see you in FlowPilot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="text-xl bg-primary/15 text-primary">
                    {profileForm.name?.slice(0, 2).toUpperCase() || "AC"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button size="sm" variant="outline">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Role</Label>
                  <Input value={profileForm.role} onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })} placeholder="Product Lead" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Timezone</Label>
                  <Select value={profileForm.timezone} onValueChange={(v) => setProfileForm({ ...profileForm, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                      <SelectItem value="UTC+5:30">India (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC+8">China Standard (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bio</Label>
                <Textarea placeholder="A short bio about you..." rows={2} value={profileForm.bio || ""} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} />
              </div>
              <Button size="sm" onClick={handleProfileSave}><Save className="size-3.5 mr-1.5" />Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Theme</CardTitle>
              <CardDescription className="text-xs">Choose your preferred color scheme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ] as const).map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                      theme === value ? "border-primary bg-primary/5" : "border-border hover:border-border/80"
                    }`}
                  >
                    <Icon className={`size-5 ${theme === value ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${theme === value ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Interface Density</CardTitle>
              <CardDescription className="text-xs">Adjust the spacing and size of UI elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Compact", "Default", "Comfortable"].map((density) => (
                <div key={density} className="flex items-center justify-between">
                  <span className="text-sm">{density}</span>
                  <Switch checked={density === "Default"} onCheckedChange={() => toast.info(`${density} density coming soon`)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email", label: "Email notifications", description: "Receive updates via email" },
                { key: "taskReminders", label: "Task reminders", description: "Get reminded about due tasks" },
                { key: "meetingAlerts", label: "Meeting alerts", description: "Notifications before meetings" },
                { key: "weeklyDigest", label: "Weekly digest", description: "Summary of your week every Monday" },
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                  <Switch
                    checked={notifications[key as keyof typeof notifications] as boolean}
                    onCheckedChange={(v) => updateNotifications({ [key]: v })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Push Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "push", label: "Browser push notifications", description: "In-browser notification popups" },
                { key: "aiInsights", label: "AI insights", description: "When AI generates new insights" },
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                  <Switch
                    checked={notifications[key as keyof typeof notifications] as boolean}
                    onCheckedChange={(v) => updateNotifications({ [key]: v })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Config */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">AI Model</CardTitle>
              <CardDescription className="text-xs">Configure the AI powering FlowPilot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Model Provider</Label>
                <Select value={ai.model} onValueChange={(v) => updateAI({ model: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">API Key</Label>
                <div className="relative">
                  <Input
                    type={apiKeyVisible ? "text" : "password"}
                    value={ai.apiKey || ""}
                    onChange={(e) => updateAI({ apiKey: e.target.value })}
                    placeholder="sk-ant-... or sk-..."
                    className="pr-20"
                  />
                  <button
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {apiKeyVisible ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Stored locally. Never sent to our servers.</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-summarize meetings</p>
                    <p className="text-xs text-muted-foreground">Automatically generate AI summaries after meetings</p>
                  </div>
                  <Switch checked={ai.autoSummarize} onCheckedChange={(v) => updateAI({ autoSummarize: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Smart task suggestions</p>
                    <p className="text-xs text-muted-foreground">AI suggests tasks from meeting summaries</p>
                  </div>
                  <Switch checked={ai.smartSuggestions} onCheckedChange={(v) => updateAI({ smartSuggestions: v })} />
                </div>
              </div>
              <Button size="sm" onClick={() => toast.success("AI settings saved")}><Save className="size-3.5 mr-1.5" />Save AI Settings</Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "AI Queries", value: "142" },
                  { label: "Tokens Used", value: "~84k" },
                  { label: "Summaries", value: "12" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-lg bg-muted/40">
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Connected Apps</CardTitle>
              <CardDescription className="text-xs">Manage your third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {INTEGRATIONS.map(({ name, description, icon, connected, color }) => (
                <div key={name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`size-9 rounded-lg ${color} flex items-center justify-center text-xs font-bold`}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {connected && <Badge variant="secondary" className="text-xs text-chart-3">Connected</Badge>}
                    <Button
                      size="sm"
                      variant={connected ? "outline" : "default"}
                      onClick={() => toast.info(`${connected ? "Disconnecting from" : "Connecting to"} ${name}...`)}
                    >
                      {connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <Button size="sm" onClick={() => toast.success("Password updated")}><Save className="size-3.5 mr-1.5" />Update Password</Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Data & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="sm" variant="outline" onClick={() => toast.success("Export started — check your email")}>Export My Data</Button>
              <Separator />
              <div>
                <p className="text-sm font-medium text-destructive">Danger Zone</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">These actions are irreversible.</p>
                <Button size="sm" variant="destructive" onClick={() => toast.error("Account deletion requires email confirmation")}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
