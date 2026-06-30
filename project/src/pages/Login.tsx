import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuthStore } from "@/store"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  function fillDemo() {
    setEmail("demo@flowpilot.ai")
    setPassword("demo123")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const success = login(email, password)
    setLoading(false)
    if (success) {
      toast.success("Welcome back!")
      navigate("/dashboard")
    } else {
      toast.error("Invalid credentials. Try the demo login.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-chart-2/5 to-transparent border-r border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-xl bg-primary">
            <Zap className="size-5 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-bold text-xl">FlowPilot AI</span>
        </div>
        <div>
          <blockquote className="text-2xl font-semibold leading-relaxed mb-4 text-balance">
            "FlowPilot turned our 90-minute roadmap meeting into a fully executed sprint. Zero manual follow-up."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              JD
            </div>
            <div>
              <p className="font-medium text-sm">Jordan Davis</p>
              <p className="text-xs text-muted-foreground">VP Engineering, TechCorp</p>
            </div>
          </div>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>500+ teams</span>
          <span>·</span>
          <span>3h saved/meeting</span>
          <span>·</span>
          <span>94% coverage</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-9 rounded-xl bg-primary">
                <Zap className="size-5 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-bold text-xl">FlowPilot AI</span>
            </div>
          </div>

          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in to your FlowPilot workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "Signing in..." : <>Sign in <ArrowRight className="size-4" /></>}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={fillDemo}>
                  <Zap className="size-4 mr-2 text-primary" />
                  Demo Login
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Demo: demo@flowpilot.ai / demo123
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
