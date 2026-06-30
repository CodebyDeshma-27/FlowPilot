import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, Edit2, Send, Loader2, Sparkles, MessageSquare, CheckSquare, Video, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useChatStore } from "@/store"
import { sendAIMessage } from "@/services/api"
import { toast } from "sonner"
import type { Message } from "@/store"

const SUGGESTIONS = [
  "What are today's priorities?",
  "What tasks are overdue?",
  "Summarize the last meeting",
  "Identify current risks",
  "How is the team performing?",
]

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user"
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="size-7 shrink-0 mt-0.5">
        <AvatarFallback className={`text-xs ${isUser ? "bg-primary text-primary-foreground" : "bg-chart-2/20 text-chart-2"}`}>
          {isUser ? "AC" : <Sparkles className="size-3" />}
        </AvatarFallback>
      </Avatar>
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted/60 text-foreground rounded-tl-sm border border-border/40"
          }`}
        >
          <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
        </div>
        <span className="text-xs text-muted-foreground px-1">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="size-7 shrink-0">
        <AvatarFallback className="bg-chart-2/20 text-chart-2 text-xs"><Sparkles className="size-3" /></AvatarFallback>
      </Avatar>
      <div className="bg-muted/60 border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIChat() {
  const { conversations, currentConversationId, setCurrentConversation, createConversation, deleteConversation, renameConversation, addMessage, incrementQueryCount } = useChatStore()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const currentConv = conversations.find((c) => c.id === currentConversationId)

  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      setCurrentConversation(conversations[0].id)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConv?.messages, isTyping])

  async function handleSend() {
    if (!input.trim() || isTyping) return
    const content = input.trim()
    setInput("")

    let convId = currentConversationId
    if (!convId) {
      convId = createConversation(content.slice(0, 40))
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }
    addMessage(convId, userMsg)
    setIsTyping(true)
    incrementQueryCount()

    try {
      const conv = conversations.find((c) => c.id === convId)
      const history = [...(conv?.messages || []), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))
      const response = await sendAIMessage(history)
      addMessage(convId, {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      })
    } catch {
      toast.error("Failed to get response")
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 border-r border-border flex flex-col bg-muted/20 shrink-0">
        <div className="p-3">
          <Button className="w-full gap-2" size="sm" onClick={() => createConversation()}>
            <Plus className="size-3.5" /> New Chat
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setCurrentConversation(conv.id)}
                className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conv.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                }`}
              >
                <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-xs truncate">{conv.title}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setRenameId(conv.id); setRenameValue(conv.title) }}
                    className="p-0.5 hover:text-foreground text-muted-foreground transition-colors"
                  >
                    <Edit2 className="size-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                    className="p-0.5 hover:text-destructive text-muted-foreground transition-colors"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentConv ? (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-semibold">{currentConv.title}</span>
              <Badge variant="secondary" className="text-xs ml-auto">FlowPilot AI</Badge>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-5 max-w-3xl mx-auto">
                {currentConv.messages.length === 0 && (
                  <div className="pt-10 text-center">
                    <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10 mx-auto mb-4">
                      <Sparkles className="size-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">How can I help?</h3>
                    <p className="text-sm text-muted-foreground mb-6">Ask me about your tasks, meetings, or team performance.</p>
                    <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setInput(s) }}
                          className="text-xs px-3 py-2 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {currentConv.messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Context chips */}
            <div className="px-4 pt-2 flex gap-2 flex-wrap">
              <button className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors">
                <CheckSquare className="size-3" /> Include tasks
              </button>
              <button className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors">
                <Video className="size-3" /> Include meetings
              </button>
            </div>

            {/* Input */}
            <div className="p-3">
              <div className="relative rounded-xl border border-border bg-muted/20 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-all">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
                  }}
                  placeholder="Message FlowPilot AI..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 resize-none min-h-[52px] max-h-32 py-3 pr-14"
                  rows={2}
                />
                <Button
                  size="icon-sm"
                  className="absolute right-2.5 bottom-2.5"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
                  {isTyping ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1.5">Enter to send · Shift+Enter for newline</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No conversation selected</p>
              <Button size="sm" className="mt-3" onClick={() => createConversation()}>
                <Plus className="size-4 mr-2" /> New Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renameId} onOpenChange={() => setRenameId(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader><DialogTitle>Rename Conversation</DialogTitle></DialogHeader>
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { renameConversation(renameId!, renameValue); setRenameId(null) } }} />
          <Button onClick={() => { renameConversation(renameId!, renameValue); setRenameId(null) }}>
            <Check className="size-4 mr-2" /> Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
